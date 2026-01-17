import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';
import { DropboxService } from '../dropbox.service';

@Injectable()
export class NewFileHook {
  private readonly logger = new Logger(NewFileHook.name);
  private engine: AutomationEngine;

  constructor(
    private authRepo: ServiceAuthRepository,
    private dropboxService: DropboxService,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
    this.logger.log('AutomationEngine attached');
  }

  private versionKey(f: any) {
    const rev = f?.rev ?? '';
    const sm = f?.server_modified ?? '';
    return rev || sm || '';
  }

  @Cron('*/20 * * * * *')
  async poll() {
    if (!this.engine) {
      this.logger.warn('poll() called but engine is not set');
      return;
    }

    this.logger.debug('Polling for new Dropbox files...');

    const subscribed = await this.authRepo.findUsersWithService('dropbox');
    this.logger.debug(`Found ${subscribed.length} dropbox-connected users`);

    for (const record of subscribed) {
      const userId = record.userId;
      this.logger.debug(`Processing userId=${userId}`);

      try {
        const rawMeta =
          record.metadata &&
          typeof record.metadata === 'object' &&
          !Array.isArray(record.metadata)
            ? (record.metadata as Record<string, any>)
            : {};

        const known: Record<string, string> = rawMeta.dropboxKnown ?? {};
        const knownCount = Object.keys(known).length;

        const { entries } = await this.dropboxService.listChanges(userId);

        this.logger.debug(`userId=${userId} changes entries=${entries.length}`);

        const files = entries.filter((e: any) => e?.['.tag'] === 'file' && e?.id);
        this.logger.debug(`userId=${userId} file entries=${files.length}`);

        if (files.length === 0) {
          this.logger.debug(`userId=${userId} no file entries`);
          continue;
        }

        const sorted = [...files].sort((a: any, b: any) => {
          const da = a?.server_modified ? Date.parse(a.server_modified) : 0;
          const db = b?.server_modified ? Date.parse(b.server_modified) : 0;
          return db - da;
        });

        const toEmit: any[] = [];
        for (const f of sorted) {
          const id = f.id as string;
          if (!known[id]) {
            toEmit.push(f);
          }
        }

        if (toEmit.length === 0) {
          this.logger.debug(
            `userId=${userId} no new files (known=${knownCount})`,
          );
          continue;
        }

        const emitInOrder = [...toEmit].reverse();
        this.logger.log(`userId=${userId} emitting ${emitInOrder.length} new file event(s)`);

        for (const f of emitInOrder) {
          const id = f.id as string;
          const ver = this.versionKey(f);

          this.logger.log(`userId=${userId} NEW FILE detected: ${id}`);

          try {
            await this.engine.emitHookEvent({
              userId,
              actionService: 'dropbox',
              actionType: 'new_file',
              payload: f,
            });
          } catch (e: any) {
            this.logger.error(
              `userId=${userId} emitHookEvent failed for fileId=${id}: ${e?.message ?? e}`,
              e?.stack,
            );
          }

          known[id] = ver || 'seen';
        }

        await this.authRepo.updateMetadata(userId, 'dropbox', {
          dropboxKnown: known,
        });

        this.logger.debug(
          `userId=${userId} dropboxKnown updated (now=${Object.keys(known).length})`,
        );
      } catch (err: any) {
        this.logger.error(
          `userId=${userId} unexpected error`,
          err?.stack || String(err),
        );
      }
    }

    this.logger.debug('Polling cycle completed');
  }
}

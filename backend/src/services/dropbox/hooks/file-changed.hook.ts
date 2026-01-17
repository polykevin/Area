import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';
import { DropboxService } from '../dropbox.service';

@Injectable()
export class FileChangedHook {
  private readonly logger = new Logger(FileChangedHook.name);
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

    this.logger.debug('Polling for Dropbox file changes...');

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

        let emitted = 0;

        for (const f of files) {
          const id = f.id as string;
          const ver = this.versionKey(f);

          const prev = known[id];

          if (!prev) {
            continue;
          }

          if (ver && prev === ver) {
            continue;
          }

          this.logger.log(`userId=${userId} FILE CHANGED detected: ${id}`);

          try {
            await this.engine.emitHookEvent({
              userId,
              actionService: 'dropbox',
              actionType: 'file_changed',
              payload: f,
            });
          } catch (e: any) {
            this.logger.error(
              `userId=${userId} emitHookEvent failed for fileId=${id}: ${e?.message ?? e}`,
              e?.stack,
            );
          }

          known[id] = ver || 'seen';
          emitted++;
        }

        if (emitted > 0) {
          await this.authRepo.updateMetadata(userId, 'dropbox', {
            dropboxKnown: known,
          });
          this.logger.debug(
            `userId=${userId} file_changed emitted=${emitted} (known=${knownCount} -> ${Object.keys(known).length})`,
          );
        } else {
          this.logger.debug(
            `userId=${userId} no changed files (known=${knownCount})`,
          );
        }
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

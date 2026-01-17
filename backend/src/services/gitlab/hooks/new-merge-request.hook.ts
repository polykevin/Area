import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';
import { GitLabService } from '../gitlab.service';
import { AreasService } from '../../../areas/area.service';

@Injectable()
export class NewMergeRequestHook {
  private readonly logger = new Logger(NewMergeRequestHook.name);
  private engine: AutomationEngine;

  constructor(
    private authRepo: ServiceAuthRepository,
    private gitlabService: GitLabService,
    private areasService: AreasService,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
    this.logger.log('AutomationEngine attached');
  }

  private versionKey(mr: any) {
    const ua = mr?.updated_at ?? '';
    return ua || '';
  }

  private normalizeMeta(record: any): Record<string, any> {
    return record.metadata &&
      typeof record.metadata === 'object' &&
      !Array.isArray(record.metadata)
      ? (record.metadata as Record<string, any>)
      : {};
  }

  private extractProjectIdsFromAreas(areas: any[]): number[] {
    const set = new Set<number>();

    for (const a of areas ?? []) {
      if (a?.actionService !== 'gitlab') continue;
      if (a?.actionType !== 'new_merge_request') continue;

      const raw = a?.actionParams?.projectId;
      const pid = Number(raw);

      if (!Number.isNaN(pid) && pid > 0) set.add(pid);
    }

    return Array.from(set.values());
  }

  @Cron('*/20 * * * * *')
  async poll() {
    if (!this.engine) {
      this.logger.warn('poll() called but engine is not set');
      return;
    }

    this.logger.debug('Polling for new GitLab merge requests...');

    const subscribed = await this.authRepo.findUsersWithService('gitlab');
    this.logger.debug(`Found ${subscribed.length} gitlab-connected users`);

    for (const record of subscribed) {
      const userId = record.userId;
      this.logger.debug(`Processing userId=${userId}`);

      try {
        const areas = await this.areasService.findByUser(userId);

        const projectIds = this.extractProjectIdsFromAreas(areas);
        if (projectIds.length === 0) {
          this.logger.debug(`userId=${userId} no gitlab/new_merge_request areas configured`);
          continue;
        }

        const rawMeta = this.normalizeMeta(record);

        const knownByProject: Record<string, Record<string, string>> =
          rawMeta.gitlabKnownMrsByProject ?? {};

        for (const projectId of projectIds) {
          const projectKey = String(projectId);
          const known: Record<string, string> = knownByProject[projectKey] ?? {};
          const knownCount = Object.keys(known).length;

          const mrs = await (this.gitlabService as any).listProjectMergeRequests(
            userId,
            projectId,
            50,
          );

          this.logger.debug(
            `userId=${userId} projectId=${projectId} merge_requests=${mrs.length}`,
          );

          if (!Array.isArray(mrs) || mrs.length === 0) continue;

          const sorted = [...mrs].sort((a: any, b: any) => {
            const da = a?.created_at ? Date.parse(a.created_at) : 0;
            const db = b?.created_at ? Date.parse(b.created_at) : 0;
            return db - da;
          });

          const isFirstRunForProject = Object.keys(known).length === 0;
          if (isFirstRunForProject) {
            for (const mr of sorted) {
              const id = String(mr.id ?? '');
              if (!id) continue;
              known[id] = this.versionKey(mr) || 'seen';
            }

            knownByProject[projectKey] = known;

            this.logger.log(
              `userId=${userId} projectId=${projectId} seeded known MRs (${Object.keys(known).length})`,
            );
            continue;
          }

          const toEmit: any[] = [];
          for (const mr of sorted) {
            const id = String(mr.id ?? '');
            if (!id) continue;
            if (!known[id]) toEmit.push(mr);
          }

          if (toEmit.length === 0) {
            this.logger.debug(
              `userId=${userId} projectId=${projectId} no new merge requests (known=${knownCount})`,
            );
            continue;
          }

          const emitInOrder = [...toEmit].reverse();
          this.logger.log(
            `userId=${userId} projectId=${projectId} emitting ${emitInOrder.length} new MR event(s)`,
          );

          for (const mr of emitInOrder) {
            const id = String(mr.id ?? '');
            const ver = this.versionKey(mr);

            this.logger.log(
              `userId=${userId} projectId=${projectId} NEW MERGE REQUEST detected: ${id}`,
            );

            try {
              await this.engine.emitHookEvent({
                userId,
                actionService: 'gitlab',
                actionType: 'new_merge_request',
                payload: mr,
              });
            } catch (e: any) {
              this.logger.error(
                `userId=${userId} projectId=${projectId} emitHookEvent failed for mrId=${id}: ${e?.message ?? e}`,
                e?.stack,
              );
            }

            known[id] = ver || 'seen';
          }

          knownByProject[projectKey] = known;
        }

        await this.authRepo.updateMetadata(userId, 'gitlab', {
          gitlabKnownMrsByProject: knownByProject,
        });

        this.logger.debug(
          `userId=${userId} gitlabKnownMrsByProject updated (projects=${Object.keys(knownByProject).length})`,
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

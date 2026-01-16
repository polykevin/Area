import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';
import { GitLabService } from '../gitlab.service';
import { AreasService } from '../../../areas/area.service';

@Injectable()
export class NewIssueHook {
  private readonly logger = new Logger(NewIssueHook.name);
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

  private versionKey(i: any) {
    const ua = i?.updated_at ?? '';
    return ua || '';
  }

  private extractProjectIdsFromAreas(areas: any[]): number[] {
    const set = new Set<number>();

    for (const a of areas ?? []) {
      if (a?.actionService !== 'gitlab') continue;
      if (a?.actionType !== 'new_issue') continue;

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

    this.logger.debug('Polling for new GitLab issues...');

    const subscribed = await this.authRepo.findUsersWithService('gitlab');
    this.logger.debug(`Found ${subscribed.length} gitlab-connected users`);

    for (const record of subscribed) {
      const userId = record.userId;
      this.logger.debug(`Processing userId=${userId}`);

      try {
        const areas = await this.areasService.findByUser(userId);
        const projectIds = this.extractProjectIdsFromAreas(areas);

        if (projectIds.length === 0) {
          this.logger.debug(`userId=${userId} no gitlab/new_issue areas configured`);
          continue;
        }

        const rawMeta =
          record.metadata &&
          typeof record.metadata === 'object' &&
          !Array.isArray(record.metadata)
            ? (record.metadata as Record<string, any>)
            : {};

        const knownByProject: Record<string, Record<string, string>> =
          rawMeta.gitlabKnownIssuesByProject ?? {};

        for (const projectId of projectIds) {
          const projectKey = String(projectId);
          const known: Record<string, string> = knownByProject[projectKey] ?? {};
          const knownCount = Object.keys(known).length;

          let issues: any[] = [];
          try {
            issues = await this.gitlabService.listProjectIssues(userId, projectId, 50);
          } catch (e: any) {
            this.logger.warn(
              `userId=${userId} projectId=${projectId} listProjectIssues failed: ${e?.message ?? e}`,
            );
            continue;
          }

          this.logger.debug(`userId=${userId} projectId=${projectId} issues=${issues.length}`);
          if (!Array.isArray(issues) || issues.length === 0) continue;

          const sorted = [...issues].sort((a: any, b: any) => {
            const da = a?.created_at ? Date.parse(a.created_at) : 0;
            const db = b?.created_at ? Date.parse(b.created_at) : 0;
            return db - da;
          });

          if (Object.keys(known).length === 0) {
            for (const i of sorted) {
              const id = String(i?.id ?? '');
              if (!id) continue;
              known[id] = this.versionKey(i) || 'seen';
            }
            knownByProject[projectKey] = known;

            this.logger.log(
              `userId=${userId} projectId=${projectId} seeded known issues (${Object.keys(known).length})`,
            );
            continue;
          }

          const toEmit: any[] = [];
          for (const i of sorted) {
            const id = String(i?.id ?? '');
            if (!id) continue;
            if (!known[id]) toEmit.push(i);
          }

          if (toEmit.length === 0) {
            this.logger.debug(
              `userId=${userId} projectId=${projectId} no new issues (known=${knownCount})`,
            );
            continue;
          }

          const emitInOrder = [...toEmit].reverse();
          this.logger.log(
            `userId=${userId} projectId=${projectId} emitting ${emitInOrder.length} new issue event(s)`,
          );

          for (const i of emitInOrder) {
            const id = String(i?.id ?? '');
            const ver = this.versionKey(i);

            this.logger.log(`userId=${userId} projectId=${projectId} NEW ISSUE detected: ${id}`);

            try {
              await this.engine.emitHookEvent({
                userId,
                actionService: 'gitlab',
                actionType: 'new_issue',
                payload: i,
              });
            } catch (e: any) {
              this.logger.error(
                `userId=${userId} projectId=${projectId} emitHookEvent failed for issueId=${id}: ${e?.message ?? e}`,
                e?.stack,
              );
            }

            known[id] = ver || 'seen';
          }

          knownByProject[projectKey] = known;
        }

        await this.authRepo.updateMetadata(userId, 'gitlab', {
          gitlabKnownIssuesByProject: knownByProject,
        });

        this.logger.debug(
          `userId=${userId} gitlabKnownIssuesByProject updated (projects=${Object.keys(knownByProject).length})`,
        );
      } catch (err: any) {
        this.logger.error(`userId=${userId} unexpected error`, err?.stack || String(err));
      }
    }

    this.logger.debug('Polling cycle completed');
  }
}

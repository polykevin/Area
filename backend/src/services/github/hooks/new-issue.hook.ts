import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Octokit } from '@octokit/rest';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';

@Injectable()
export class GithubNewIssueHook {
  private engine: AutomationEngine;

  constructor(
    private authRepo: ServiceAuthRepository,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }

  @Cron('*/30 * * * * *')
  async check() {
    if (!this.engine) return;

    const subscribed = await this.authRepo.findUsersWithService('github');

    for (const record of subscribed) {
      const userId = record.userId;

      const octokit = new Octokit({
        auth: record.accessToken!,
      });

      const rawMeta =
        record.metadata &&
        typeof record.metadata === 'object' &&
        !Array.isArray(record.metadata)
          ? (record.metadata as Record<string, any>)
          : {};

      const lastIssueId = rawMeta.lastIssueId ?? null;
      const owner = rawMeta.owner;
      const repo = rawMeta.repo;

      if (!owner || !repo) continue;

      const { data: issues } = await octokit.issues.listForRepo({
        owner,
        repo,
        state: 'open',
        sort: 'created',
        direction: 'desc',
        per_page: 5,
      });

      if (issues.length === 0) continue;

      const newest = issues[0];
      if (!newest.id) continue;

      if (lastIssueId === newest.id) continue;

      await this.engine.emitHookEvent({
        userId,
        actionService: 'github',
        actionType: 'new_issue',
        payload: newest,
      });

      await this.authRepo.updateMetadata(userId, 'github', {
        ...rawMeta,
        lastIssueId: newest.id,
      });
    }
  }
}

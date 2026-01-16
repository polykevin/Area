import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GithubService } from '../github.service';
import { AutomationEngine } from '../../../automation/engine.service';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';

@Injectable()
export class NewIssueHook {
  private engine: AutomationEngine;

  constructor(
    private githubService: GithubService,
    private authRepo: ServiceAuthRepository,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }

  @Cron('* * * * *')
  async poll() {
    if (!this.engine) return;

    const users = await this.authRepo.findUsersWithService('github');

    for (const user of users) {
      const issues = await this.githubService.listIssues(
        user.userId,
        'OWNER',
        'REPO',
      );

      for (const issue of issues) {
        await this.engine.emitHookEvent({
          userId: user.userId,
          actionService: 'github',
          actionType: 'new_issue',
          payload: issue,
        });
      }
    }
  }
}

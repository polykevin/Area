import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { GoogleService } from '../google.service';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';

@Injectable()
export class NewEmailHook {
  private engine: AutomationEngine;

  constructor(
    private googleService: GoogleService,
    private authRepo: ServiceAuthRepository,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }

  @Cron('*/20 * * * * *')
  async poll() {
    if (!this.engine) return;

    const subscribers = await this.authRepo.findUsersWithService('google');

    for (const user of subscribers) {
      const emails = await this.googleService.listNewEmails(user);

      for (const email of emails) {
        await this.engine.emitHookEvent({
          userId: user.userId,
          actionService: 'google',
          actionType: 'new_email',
          payload: email,
        });
      }
    }
  }
}

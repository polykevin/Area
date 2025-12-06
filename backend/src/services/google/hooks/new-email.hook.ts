import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class NewEmailHook {
  constructor(private googleService, private authRepo, private engine) {
    this.googleService = googleService;
    this.authRepo = authRepo;
    this.engine = engine;
  }

  @Cron('*/20 * * * * *')
  async poll() {
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

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';

@Injectable()
export class TrelloCardCreatedHook {
  constructor(
    private authRepo: ServiceAuthRepository,
    private engine: AutomationEngine,
  ) {}

  @Cron('*/20 * * * * *')
  async poll() {
    const users = await this.authRepo.findUsersWithService('trello');

    for (const user of users) {
      const res = await axios.get(
        'https://api.trello.com/1/members/me/cards',
        {
          params: {
            key: user.accessToken,
            token: user.refreshToken,
          },
        }
      );

      const latest = res.data?.[0];
      if (!latest) continue;

      await this.engine.emitHookEvent({
        userId: user.userId,
        actionService: 'trello',
        actionType: 'trello_card_created',
        payload: latest,
      });
    }
  }
}

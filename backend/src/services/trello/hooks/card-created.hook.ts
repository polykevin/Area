import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';

@Injectable()
export class TrelloCardCreatedHook {
  constructor(
    private readonly authRepo: ServiceAuthRepository,
    private readonly engine: AutomationEngine,
  ) {
    console.log(' TrelloCardCreatedHook instantiated');
  }

  @Cron('*/20 * * * * *')
  async check() {
    const users = await this.authRepo.findUsersWithService('trello');

    for (const record of users) {
      const { accessToken, metadata } = record;

      const boardId = metadata?.boardId;
      if (!boardId) continue;

      const res = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/cards`,
        {
          params: {
            key: process.env.TRELLO_API_KEY,
            token: accessToken,
          },
        }
      );

      const cards = res.data;
      if (!cards.length) continue;

      cards.sort(
        (a, b) =>
          new Date(b.dateLastActivity).getTime() -
          new Date(a.dateLastActivity).getTime()
      );

      const latest = cards[0];

      if (record.lastEventId === latest.id) continue;

      console.log(' New Trello card detected:', latest.name);

      await this.engine.emitHookEvent({
        userId: record.userId,
        actionService: 'trello',
        actionType: 'card_created',
        payload: latest,
      });

      await this.authRepo.update(record.userId, 'trello', {
        lastEventId: latest.id,
      });
    }
  }
}

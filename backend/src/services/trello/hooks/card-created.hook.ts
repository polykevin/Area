import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';
import { TrelloService } from '../trello.service';

@Injectable()
export class TrelloCardCreatedHook {
  private engine: AutomationEngine;

  constructor(
    private authRepo: ServiceAuthRepository,
    private trello: TrelloService,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }

  @Cron('*/20 * * * * *')
  async check() {
    if (!this.engine) return;

    const subscribed = await this.authRepo.findUsersWithService('trello');

    for (const record of subscribed) {
      const userId = record.userId;

      const meta =
        record.metadata &&
        typeof record.metadata === 'object' &&
        !Array.isArray(record.metadata)
          ? (record.metadata as any)
          : {};

      const lastActionId = meta.lastCreateCardActionId ?? null;

      const latest = await this.trello.getLatestCreateCardAction(userId);
      if (!latest?.id || latest.id === lastActionId) continue;

      await this.engine.emitHookEvent({
        userId,
        actionService: 'trello',
        actionType: 'card_created',
        payload: latest,
      });

      await this.authRepo.updateMetadata(userId, 'trello', {
        lastCreateCardActionId: latest.id,
      });
    }
  }
}

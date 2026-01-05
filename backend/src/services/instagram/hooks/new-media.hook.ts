import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';
import { InstagramService } from '../instagram.service';

@Injectable()
export class NewMediaHook {
  private engine: AutomationEngine;

  constructor(
    private authRepo: ServiceAuthRepository,
    private instagram: InstagramService,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }

  @Cron('*/30 * * * * *')
  async poll() {
    if (!this.engine) return;

    const subscribed = await this.authRepo.findUsersWithService('instagram');

    for (const record of subscribed) {
      const userId = record.userId;

      const rawMeta =
        record.metadata &&
        typeof record.metadata === 'object' &&
        !Array.isArray(record.metadata)
          ? (record.metadata as Record<string, any>)
          : {};

      const lastMediaId = rawMeta.lastMediaId ?? null;

      const media = await this.instagram.listLatestMedia(userId, 5);
      if (media.length === 0) continue;

      const newest = media[0];
      if (!newest?.id) continue;

      if (lastMediaId === newest.id) continue;

      await this.engine.emitHookEvent({
        userId,
        actionService: 'instagram',
        actionType: 'new_media',
        payload: newest,
      });

      await this.authRepo.updateMetadata(userId, 'instagram', {
        lastMediaId: newest.id,
      });
    }
  }
}

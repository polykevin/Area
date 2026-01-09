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

  @Cron('0 */1 * * * *') //polling every 1 min
  async poll() {
    //console.log('[NewMediaHook] poll tick', new Date().toISOString());
    if (!this.engine) return;

    const subscribed = await this.authRepo.findUsersWithService('instagram');
    //console.log('[NewMediaHook] subscribed=', subscribed.length);

    for (const record of subscribed) {
      const userId = record.userId;

      const rawMeta =
        record.metadata && typeof record.metadata === 'object' && !Array.isArray(record.metadata)
          ? (record.metadata as Record<string, any>)
          : {};

      const lastMediaId = rawMeta.lastMediaId ?? null;
      //console.log('[NewMediaHook] user', userId, 'lastMediaId=', lastMediaId);

      const media = await this.instagram.listLatestMedia(userId, 5);
      //console.log('[NewMediaHook] user', userId, 'mediaCount=', media.length);

      if (media.length === 0) continue;

      const newest = media[0];
      //console.log('[NewMediaHook] user', userId, 'newest=', newest?.id);

      if (!newest?.id) continue;
      if (lastMediaId === newest.id) continue;

      //console.log('[NewMediaHook] EMIT', { userId, id: newest.id });

      await this.engine.emitHookEvent({
        userId,
        actionService: 'instagram',
        actionType: 'new_media',
        payload: newest,
      });

      await this.authRepo.updateMetadata(userId, 'instagram', { lastMediaId: newest.id });
    }
  }
}

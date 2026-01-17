import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';

@Injectable()
export class NewMentionHook {
  private engine: AutomationEngine;

  constructor(private authRepo: ServiceAuthRepository) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }

  @Cron('*/20 * * * * *')
  async poll() {
    if (!this.engine) return;

    const subscribed = await this.authRepo.findUsersWithService('twitter');

    for (const record of subscribed) {
      const userId = record.userId;

      const rawMeta =
        record.metadata &&
        typeof record.metadata === 'object' &&
        !Array.isArray(record.metadata)
          ? (record.metadata as Record<string, any>)
          : {};

      const lastMentionId = rawMeta.lastMentionId ?? null;

      let twitterUserId = rawMeta.twitterUserId;

      if (!twitterUserId) {
        const meRes = await fetch('https://api.x.com/2/users/me', {
          headers: { Authorization: `Bearer ${record.accessToken}` },
        });

        if (!meRes.ok) continue;

        const me: any = await meRes.json();
        twitterUserId = me?.data?.id;

        await this.authRepo.updateMetadata(userId, 'twitter', {
          twitterUserId,
          username: me?.data?.username,
        });
      }

      if (!twitterUserId) continue;

      const url = new URL(`https://api.x.com/2/users/${twitterUserId}/mentions`);
      url.searchParams.set('max_results', '5');
      url.searchParams.set('tweet.fields', 'created_at');
      if (lastMentionId) url.searchParams.set('since_id', lastMentionId);

      const listRes = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${record.accessToken}` },
      });

      if (!listRes.ok) continue;

      const list: any = await listRes.json();
      const mentions = list?.data ?? [];
      if (mentions.length === 0) continue;

      const sorted = [...mentions].sort((a, b) => (a.id > b.id ? -1 : 1));
      const newest = sorted[0];
      if (!newest?.id) continue;

      if (lastMentionId === newest.id) continue;

      await this.engine.emitHookEvent({
        userId,
        actionService: 'twitter',
        actionType: 'new_mention',
        payload: newest,
      });

      await this.authRepo.updateMetadata(userId, 'twitter', {
        lastMentionId: newest.id,
      });
    }
  }
}

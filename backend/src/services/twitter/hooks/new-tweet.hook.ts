import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';

@Injectable()
export class NewTweetHook {
  private readonly logger = new Logger(NewTweetHook.name);
  private engine: AutomationEngine;

  constructor(private authRepo: ServiceAuthRepository) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
    this.logger.log('AutomationEngine attached');
  }

  @Cron('0 */2 * * * *') // every 2 mins
  async poll() {
    if (!this.engine) {
      this.logger.warn('poll() called but engine is not set');
      return;
    }

    this.logger.debug('Polling for new tweets...');

    const subscribed = await this.authRepo.findUsersWithService('twitter');
    this.logger.debug(`Found ${subscribed.length} twitter-connected users`);

    for (const record of subscribed) {
      const userId = record.userId;
      this.logger.debug(`Processing userId=${userId}`);

      try {
        const rawMeta =
          record.metadata &&
          typeof record.metadata === 'object' &&
          !Array.isArray(record.metadata)
            ? (record.metadata as Record<string, any>)
            : {};

        const cooldownUntil = rawMeta.twitterCooldownUntil ?? 0;
        if (cooldownUntil && Date.now() < cooldownUntil) {
          this.logger.debug(
            `userId=${userId} cooldown active until ${new Date(cooldownUntil).toISOString()}`,
          );
          continue;
        }

        const lastTweetId = rawMeta.lastTweetId ?? null;
        this.logger.debug(
          `userId=${userId} lastTweetId=${lastTweetId ?? 'none'}`,
        );

        let twitterUserId = rawMeta.twitterUserId;

        if (!twitterUserId) {
          this.logger.debug(
            `userId=${userId} twitterUserId missing, calling /users/me`,
          );

          const meRes = await fetch('https://api.x.com/2/users/me', {
            headers: { Authorization: `Bearer ${record.accessToken}` },
          });

          if (!meRes.ok) {
            const txt = await meRes.text();
            this.logger.warn(
              `userId=${userId} /users/me failed (${meRes.status}): ${txt}`,
            );

            if (meRes.status === 429) {
              const retryAfter = meRes.headers.get('retry-after');
              const reset = meRes.headers.get('x-rate-limit-reset');

              let cooldownMs = 10 * 60 * 1000;
              if (retryAfter && Number.isFinite(Number(retryAfter))) {
                cooldownMs = Number(retryAfter) * 1000;
              } else if (reset && Number.isFinite(Number(reset))) {
                cooldownMs = Math.max(60_000, Number(reset) * 1000 - Date.now());
              }

              await this.authRepo.updateMetadata(userId, 'twitter', {
                twitterCooldownUntil: Date.now() + cooldownMs,
              });

              this.logger.warn(
                `userId=${userId} /users/me rate-limited. cooldown ${Math.round(cooldownMs / 1000)}s`,
              );
            }

            continue;
          }

          const me: any = await meRes.json();
          twitterUserId = me?.data?.id;

          if (!twitterUserId) {
            this.logger.warn(`userId=${userId} /users/me returned no id`);
            continue;
          }

          await this.authRepo.updateMetadata(userId, 'twitter', {
            twitterUserId,
            username: me?.data?.username,
          });

          this.logger.debug(
            `userId=${userId} resolved twitterUserId=${twitterUserId}`,
          );
        }

        const url = new URL(`https://api.x.com/2/users/${twitterUserId}/tweets`);
        url.searchParams.set('max_results', '5');
        url.searchParams.set('tweet.fields', 'created_at');
        if (lastTweetId) url.searchParams.set('since_id', lastTweetId);

        this.logger.debug(`userId=${userId} fetching tweets: ${url.toString()}`);

        const listRes = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${record.accessToken}` },
        });

        if (listRes.status === 429) {
          const retryAfter = listRes.headers.get('retry-after');
          const reset = listRes.headers.get('x-rate-limit-reset');

          let cooldownMs = 10 * 60 * 1000; // default 10 min
          if (retryAfter && Number.isFinite(Number(retryAfter))) {
            cooldownMs = Number(retryAfter) * 1000;
          } else if (reset && Number.isFinite(Number(reset))) {
            cooldownMs = Math.max(60_000, Number(reset) * 1000 - Date.now());
          }

          await this.authRepo.updateMetadata(userId, 'twitter', {
            twitterCooldownUntil: Date.now() + cooldownMs,
          });

          const txt = await listRes.text();
          this.logger.warn(
            `userId=${userId} tweets fetch rate-limited (429). retry-after=${retryAfter} reset=${reset} cooldown=${Math.round(
              cooldownMs / 1000,
            )}s body=${txt}`,
          );

          continue;
        }

        if (!listRes.ok) {
          const txt = await listRes.text();
          this.logger.warn(
            `userId=${userId} tweets fetch failed (${listRes.status}): ${txt}`,
          );
          continue;
        }

        const list: any = await listRes.json();
        const tweets = list?.data ?? [];

        this.logger.debug(`userId=${userId} fetched ${tweets.length} tweets`);

        if (tweets.length === 0) {
          this.logger.debug(`userId=${userId} no new tweets`);
          continue;
        }

        const sorted = [...tweets].sort((a, b) => (a.id > b.id ? -1 : 1));
        const newest = sorted[0];

        if (!newest?.id) {
          this.logger.warn(`userId=${userId} newest tweet has no id`);
          continue;
        }

        if (lastTweetId === newest.id) {
          this.logger.debug(
            `userId=${userId} newest tweet already processed (${newest.id})`,
          );
          continue;
        }

        this.logger.log(`userId=${userId} NEW TWEET detected: ${newest.id}`);

        try {
          await this.engine.emitHookEvent({
            userId,
            actionService: 'twitter',
            actionType: 'new_tweet',
            payload: newest,
          });
        } catch (e: any) {
          this.logger.error(
            `userId=${userId} emitHookEvent failed: ${e?.message ?? e}`,
            e?.stack,
          );
        }

        await this.authRepo.updateMetadata(userId, 'twitter', {
          lastTweetId: newest.id,
        });

        this.logger.debug(`userId=${userId} lastTweetId updated to ${newest.id}`);
      } catch (err: any) {
        this.logger.error(
          `userId=${userId} unexpected error`,
          err?.stack || String(err),
        );
      }
    }

    this.logger.debug('Polling cycle completed');
  }
}

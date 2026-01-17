import { Injectable, Logger } from '@nestjs/common';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { Tweet } from './twitter.interface';
import { TwitterOAuthProvider } from '../../auth/providers/twitter.oauth';

@Injectable()
export class TwitterService {
  private readonly logger = new Logger(TwitterService.name);

  constructor(
    private authRepo: ServiceAuthRepository,
    private twitterOAuth: TwitterOAuthProvider,
  ) {}

  private async getValidToken(userId: number) {
    const auth = await this.authRepo.findByUserAndService(userId, 'twitter');
    if (!auth) throw new Error('User not connected to Twitter');

    if (auth.expiresAt && auth.expiresAt.getTime() < Date.now()) {
      if (!auth.refreshToken) {
        throw new Error('Twitter refresh token missing');
      }

      const newTokens = await this.twitterOAuth.refreshAccessToken(auth.refreshToken);

      this.logger.log(`Refreshed Twitter token for user ${userId}`);

      await this.authRepo.updateTokens(userId, 'twitter', {
        accessToken: newTokens.access_token || undefined,
        refreshToken: (newTokens.refresh_token ?? auth.refreshToken) || undefined,
        expiresAt: newTokens.expiry_date ? new Date(newTokens.expiry_date) : null,
      });

      const updated = await this.authRepo.findByUserAndService(userId, 'twitter');
      if (!updated) throw new Error('Failed to reload Twitter auth after refresh');
      return updated;
    }

    return auth;
  }

  private async twitterFetch(accessToken: string, input: RequestInfo, init?: RequestInit) {
    const res = await fetch(input, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Twitter API error (${res.status}): ${txt}`);
    }

    return res.json();
  }

  async postTweet(userId: number, text: string) {
    const token = await this.getValidToken(userId);

    return this.twitterFetch(token.accessToken, 'https://api.x.com/2/tweets', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async listMyTweets(userId: number, sinceId?: string | null): Promise<Tweet[]> {
    const token = await this.getValidToken(userId);

    const meta: any = (token.metadata && typeof token.metadata === 'object') ? token.metadata : {};
    const twitterUserId = meta.twitterUserId;

    if (!twitterUserId) {
      const me: any = await this.twitterFetch(token.accessToken, 'https://api.x.com/2/users/me');
      const id = me?.data?.id;
      const username = me?.data?.username;

      await this.authRepo.updateMetadata(userId, 'twitter', {
        twitterUserId: id,
        username,
      });

      return this.listMyTweets(userId, sinceId);
    }

    const url = new URL(`https://api.x.com/2/users/${twitterUserId}/tweets`);
    url.searchParams.set('max_results', '5');
    url.searchParams.set('tweet.fields', 'created_at');
    if (sinceId) url.searchParams.set('since_id', sinceId);

    const data: any = await this.twitterFetch(token.accessToken, url.toString());
    return (data?.data ?? []).map((t: any) => ({
      id: t.id,
      text: t.text,
      created_at: t.created_at,
    }));
  }

  async listMyMentions(userId: number, sinceId?: string | null): Promise<Tweet[]> {
    const token = await this.getValidToken(userId);

    const meta: any = (token.metadata && typeof token.metadata === 'object') ? token.metadata : {};
    const twitterUserId = meta.twitterUserId;

    if (!twitterUserId) {
      const me: any = await this.twitterFetch(token.accessToken, 'https://api.x.com/2/users/me');
      const id = me?.data?.id;
      const username = me?.data?.username;

      await this.authRepo.updateMetadata(userId, 'twitter', {
        twitterUserId: id,
        username,
      });

      return this.listMyMentions(userId, sinceId);
    }

    const url = new URL(`https://api.x.com/2/users/${twitterUserId}/mentions`);
    url.searchParams.set('max_results', '5');
    url.searchParams.set('tweet.fields', 'created_at');
    if (sinceId) url.searchParams.set('since_id', sinceId);

    const data: any = await this.twitterFetch(token.accessToken, url.toString());
    return (data?.data ?? []).map((t: any) => ({
      id: t.id,
      text: t.text,
      created_at: t.created_at,
    }));
  }
}

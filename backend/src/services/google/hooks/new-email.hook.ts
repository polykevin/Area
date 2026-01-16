import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { google } from 'googleapis';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NewEmailHook {
  private engine: AutomationEngine;

  constructor(
    private authRepo: ServiceAuthRepository,
    private config: ConfigService,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }

  @Cron('*/20 * * * * *')
  async check() {
    if (!this.engine) return;

    const subscribed = await this.authRepo.findUsersWithService('google');

    for (const record of subscribed) {
      const userId = record.userId;

      const oauth = new google.auth.OAuth2(
        this.config.get<string>('GOOGLE_CLIENT_ID'),
        this.config.get<string>('GOOGLE_CLIENT_SECRET'),
        this.config.get<string>('GOOGLE_REDIRECT_URI'),
      );

      oauth.setCredentials({
        access_token: record.accessToken ?? undefined,
        refresh_token: record.refreshToken ?? undefined,
      });

      const gmail = google.gmail({ version: 'v1', auth: oauth });

      const rawMeta =
        record.metadata &&
        typeof record.metadata === 'object' &&
        !Array.isArray(record.metadata)
          ? (record.metadata as Record<string, any>)
          : {};

      const lastEmailId = rawMeta.lastEmailId ?? null;
      const userEmail = rawMeta.email ?? '';

      const list = await gmail.users.messages.list({
        userId: 'me',
        maxResults: 5,
        q: `in:inbox -from:${userEmail}`,
      });

      const messages = list.data.messages ?? [];
      if (messages.length === 0) continue;

      const newest = messages[0];
      if (!newest.id) continue;

      if (lastEmailId === newest.id) continue;

      const msg = await gmail.users.messages.get({
        userId: 'me',
        id: newest.id,
        format: 'metadata',
      });

      await this.engine.emitHookEvent({
        userId,
        actionService: 'google',
        actionType: 'new_email',
        payload: msg.data,
      });

      await this.authRepo.updateMetadata(userId, 'google', {
        lastEmailId: newest.id,
      });

      const newCreds = await oauth.getAccessToken();
      if (newCreds.token) {
        await this.authRepo.updateTokens(userId, 'google', {
          accessToken: newCreds.token,
        });
      }
    }
  }
}

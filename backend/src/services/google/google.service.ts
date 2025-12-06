import { Injectable, Logger } from '@nestjs/common';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { GmailMessage } from './google.interface';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);

  constructor(private authRepo: ServiceAuthRepository) {}

  async getOAuthClient(userId: number) {
    const auth = await this.authRepo.findByUserAndService(userId, 'google');
    if (!auth) throw new Error('User not connected to Google');

    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );

    client.setCredentials({
      access_token: auth.accessToken,
      refresh_token: auth.refreshToken,
      expiry_date: auth.expiresAt,
    });

    if (auth.expiresAt && Number(auth.expiresAt) < Date.now()) {
      const newTokens = await client.getAccessToken();
      this.logger.log(`Refreshed Google token for user ${userId}`);

      await this.authRepo.updateTokens(userId, 'google', {
        accessToken: newTokens.token,
        expiresAt: Date.now() + 3300 * 1000,
      });

      client.setCredentials({
        access_token: newTokens.token,
        refresh_token: auth.refreshToken,
        expiry_date: Date.now() + 3300 * 1000,
      });
    }

    return client;
  }

  async getGmailClient(userId: number) {
    const client = await this.getOAuthClient(userId);
    return google.gmail({ version: 'v1', auth: client });
  }

  async listNewEmails(userAuth: any) {
    const gmail = await this.getGmailClient(userAuth.userId);

    const res = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread',
    });

    if (!res.data.messages) return [];

    const messages: GmailMessage[] = [];

    for (const msg of res.data.messages) {
      const full = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
      });

      messages.push({
        id: msg.id,
        subject: this.getHeader(full.data.payload.headers, 'Subject'),
        from: this.getHeader(full.data.payload.headers, 'From'),
        snippet: full.data.snippet,
      });
    }

    return messages;
  }

  private getHeader(headers: any[], name: string) {
    const h = headers.find(h => h.name === name);
    return h ? h.value : null;
  }

  async sendEmail(userId: number, rawMessage: string) {
    const gmail = await this.getGmailClient(userId);

    return gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: rawMessage },
    });
  }
}

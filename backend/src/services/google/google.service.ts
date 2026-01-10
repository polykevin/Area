import { Injectable, Logger } from '@nestjs/common';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { GmailMessage } from './google.interface';
import { google } from 'googleapis';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);

  constructor(private authRepo: ServiceAuthRepository) {}

  private async getOAuthClient(userId: number) {
    const auth = await this.authRepo.findByUserAndService(userId, 'google');
    if (!auth) throw new Error('User not connected to Google');

    const client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.PUBLIC_BASE_URL}/oauth/google/service-callback`,
    );

    client.setCredentials({
      access_token: auth.accessToken,
      refresh_token: auth.refreshToken,
      expiry_date: auth.expiresAt ? new Date(auth.expiresAt).getTime() : null,
    });

    if (auth.expiresAt && auth.expiresAt.getTime() < Date.now()) {
      const newTokens = await client.refreshAccessToken();
      const tokens = newTokens.credentials;
      this.logger.log(`Refreshed Google token for user ${userId}`);

      await this.authRepo.updateTokens(userId, 'google', {
        accessToken: tokens.access_token || undefined,
        refreshToken: (tokens.refresh_token ?? auth.refreshToken) || undefined,
        expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
      });

      client.setCredentials(tokens);
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
      maxResults: 5,
    });

    if (!res.data.messages) return [];

    const messages: GmailMessage[] = [];

    for (const msg of res.data.messages) {
      const full = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id ?? '',
      });

      const headers = full.data.payload?.headers ?? [];

      messages.push({
        id: msg.id ?? '',
        subject: this.getHeader(headers, 'Subject') ?? '',
        from: this.getHeader(headers, 'From') ?? '',
        snippet: full.data.snippet ?? '',
      });
    }

    return messages;
  }

  private getHeader(headers: any[], name: string) {
    const found = headers.find((h) => h.name === name);
    return found ? found.value : null;
  }

  async sendEmail(userId: number, rawMessage: string) {
    const gmail = await this.getGmailClient(userId);

    return gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: rawMessage },
    });
  }
}

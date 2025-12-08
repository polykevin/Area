import { Injectable, UnauthorizedException } from '@nestjs/common';
import { google } from 'googleapis';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class GoogleService {
  constructor(private prisma: PrismaService) {}

  async getGoogleClient(userId: number) {
    const creds = await this.prisma.oAuthCredential.findFirst({
      where: { userId, provider: 'google' },
    });

    if (!creds) {
      throw new UnauthorizedException('Google account not linked');
    }

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL,
    );

    oauth2Client.setCredentials({
      access_token: creds.accessToken,
      refresh_token: creds.refreshToken ?? undefined,
    });

    return oauth2Client;
  }

  async listEmails(userId: number) {
    const auth = await this.getGoogleClient(userId);
    const gmail = google.gmail({ version: 'v1', auth });

    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 5,
    });

    return res.data.messages ?? [];
  }
  async getEmail(userId: number, messageId: string) {
    const auth = await this.getGoogleClient(userId);
    const gmail = google.gmail({ version: 'v1', auth });

    const res = await gmail.users.messages.get({
        userId: 'me',
        id: messageId,
        format: 'full',
    });

    return res.data;
    }
}

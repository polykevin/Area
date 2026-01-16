import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';

@Injectable()
export class CalendarEventHook {
  constructor(
    private readonly authRepo: ServiceAuthRepository,
    private readonly config: ConfigService,
    private engine: AutomationEngine,
  ) {
    console.log('CalendarEventHook instantiated');
  }
  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }
  @Cron('*/20 * * * * *')
  async check() {
    // console.log('Calendar CRON running');

    const subscribed = await this.authRepo.findUsersWithService('google');
    // console.log('Google users:', subscribed.length);

    for (const record of subscribed) {
      const oauth = new google.auth.OAuth2(
        this.config.get<string>('GOOGLE_CLIENT_ID'),
        this.config.get<string>('GOOGLE_CLIENT_SECRET'),
        this.config.get<string>('GOOGLE_REDIRECT_URI'),
      );

      oauth.setCredentials({
        access_token: record.accessToken ?? undefined,
        refresh_token: record.refreshToken ?? undefined,
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth });

      const res = await calendar.events.list({
        calendarId: 'primary',
        maxResults: 1,
        singleEvents: true,
        orderBy: 'updated',
      });

      const latest = res.data.items?.[0];
      if (!latest?.id) continue;
      if (record.lastEventId === latest.id) continue;

      console.log('New calendar event detected:', latest.summary);

      await this.engine.emitHookEvent({
        userId: record.userId,
        actionService: 'google',
        actionType: 'calendar_event_created',
        payload: latest,
      });

      await this.authRepo.update(record.userId, 'google', {
        lastEventId: latest.id,
      });
    }
  }
}

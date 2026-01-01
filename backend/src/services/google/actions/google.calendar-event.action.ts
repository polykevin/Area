import { GoogleService } from '../google.service';

export class GoogleCalendarEventAction {
  name = 'google.calendar.event.created';

  constructor(private readonly googleService: GoogleService) {}

  async check(userId: number): Promise<boolean> {
    const calendar = await this.googleService.getCalendarClient(userId);

    const res = await calendar.events.list({
      calendarId: 'primary',
      maxResults: 1,
      singleEvents: true,
      orderBy: 'updated',
    });

    const latestEvent = res.data.items?.[0];
    if (!latestEvent)
      return false;
    const lastEventId = await this.googleService.getLastCalendarEventId(userId);
    if (lastEventId === latestEvent.id) 
      return false;
    await this.googleService.setLastCalendarEventId(
      userId,
      latestEvent.id!
    );
    return true;
  }
}

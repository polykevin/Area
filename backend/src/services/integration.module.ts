import { Module } from '@nestjs/common';
import { GoogleModule } from './google/google.module';
import { AuthModule } from '../auth/auth.module';
import { AreasModule } from '../areas/area.module';
import { ServiceRegistry } from './service.registry';
import { AutomationEngine } from '../automation/engine.service';
import { GoogleService } from './google/google.service';
import { DiscordService } from '../services/discord/discord.service';
import { ServiceAuthRepository } from '../auth/service-auth.repository';
import { NewEmailHook } from './google/hooks/new-email.hook';
import { googleIntegration } from './google/google.integration';
import { discordIntegration } from '../services/discord/discord.integration';
import { CalendarEventHook } from './google/hooks/calendar-event.hook';

import { InstagramModule } from './instagram/instagram.module';
import { InstagramService } from './instagram/instagram.service';
import { NewMediaHook } from './instagram/hooks/new-media.hook';
import { instagramIntegration } from './instagram/instagram.integration';

import { WeatherModule } from './weather/weather.module';
import { WeatherService } from './weather/weather.service';
import { NewWeatherDataHook } from './weather/hooks/new-weather-data.hook';
import { weatherIntegration } from './weather/weather.integration';

import { TwitterModule } from './twitter/twitter.module';
import { TwitterService } from './twitter/twitter.service';
import { NewTweetHook } from './twitter/hooks/new-tweet.hook';
import { NewMentionHook } from './twitter/hooks/new-mention.hook';
import { twitterIntegration } from './twitter/twitter.integration';

import { ClockModule } from './clock/clock.module';
import { ClockService } from './clock/clock.service';
import { EveryDayAtHook } from './clock/hooks/every-day-at.hook';
import { EveryMinuteHook } from './clock/hooks/every-minute.hook';
import { clockIntegration } from './clock/clock.integration';

import { SlackModule } from './slack/slack.module';
import { SlackService } from './slack/slack.module';
import { SlackNewMessageHook } from './slack/hooks/slack-new-message.hook';
import { slackIntegration } from './slack/slack.integration';

import { every } from 'rxjs';

@Module({
  imports: [
    GoogleModule,
    InstagramModule,
    WeatherModule,
    TwitterModule,
    ClockModule,
    SlackModule,
    AuthModule,
    AreasModule,
  ],
  providers: [
    ServiceRegistry,
    AutomationEngine,
    GoogleService,
    DiscordService,
    ServiceAuthRepository,
    NewEmailHook,
    CalendarEventHook,
  ],
  exports: [
    ServiceRegistry,
    AutomationEngine,
  ],
})
export class IntegrationModule {
  constructor(
    private registry: ServiceRegistry,

    private googleService: GoogleService,
    private newEmailHook: NewEmailHook,

    private instagramService: InstagramService,
    private newMediaHook: NewMediaHook,

    private weatherService: WeatherService,
    private newWeatherDataHook: NewWeatherDataHook,

    private twitterService: TwitterService,
    private newTweetHook: NewTweetHook,
    private newMentionHook: NewMentionHook,

    private clockService: ClockService,
    private everyMinuteHook: EveryMinuteHook,
    private everyDayAtHook: EveryDayAtHook,

    private slackService: SlackService,
    private slackNewMessageHook: SlackNewMessageHook,

    private discordService: DiscordService,
    private authRepo: ServiceAuthRepository,
    private engine: AutomationEngine,
    private newEmailHook: NewEmailHook,
    private calendarEventHook: CalendarEventHook,

    private authRepo: ServiceAuthRepository,
    private engine: AutomationEngine,
    
  ) {
    newEmailHook.setEngine(engine);
    newMediaHook.setEngine(engine);
    newWeatherDataHook.setEngine(engine);
    newTweetHook.setEngine(engine);
    newMentionHook.setEngine(engine);
    everyMinuteHook.setEngine(engine);
    everyDayAtHook.setEngine(engine);
    slackNewMessageHook.setEngine(engine);
    newEmailHook.setEngine(engine);
    calendarEventHook.setEngine(engine);

    registry.register(
      googleIntegration(googleService, authRepo, engine, newEmailHook),
    );

    registry.register(
      instagramIntegration(instagramService, authRepo, engine, newMediaHook),
    );

    registry.register(
      weatherIntegration(weatherService, authRepo, engine, newWeatherDataHook),
    );

    registry.register(
      twitterIntegration(twitterService, authRepo, engine, newTweetHook, newMentionHook),
    );

    registry.register(
      clockIntegration(clockService, authRepo, engine, everyMinuteHook, everyDayAtHook),
    );
    
    registry.register(
      slackIntegration(slackService, authRepo, engine, slackNewMessageHook)
    );
    registry.register(
      discordIntegration(discordService)
    );
  }
}

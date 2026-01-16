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
import { NotionService } from './notion/notion.service';
import { notionIntegration } from './notion/notion.integration';
import { NotionModule } from './notion/notion.module';
import { NotionCreatePageAction } from './notion/action/create-page.action';
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

import { DropboxModule } from './dropbox/dropbox.module';
import { DropboxService } from './dropbox/dropbox.service';
import { NewFileHook } from './dropbox/hooks/new-file.hook';
import { FileChangedHook } from './dropbox/hooks/file-changed.hook';
import { dropboxIntegration } from './dropbox/dropbox.integration';

import { GitLabModule } from './gitlab/gitlab.module';
import { GitLabService } from './gitlab/gitlab.service';
import { NewIssueHook } from './gitlab/hooks/new-issue.hook';
import { NewMergeRequestHook } from './gitlab/hooks/new-merge-request.hook';
import { gitlabIntegration } from './gitlab/gitlab.integration';

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
    DropboxModule,
    GitLabModule,
    ClockModule,
    SlackModule,
    AuthModule,
    AreasModule,
    NotionModule,
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

    private dropboxService: DropboxService,
    private newFileHook: NewFileHook,
    private fileChangedHook: FileChangedHook,

    private gitlabService: GitLabService,
    private newIssueHook: NewIssueHook,
    private newMergeRequestHook: NewMergeRequestHook,

    private clockService: ClockService,
    private everyMinuteHook: EveryMinuteHook,
    private everyDayAtHook: EveryDayAtHook,

    private slackService: SlackService,
    private slackNewMessageHook: SlackNewMessageHook,

    private discordService: DiscordService,
    private calendarEventHook: CalendarEventHook,

    private authRepo: ServiceAuthRepository,
    private engine: AutomationEngine,
     
    private notionService: NotionService,
     
  ) {
    newEmailHook.setEngine(engine);
    newMediaHook.setEngine(engine);
    newWeatherDataHook.setEngine(engine);
    newTweetHook.setEngine(engine);
    newMentionHook.setEngine(engine);
    newFileHook.setEngine(engine);
    fileChangedHook.setEngine(engine);
    newIssueHook.setEngine(engine);
    newMergeRequestHook.setEngine(engine);
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
      dropboxIntegration(dropboxService, authRepo, engine, newFileHook, fileChangedHook),
    );

    registry.register(
      gitlabIntegration(gitlabService, authRepo, engine, newIssueHook, newMergeRequestHook),
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
     registry.register(
      notionIntegration(notionService)
    );
  }
}

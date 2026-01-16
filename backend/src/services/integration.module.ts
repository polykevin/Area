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

@Module({
  imports: [
    GoogleModule,
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
    private discordService: DiscordService,
    private authRepo: ServiceAuthRepository,
    private engine: AutomationEngine,
    private newEmailHook: NewEmailHook,
    private notionService: NotionService,
    private calendarEventHook: CalendarEventHook,
  ) {
    newEmailHook.setEngine(engine);
    calendarEventHook.setEngine(engine);
  
    registry.register(
      googleIntegration(googleService, authRepo, engine, newEmailHook)
    );
    registry.register(
      discordIntegration(discordService)
    );
     registry.register(
      notionIntegration(notionService)
    );
  }
}

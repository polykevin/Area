import { Module } from '@nestjs/common';
import { GoogleModule } from './google/google.module';
import { AuthModule } from '../auth/auth.module';
import { AreasModule } from '../areas/area.module';
import { ServiceRegistry } from './service.registry';
import { AutomationEngine } from '../automation/engine.service';
import { GoogleService } from './google/google.service';
import { ServiceAuthRepository } from '../auth/service-auth.repository';
import { NewEmailHook } from './google/hooks/new-email.hook';
import { googleIntegration } from './google/google.integration';
import { NotionService } from './notion/notion.service';
import { notionIntegration } from './notion/notion.integration';
import { NotionModule } from './notion/notion.module';
import { NotionCreatePageAction } from './notion/action/create-page.action';

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
    ServiceAuthRepository,
    NewEmailHook,
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
    private authRepo: ServiceAuthRepository,
    private engine: AutomationEngine,
    private newEmailHook: NewEmailHook,
    private notionService: NotionService,
  ) {
    newEmailHook.setEngine(engine);

    registry.register(
      googleIntegration(googleService, authRepo, engine, newEmailHook)
    );
    registry.register(
      notionIntegration(notionService)
    );
  }
}

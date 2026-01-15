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
import { TrelloService } from './trello/trello.service';
import { TrelloCardCreatedHook } from './trello/hooks/card-created.hook';
import { trelloIntegration } from './trello/trello.integration';

@Module({
  imports: [
    GoogleModule,
    AuthModule,
    AreasModule,
  ],
  providers: [
    ServiceRegistry,
    AutomationEngine,
    GoogleService,
    ServiceAuthRepository,
    NewEmailHook,
    TrelloCardCreatedHook,
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

  ) {
    newEmailHook.setEngine(engine);

    registry.register(
      googleIntegration(googleService, authRepo, engine, newEmailHook)
    );
   registry.register(trelloIntegration());
  }
}

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

import { InstagramModule } from './instagram/instagram.module';
import { InstagramService } from './instagram/instagram.service';
import { NewMediaHook } from './instagram/hooks/new-media.hook';
import { instagramIntegration } from './instagram/instagram.integration';

@Module({
  imports: [
    GoogleModule,
    InstagramModule,
    AuthModule,
    AreasModule,
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
    private newEmailHook: NewEmailHook,

    private instagramService: InstagramService,
    private newMediaHook: NewMediaHook,

    private authRepo: ServiceAuthRepository,
    private engine: AutomationEngine,
  ) {
    newEmailHook.setEngine(engine);
    newMediaHook.setEngine(engine);

    registry.register(
      googleIntegration(googleService, authRepo, engine, newEmailHook),
    );

    registry.register(
      instagramIntegration(instagramService, authRepo, engine, newMediaHook),
    );
  }
}

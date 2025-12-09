import { Module } from '@nestjs/common';
import { GoogleModule } from './google/google.module';
import { AuthModule } from 'src/auth/auth.module';
import { AreasModule } from 'src/areas/area.module';
import { ServiceRegistry } from './service.registry';
import { AutomationEngine } from 'src/automation/engine.service';
import { GoogleService } from './google/google.service';
import { ServiceAuthRepository } from 'src/auth/service-auth.repository';
import { NewEmailHook } from './google/hooks/new-email.hook';
import { googleIntegration } from './google/google.integration';

@Module({
  imports: [GoogleModule, AuthModule, AreasModule],
  providers: [ServiceRegistry, AutomationEngine],
  exports: [ServiceRegistry, AutomationEngine],
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
      googleIntegration(googleService, authRepo, engine, newEmailHook),
    );
  }
}

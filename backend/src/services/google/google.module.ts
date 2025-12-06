import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { googleIntegration } from './google.integration';
import { ServiceRegistry } from '../service.registry';
import { PrismaService } from '../../prisma.service';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { NewEmailHook } from './hooks/new-email.hook';
import { AutomationEngine } from '../../automation/engine.service';

@Module({
  providers: [
    GoogleService,
    ServiceRegistry,
    ServiceAuthRepository,
    AutomationEngine,
    NewEmailHook,
  ],
})
export class GoogleModule {
  constructor(
    private registry: ServiceRegistry,
    private googleService: GoogleService,
    private authRepo: ServiceAuthRepository,
    private engine: AutomationEngine,
    private newEmailHook: NewEmailHook,
  ) {
    registry.register(
      googleIntegration(googleService, authRepo, engine, newEmailHook)
    );
  }
}

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
    NewEmailHook,
    PrismaService,
    ServiceAuthRepository,
    AutomationEngine,
  ],
})
export class GoogleModule {
  constructor(
    registry: ServiceRegistry,
    googleService: GoogleService,
    authRepo: ServiceAuthRepository,
    engine: AutomationEngine,
  ) {
    registry.register(
      googleIntegration(googleService, authRepo, engine)
    );
  }
}

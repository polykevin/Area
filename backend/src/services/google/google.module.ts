import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AreasModule } from 'src/areas/area.module';
import { GoogleService } from './google.service';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { NewEmailHook } from './hooks/new-email.hook';
import { ServiceRegistry } from '../service.registry';

@Module({
  imports: [
    PrismaModule,
    AreasModule
  ],
  providers: [
    GoogleService,
    ServiceAuthRepository,
    NewEmailHook,
    ServiceRegistry,
  ],
  exports: [
    GoogleService,
    ServiceAuthRepository,
    NewEmailHook,
    ServiceRegistry,
  ],
})
export class GoogleModule {}

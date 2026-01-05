import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AreasModule } from '../../areas/area.module';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { ServiceRegistry } from '../service.registry';

import { InstagramService } from './instagram.service';
import { NewMediaHook } from './hooks/new-media.hook';

@Module({
  imports: [PrismaModule, AreasModule],
  providers: [
    InstagramService,
    ServiceAuthRepository,
    NewMediaHook,
    ServiceRegistry,
  ],
  exports: [
    InstagramService,
    ServiceAuthRepository,
    NewMediaHook,
    ServiceRegistry,
  ],
})
export class InstagramModule {}

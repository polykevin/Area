import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AreasModule } from '../../areas/area.module';
import { ServiceRegistry } from '../service.registry';

import { ClockService } from './clock.service';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { EveryDayAtHook } from './hooks/every-day-at.hook';
import { EveryMinuteHook } from './hooks/every-minute.hook';

@Module({
  imports: [PrismaModule, AreasModule],
  providers: [
    ClockService,
    EveryDayAtHook,
    EveryMinuteHook,
    ServiceAuthRepository,
    ServiceRegistry,
  ],
  exports: [
    ClockService,
    EveryDayAtHook,
    EveryMinuteHook,
    ServiceAuthRepository,
    ServiceRegistry,
  ],
})
export class ClockModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AreasModule } from '../../areas/area.module';
import { ServiceRegistry } from '../service.registry';

import { WeatherService } from './weather.service';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { NewWeatherDataHook } from './hooks/new-weather-data.hook';

@Module({
  imports: [PrismaModule, AreasModule],
  providers: [
    WeatherService,
    NewWeatherDataHook,
    ServiceAuthRepository,
    ServiceRegistry,
  ],
  exports: [
    WeatherService,
    NewWeatherDataHook,
    ServiceAuthRepository,
    ServiceRegistry,
  ],
})
export class WeatherModule {}

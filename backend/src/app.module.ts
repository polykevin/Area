import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { AreasModule } from './areas/area.module';
import { IntegrationModule } from './services/integration.module';
import { AutomationEngine } from './automation/engine.service';
import { GoogleModule } from './services/google/google.module';

@Module({
  imports: [
    AuthModule,
    AreasModule,
    IntegrationModule,
    ScheduleModule.forRoot(),
  ],
  providers: [
    AutomationEngine,
  ],
  exports: [
    AutomationEngine,
  ]
})
export class AppModule {}

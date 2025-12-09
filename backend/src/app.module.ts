import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { AreasModule } from './areas/area.module';
import { IntegrationModule } from './services/integration.module';
import { AutomationEngine } from './automation/engine.service';
import { PrismaModule } from './prisma/prisma.module';
import { GoogleModule } from './services/google/google.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,

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
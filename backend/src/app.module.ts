import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AutomationEngine } from './automation/engine.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { GoogleStrategy } from './auth/google.strategy';
import { JwtStrategy } from './auth/jwt.strategy';
import { GoogleModule } from './services/google/google.module';
import { AreasModule } from './areas/area.module';
import { IntegrationModule } from './services/integration.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AboutController } from './about.controller';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicesModule } from "./services/services.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    AreasModule,
    GoogleModule,
    ServicesModule,
    IntegrationModule
  ],
  controllers: [AppController, AboutController],
  providers: [AppService, GoogleStrategy,
    JwtStrategy,],
})
export class AppModule {}
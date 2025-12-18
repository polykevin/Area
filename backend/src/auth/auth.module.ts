import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from "ms";
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleStrategy } from "./google.strategy";
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ServiceAuthRepository } from './service-auth.repository';
import { OauthFactoryService } from './oauth.factory';
import { OauthController } from './oauth.controller';

const expiresIn: StringValue = (process.env.JWT_EXPIRES_IN as StringValue) ?? "1d";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "",
      signOptions: { expiresIn },
    }),
  ],
  controllers: [AuthController, OauthController],
  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
    ServiceAuthRepository,
    OauthFactoryService,
    GoogleStrategy
  ],
  exports: [JwtModule, JwtStrategy, ServiceAuthRepository, AuthService, ServiceAuthRepository],
})
export class AuthModule {}

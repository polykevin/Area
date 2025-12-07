import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { ServiceAuthRepository } from './service-auth.repository';
import { GoogleStrategy } from './google.strategy';
import { OauthFactoryService } from './oauth.factory';
import { OauthController } from './oauth.controller';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret-key-area',
      signOptions: { expiresIn: '1h' },
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

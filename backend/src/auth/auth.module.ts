import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma.service';
import { ServiceAuthRepository } from './service-auth.repository';
import { OauthController } from './oauth.controller';
import { OauthFactoryService } from './oauth.factory';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: 'dev-secret-key-area',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PrismaService,
    ServiceAuthRepository,
    OauthFactoryService,
  ],
  exports: [JwtModule, JwtStrategy],
})
export class AuthModule {}

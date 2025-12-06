import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ServiceAuthRepository } from './service-auth.repository';
import { OauthController } from './oauth.controller';
import { OauthFactoryService } from './oauth.factory';

@Module({
  providers: [
    PrismaService,
    ServiceAuthRepository,
    OauthFactoryService,
  ],
  controllers: [OauthController],
  exports: [ServiceAuthRepository],
})
export class AuthModule {}

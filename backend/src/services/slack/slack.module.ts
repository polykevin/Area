import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AreasModule } from '../../areas/area.module';
import { SlackService } from './slack.service';
import { SlackNewMessageHook } from './hooks/slack-new-message.hook';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { ServiceRegistry } from '../service.registry';

@Module({
  imports: [
    PrismaModule,
    AreasModule
  ],
  providers: [
    SlackService,
    ServiceAuthRepository,
    SlackNewMessageHook,
    ServiceRegistry
  ],
  exports: [
    SlackService,
    ServiceAuthRepository,
    SlackNewMessageHook,
    ServiceRegistry
  ],
})
export class SlackModule {}

export { SlackService };


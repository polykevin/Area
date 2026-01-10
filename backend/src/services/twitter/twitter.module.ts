import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AreasModule } from '../../areas/area.module';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { ServiceRegistry } from '../service.registry';
import { TwitterService } from './twitter.service';
import { TwitterOAuthProvider } from '../../auth/providers/twitter.oauth';
import { NewTweetHook } from './hooks/new-tweet.hook';
import { NewMentionHook } from './hooks/new-mention.hook';

@Module({
  imports: [
    PrismaModule,
    AreasModule
  ],
  providers: [
    TwitterService,
    TwitterOAuthProvider,
    ServiceAuthRepository,
    NewTweetHook,
    NewMentionHook,
    ServiceRegistry,
  ],
  exports: [
    TwitterService,
    TwitterOAuthProvider,
    ServiceAuthRepository,
    NewTweetHook,
    NewMentionHook,
    ServiceRegistry,
  ],
})
export class TwitterModule {}

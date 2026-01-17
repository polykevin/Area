import { Module } from '@nestjs/common';
import { TrelloService } from './trello.service';
import { TrelloCardCreatedHook } from './hooks/card-created.hook';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';

@Module({
  providers: [TrelloService, TrelloCardCreatedHook, ServiceAuthRepository],
  exports: [TrelloService, TrelloCardCreatedHook],
})
export class TrelloModule {}

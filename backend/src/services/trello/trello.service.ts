
import { Injectable, Logger } from '@nestjs/common';
import { trelloCardCreatedAction } from './action/card-created.action';

@Injectable()
export class TrelloService {
  action = [trelloCardCreatedAction];
}


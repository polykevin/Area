import { Injectable } from '@nestjs/common';
import { sendMessageReaction } from './reactions/discord-messages.action';

@Injectable()
export class DiscordService {
  reactions = [sendMessageReaction];
}

import { Injectable } from '@nestjs/common';
import { sendMessageReaction } from './reaction/discord-send-message.reaction'

@Injectable()
export class DiscordService {
  reactions = [sendMessageReaction];
}
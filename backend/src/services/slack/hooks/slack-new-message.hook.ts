import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';
import { SlackService } from '../slack.service';
import { SlackMessage } from '../slack.interface';
@Injectable()
export class SlackNewMessageHook {
  private engine: AutomationEngine;

  constructor(
    private authRepo: ServiceAuthRepository,
    private slack: SlackService,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }

  // Run every 10 seconds for easier testing
  @Cron('*/45 * * * * *')
  async poll() {
    if (!this.engine)
      return;

    const subscribed = await this.authRepo.findUsersWithService('slack');

    for (const record of subscribed) {
      const userId = record.userId;
      const token = record.accessToken;

      if (!token)
        continue;

      const rawMeta =
        record.metadata && typeof record.metadata === 'object' && !Array.isArray(record.metadata)
          ? (record.metadata as Record<string, any>)
          : {};

      const conversations = await this.slack.listAllConversations(token);

      if (!conversations || conversations.length === 0)
        continue;

      for (const conv of conversations) {
        const channelId = conv.id;
        if (!channelId)
          continue;

        const lastMessageTs = rawMeta[channelId]?.lastMessageTs ?? null;

        // 2. Fetch latest messages
        const messages = await this.slack.getChannelHistory(token, channelId, 5);

        if (!messages || messages.length === 0)
          continue;

        const newest = messages[0];

        if (!newest?.id)
          continue;

        if (lastMessageTs === newest.id)
          continue;

        const msg: SlackMessage = {
          id: newest.id,
          text: newest.text ?? '',
          user: newest.user ?? null,
          channel: channelId,
          threadTs: newest.threadTs ?? null,
        };

        
        console.log('\n[SlackHook] Hook triggered \n');
        await this.engine.emitHookEvent({
          userId,
          actionService: 'slack',
          actionType: 'new_message',
          payload: msg,
        });

        await this.authRepo.updateMetadata(userId, 'slack', {
          ...rawMeta,
          [channelId]: {
            lastMessageTs: newest.id,
          },
        });
      }
    }
  }
}

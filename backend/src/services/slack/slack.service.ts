import { Injectable, Logger } from '@nestjs/common';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { SlackMessage } from './slack.interface';

@Injectable()
export class SlackService {
  private readonly logger = new Logger(SlackService.name);
  private apiUrl = 'https://slack.com/api';

  constructor(private authRepo: ServiceAuthRepository) {}

  private async slackFetch(token: string, endpoint: string, body?: any) {
    const res = await fetch(`${this.apiUrl}/${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data: any = await res.json();
    if (!data.ok) {
      throw new Error(`Slack API error (${endpoint}): ${data.error}`);
    }

    return data;
  }

  async sendMessage(token: string, channel: string, text: string): Promise<SlackMessage> {
    const data: any = await this.slackFetch(token, 'chat.postMessage', {
      channel,
      text,
    });

    return {
      id: data.ts,
      text,
      user: data.message?.user ?? null,
      channel: data.channel,
      threadTs: null,
    };
  }

  async replyToThread(
    token: string,
    channel: string,
    threadTs: string,
    text: string
  ): Promise<SlackMessage> {
    const data: any = await this.slackFetch(token, 'chat.postMessage', {
      channel,
      text,
      thread_ts: threadTs,
    });

    return {
      id: data.ts,
      text,
      user: data.message?.user ?? null,
      channel: data.channel,
      threadTs,
    };
  }

  async getChannelHistory(token: string, channel: string, limit = 20): Promise<SlackMessage[]> {
    const url = `${this.apiUrl}/conversations.history?channel=${channel}&limit=${limit}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data: any = await res.json();
    if (!data.ok) {
      throw new Error(`Slack API error (conversations.history): ${data.error}`);
    }

    return (data.messages ?? []).map((m: any) => ({
      id: m.ts,
      text: m.text ?? '',
      user: m.user ?? null,
      channel,
      threadTs: m.thread_ts ?? null,
    }));
  }

  async listAllConversations(token: string) {
    const res = await fetch('https://slack.com/api/conversations.list?types=public_channel,private_channel,im,mpim&limit=200', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();
    return data.channels ?? [];
  }


  async getUserInfo(token: string, userId: string): Promise<any> {
    return this.slackFetch(token, 'users.info', { user: userId });
  }
}

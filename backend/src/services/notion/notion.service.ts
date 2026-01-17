import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';

@Injectable()
export class NotionService {
  constructor(
    private readonly authRepo: ServiceAuthRepository,
  ) {}

  private async getClient(userId: number) {
    const auth = await this.authRepo.findByUserAndService(userId, 'notion');

    if (!auth?.accessToken) {
      throw new Error('User is not connected to Notion');
    }

    return new Client({
      auth: auth.accessToken,
    });
  }

  async createPage(
    userId: number,
    databaseId: string,
    title: string,
    content: string,
  ) {
    const notion = await this.getClient(userId);

    return notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [{ text: { content: title } }],
        },
      },
      children: [
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content } }],
          },
        },
      ],
    });
  }
}

import { Injectable } from '@nestjs/common';
import { Client } from '@notionhq/client';

@Injectable()
export class NotionService {
  private notion: Client;

  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_KEY,
    });
  }

  async createPage(databaseId: string, title: string, content?: string) {
    return this.notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: { content: title },
            },
          ],
        },
      },
      children: content
        ? [
            {
              object: 'block',
              paragraph: {
                rich_text: [{ text: { content } }],
              },
            },
          ]
        : [],
    });
  }
}

import { Injectable } from '@nestjs/common';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';

@Injectable()
export class TrelloService {
  constructor(private authRepo: ServiceAuthRepository) { }

  private async getAuth(userId: number) {
    const auth = await this.authRepo.findByUserAndService(userId, 'trello');
    if (!auth?.accessToken) {
      throw new Error('Trello not connected');
    }
    return auth;
  }

  private api(path: string, key: string, token: string) {
    const url = new URL(`https://api.trello.com/1/${path}`);
    url.searchParams.set('key', key);
    url.searchParams.set('token', token);
    return url;
  }

  async getLatestCreateCardAction(userId: number) {
    const auth = await this.getAuth(userId);
    const key = process.env.TRELLO_API_KEY!;
    const url = this.api('members/me/actions', key, auth.accessToken);
    url.searchParams.set('filter', 'createCard');
    url.searchParams.set('limit', '1');

    const res = await fetch(url.toString());
    if (!res.ok) {
      throw new Error(`Trello actions failed: ${res.status}`);
    }

    const actions = await res.json();
    return Array.isArray(actions) ? actions[0] : null;
  }

  async createCard(
    userId: number,
    listId: string,
    name: string,
    desc?: string,
  ) {
    const auth = await this.getAuth(userId);
    const key = process.env.TRELLO_API_KEY!;
    const url = this.api('cards', key, auth.accessToken);

    const body = new URLSearchParams({ idList: listId, name });
    if (desc) body.set('desc', desc);

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    if (!res.ok) {
      throw new Error(`Trello createCard failed: ${res.status}`);
    }

    return res.json();
  }

  async findListIdByName(userId: number, boardName: string, listName: string) {
    const auth = await this.getAuth(userId);
    const key = process.env.TRELLO_API_KEY!;

    const boardsRes = await fetch(
      `https://api.trello.com/1/members/me/boards?key=${key}&token=${auth.accessToken}`
    );
    const boards = await boardsRes.json();

    const board = boards.find(
      (b: any) => b.name.toLowerCase() === boardName.toLowerCase()
    );
    if (!board) {
      throw new Error(`Board "${boardName}" not found`);
    }

    const listsRes = await fetch(
      `https://api.trello.com/1/boards/${board.id}/lists?key=${key}&token=${auth.accessToken}`
    );
    const lists = await listsRes.json();

    const list = lists.find(
      (l: any) => l.name.toLowerCase() === listName.toLowerCase()
    );
    if (!list) {
      throw new Error(`List "${listName}" not found in board "${boardName}"`);
    }

    return list.id;
  }

}

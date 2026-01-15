import { Injectable } from '@nestjs/common';
import { GoogleOAuthProvider } from './providers/google.oauth';
import { TrelloOAuthProvider } from './providers/trello.oauth';

export interface OAuthProvider {
  getAuthUrl(state?: string): string;
  exchangeCode(code: string): Promise<any>;
  getUserProfile(tokens: any): Promise<any>;
}

@Injectable()
export class OauthFactoryService {
  create(provider: string): OAuthProvider {
    switch (provider) {
      case 'google':
        return new GoogleOAuthProvider();

      case 'trello':
        return new TrelloOAuthProvider();

      default:
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { GoogleOAuthProvider } from './providers/google.oauth';

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
      default:
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }
  }
}

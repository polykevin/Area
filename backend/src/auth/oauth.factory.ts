import { Injectable } from '@nestjs/common';
import { GoogleOAuthProvider } from './providers/google.oauth';
import { InstagramOAuthProvider } from './providers/instagram.oauth';
import { TwitterOAuthProvider } from './providers/twitter.oauth';

export interface OAuthProvider {
  getAuthUrl(state: string, codeChallenge?: string): string;
  exchangeCode(code: string, codeVerifier?: string): Promise<any>;
  getUserProfile(tokens: any): Promise<any>;
}

@Injectable()
export class OauthFactoryService {
  create(provider: string): OAuthProvider {
    switch (provider) {
      case 'google':
        return new GoogleOAuthProvider();
      case 'instagram':
        return new InstagramOAuthProvider();
      case 'twitter':
        return new TwitterOAuthProvider();
      default:
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }
  }
}

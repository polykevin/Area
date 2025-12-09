import { Injectable } from '@nestjs/common';
import { GoogleOAuthProvider } from './providers/google.oauth';

export interface OAuthTokens {
  access_token?: string;
  refresh_token?: string | null;
  expiry_date?: number | null;
  id_token?: string;
}

export interface OAuthProfile {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

export interface OAuthProvider {
  getAuthUrl(state?: string): string;
  exchangeCode(code: string): Promise<OAuthTokens>;
  getUserProfile(tokens: OAuthTokens): Promise<OAuthProfile>;
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

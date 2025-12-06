import { Injectable } from '@nestjs/common';
import { GoogleOAuthProvider } from './providers/google.oauth';

@Injectable()
export class OauthFactoryService {
  create(provider: string) {
    switch (provider) {
      case 'google':
        return new GoogleOAuthProvider();
      default:
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }
  }
}

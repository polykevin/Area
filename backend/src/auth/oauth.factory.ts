import { Injectable } from '@nestjs/common';
import { GoogleOAuthProvider } from './providers/google.oauth';
<<<<<<< HEAD
import { TrelloOAuthProvider } from './providers/trello.oauth';
=======
import { InstagramOAuthProvider } from './providers/instagram.oauth';
import { WeatherOAuthProvider } from './providers/weather.oauth';
import { TwitterOAuthProvider } from './providers/twitter.oauth';
import { ClockOAuthProvider } from './providers/clock.oauth';
import { SlackOAuthProvider } from './providers/slack.oauth';
>>>>>>> 1a7f805

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
<<<<<<< HEAD

      case 'trello':
        return new TrelloOAuthProvider();

=======
      case 'instagram':
        return new InstagramOAuthProvider();
      case 'weather':
        return new WeatherOAuthProvider();
      case 'twitter':
        return new TwitterOAuthProvider();
      case 'clock':
        return new ClockOAuthProvider();
      case 'slack':
        return new SlackOAuthProvider();
>>>>>>> 1a7f805
      default:
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }
  }
}

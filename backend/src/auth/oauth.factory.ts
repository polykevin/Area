import { Injectable } from '@nestjs/common';
import { GoogleOAuthProvider } from './providers/google.oauth';
import { InstagramOAuthProvider } from './providers/instagram.oauth';
import { WeatherOAuthProvider } from './providers/weather.oauth';
import { TwitterOAuthProvider } from './providers/twitter.oauth';
import { DropboxOAuthProvider } from './providers/dropbox.oauth';
import { GitLabOAuthProvider } from './providers/gitlab.oauth';
import { ClockOAuthProvider } from './providers/clock.oauth';
import { SlackOAuthProvider } from './providers/slack.oauth';
import { GithubOAuthProvider } from './providers/github.oauth';
import { TrelloOAuthProvider } from './providers/trello.oauth';
import { NotionOAuthProvider } from './providers/notion.oauth';

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
      case 'weather':
        return new WeatherOAuthProvider();
      case 'twitter':
        return new TwitterOAuthProvider();
      case 'dropbox':
        return new DropboxOAuthProvider();
      case 'gitlab':
        return new GitLabOAuthProvider();
      case 'clock':
        return new ClockOAuthProvider();
      case 'slack':
        return new SlackOAuthProvider();
      case 'github':
        return new GithubOAuthProvider();
      case 'trello':
        return new TrelloOAuthProvider();
      case 'notion':
        return new NotionOAuthProvider();
      default:
        throw new Error(`Unknown OAuth provider: ${provider}`);
    }
  }
}

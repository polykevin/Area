import { OAuthProvider } from "../oauth.factory";

export class TrelloOAuthProvider implements OAuthProvider {
  getAuthUrl(state?: string): string {
    const key = process.env.TRELLO_API_KEY;

    return (
      'https://trello.com/1/authorize' +
      '?expiration=never' +
      '&name=AREA' +
      '&scope=read,write' +
      '&response_type=token' +
      `&key=${key}` +
      `&state=${state}` +
      '&return_url=http://localhost:8081/oauth/trello/callback'
    );
  }

  async exchangeCode(): Promise<any> {
    return null;
  }

  async getUserProfile(): Promise<any> {
    return null;
  }
}
import { google } from 'googleapis';
import { OAuthProfile, OAuthTokens } from '../oauth.factory';

export class GoogleOAuthProvider {
  private oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL,
  );

  getAuthUrl(state?: string) {
    return this.oauth2.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.readonly',
      ],
      state,
    });
  }

  async exchangeCode(code: string): Promise<OAuthTokens> {
    const { tokens } = await this.oauth2.getToken(code);
    return {
      access_token: tokens.access_token ?? undefined,
      refresh_token: tokens.refresh_token ?? null,
      expiry_date: tokens.expiry_date ?? null,
      id_token: tokens.id_token ?? undefined,
    };
  }

  async getUserProfile(tokens: OAuthTokens): Promise<OAuthProfile> {
    if (tokens.id_token) {
      const ticket = await this.oauth2.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      return {
        id: payload?.sub ?? '',
        email: payload?.email ?? '',
        name: payload?.name ?? '',
      };
    }

    this.oauth2.setCredentials(tokens);
    const oauth2 = google.oauth2('v2').userinfo;
    const { data } = await oauth2.get({ auth: this.oauth2 });
    return {
      id: data.id ?? undefined,
      email: data.email ?? undefined,
      name: data.name ?? undefined,
    };
  }
}

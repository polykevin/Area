import { google } from 'googleapis';

export class GoogleOAuthProvider {
  private oauth2 = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  getAuthUrl() {
    return this.oauth2.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [
        'openid',
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.readonly',
      ],
    });
  }

  async exchangeCode(code: string) {
    const { tokens } = await this.oauth2.getToken(code);
    return {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    };
  }

  async getUserProfile(tokens) {
    this.client.setCredentials(tokens);
    const oauth2 = google.oauth2('v2').userinfo;
    const { data } = await oauth2.get({ auth: this.client });
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      picture: data.picture,
    }
  }
}

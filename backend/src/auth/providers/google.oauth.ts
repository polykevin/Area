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
    return tokens;
  }

  async getUserProfile(tokens: any) {
    this.oauth2.setCredentials(tokens);

    const ticket = await this.oauth2.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
      id: payload.sub,
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
    };
  }
}

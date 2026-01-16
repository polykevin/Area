export class SlackOAuthProvider {
  private clientId = process.env.SLACK_CLIENT_ID!;
  private clientSecret = process.env.SLACK_CLIENT_SECRET!;
  private redirectUri = `${process.env.PUBLIC_BASE_URL}/oauth/slack/service-callback`;

  getAuthUrl(state?: string) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      scope: [
        'channels:history',
        'channels:read',
        'chat:write',
        'chat:write.public',
        'groups:history',
        'groups:read',
        'im:history',
        'im:read',
        'mpim:history',
        'mpim:read',
        'users:read'
      ].join(' '),
      redirect_uri: this.redirectUri
    });

    if (state) params.set('state', state);
    return `https://slack.com/oauth/v2/authorize?${params.toString()}`;
  }

  async exchangeCode(code: string) {
    const body = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      code,
      redirect_uri: this.redirectUri,
    });

    const res = await fetch('https://slack.com/api/oauth.v2.access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });

    const data: any = await res.json();

    if (!data.ok) {
      throw new Error(`Slack OAuth failed: ${data.error}`);
    }

    return {
      access_token: data.access_token,   // xoxb-...
      refresh_token: null,
      expiry_date: null,
      bot_user_id: data.bot_user_id,
      team_id: data.team?.id ?? null,
    };
  }

  async getUserProfile(tokens: any) {
    return { 
      id: tokens.bot_user_id ?? '',
      name: 'Slack Bot',
      email: '',
      image: null,
    };
  }
}

export class InstagramOAuthProvider {
  getAuthUrl(state?: string) {
    const params = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID!,
      redirect_uri: process.env.INSTAGRAM_CALLBACK_URL!,
      response_type: 'code',
      scope: process.env.INSTAGRAM_SCOPES ?? 'instagram_basic',
    });

    if (state) params.set('state', state);
    return `https://www.facebook.com/v19.0/dialog/oauth?${params.toString()}`;
  }

  async exchangeCode(code: string) {
    const params = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID!,
      client_secret: process.env.INSTAGRAM_APP_SECRET!,
      redirect_uri: process.env.INSTAGRAM_CALLBACK_URL!,
      code,
    });

    const url = `https://graph.facebook.com/v19.0/oauth/access_token?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Instagram token exchange failed (${res.status})`);
    const data = await res.json();

    return {
      access_token: data.access_token as string,
      expires_in: data.expires_in as number,
      token_type: data.token_type as string,
    };
  }

  async exchangeForLongLivedToken(shortLivedToken: string) {
    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: process.env.INSTAGRAM_APP_ID!,
      client_secret: process.env.INSTAGRAM_APP_SECRET!,
      fb_exchange_token: shortLivedToken,
    });

    const url = `https://graph.facebook.com/v19.0/oauth/access_token?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Instagram long-lived exchange failed (${res.status})`);
    const data = await res.json();

    return {
      access_token: data.access_token as string,
      expires_in: data.expires_in as number,
      token_type: data.token_type as string,
    };
  }

  async getUserProfile(accessToken: string) {
    const params = new URLSearchParams({
      fields: 'id,username',
      access_token: accessToken,
    });

    const url = `https://graph.facebook.com/v19.0/me?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Instagram profile fetch failed (${res.status})`);
    const data = await res.json();

    return {
      id: data.id as string,
      username: (data.username ?? '') as string,
    };
  }
}

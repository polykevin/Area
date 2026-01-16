export class InstagramOAuthProvider {
  getAuthUrl(state?: string) {
    const redirectUri = `${process.env.PUBLIC_BASE_URL}/oauth/instagram/callback`;

    const params = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID!,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: process.env.INSTAGRAM_SCOPES ?? 'user_profile,user_media',
    });

    if (state) params.set('state', state);

    console.log('INSTAGRAM_APP_ID=', process.env.INSTAGRAM_APP_ID);
    const authUrl = `https://api.instagram.com/oauth/authorize?${params.toString()}`;
    console.log('AUTH URL=', authUrl);
    return authUrl;
  }

  async exchangeCode(code: string) {
    const redirectUri = `${process.env.PUBLIC_BASE_URL}/oauth/instagram/callback`;

    const body = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID!,
      client_secret: process.env.INSTAGRAM_APP_SECRET!,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code,
    });

    const res = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    const txt = await res.text();
    if (!res.ok) throw new Error(`Instagram token exchange failed (${res.status}): ${txt}`);

    const data = JSON.parse(txt);
    return {
      access_token: data.access_token as string,
      user_id: String(data.user_id),
    };
  }

  async exchangeForLongLivedToken(shortLivedToken: string) {
    const params = new URLSearchParams({
      grant_type: 'ig_exchange_token',
      client_secret: process.env.INSTAGRAM_APP_SECRET!,
      access_token: shortLivedToken,
    });

    const url = `https://graph.instagram.com/access_token?${params.toString()}`;
    const res = await fetch(url);

    const txt = await res.text();
    if (!res.ok) throw new Error(`Instagram long-lived exchange failed (${res.status}): ${txt}`);

    const data = JSON.parse(txt);

    return {
      access_token: data.access_token as string,
      expires_in: data.expires_in as number,
      token_type: 'bearer',
    };
  }

  async getUserProfile(accessToken: string) {
    const params = new URLSearchParams({
      fields: 'id,username',
      access_token: accessToken,
    });

    const url = `https://graph.instagram.com/me?${params.toString()}`;
    const res = await fetch(url);

    const txt = await res.text();
    if (!res.ok) throw new Error(`Instagram profile fetch failed (${res.status}): ${txt}`);

    const data = JSON.parse(txt);

    return {
      id: String(data.id),
      username: String(data.username ?? ''),
    };
  }
}

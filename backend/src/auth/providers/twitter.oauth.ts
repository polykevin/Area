import crypto from 'crypto';

export class TwitterOAuthProvider {
  private get redirectUri() {
    return `${process.env.PUBLIC_BASE_URL}/oauth/twitter/callback`;
  }

  private base64Url(buf: Buffer) {
    return buf
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/g, '');
  }

  createPkce() {
    const verifier = this.base64Url(crypto.randomBytes(32));
    const challenge = this.base64Url(crypto.createHash('sha256').update(verifier).digest());
    return { verifier, challenge };
  }

  getAuthUrl(state?: string, codeChallenge?: string) {
    const url = new URL('https://twitter.com/i/oauth2/authorize');

    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', process.env.TWITTER_CLIENT_ID ?? '');
    url.searchParams.set('redirect_uri', this.redirectUri);

    url.searchParams.set('scope', [
      'tweet.read',
      'tweet.write',
      'users.read',
      'offline.access',
    ].join(' '));

    if (state) url.searchParams.set('state', state);

    if (codeChallenge) {
      url.searchParams.set('code_challenge', codeChallenge);
      url.searchParams.set('code_challenge_method', 'S256');
    }

    return url.toString();
  }

  async exchangeCode(code: string, codeVerifier: string) {
    const tokenUrl = 'https://api.x.com/2/oauth2/token';

    const basic = Buffer.from(
      `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`,
    ).toString('base64');

    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', this.redirectUri);
    body.set('code_verifier', codeVerifier);

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basic}`,
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Twitter token exchange failed (${res.status}): ${txt}`);
    }

    const data: any = await res.json();

    return {
      access_token: data.access_token ?? undefined,
      refresh_token: data.refresh_token ?? null,
      expiry_date: data.expires_in ? Date.now() + data.expires_in * 1000 : null,
      scope: data.scope ?? undefined,
      token_type: data.token_type ?? undefined,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const tokenUrl = 'https://api.x.com/2/oauth2/token';

    const basic = Buffer.from(
      `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`,
    ).toString('base64');

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basic}`,
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Twitter token refresh failed (${res.status}): ${txt}`);
    }

    const data: any = await res.json();

    return {
      access_token: data.access_token ?? undefined,
      refresh_token: data.refresh_token ?? null,
      expiry_date: data.expires_in ? Date.now() + data.expires_in * 1000 : null,
      scope: data.scope ?? undefined,
      token_type: data.token_type ?? undefined,
    };
  }

  async getUserProfile(tokens: { access_token?: string }) {
    const res = await fetch('https://api.x.com/2/users/me', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Twitter profile fetch failed (${res.status}): ${txt}`);
    }

    const data: any = await res.json();
    return {
      id: data?.data?.id ?? '',
      email: '',
      name: data?.data?.name ?? '',
      username: data?.data?.username ?? '',
    };
  }
}

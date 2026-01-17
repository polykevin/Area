import crypto from 'crypto';

export class DropboxOAuthProvider {
  private get redirectUri() {
    return `${process.env.PUBLIC_BASE_URL}/oauth/dropbox/callback`;
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
    const url = new URL('https://www.dropbox.com/oauth2/authorize');

    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', process.env.DROPBOX_CLIENT_ID ?? '');
    url.searchParams.set('redirect_uri', this.redirectUri);

    url.searchParams.set('token_access_type', 'offline');

    if (state) url.searchParams.set('state', state);

    if (codeChallenge) {
      url.searchParams.set('code_challenge', codeChallenge);
      url.searchParams.set('code_challenge_method', 'S256');
    }

    return url.toString();
  }

  async exchangeCode(code: string, codeVerifier: string) {
    const tokenUrl = 'https://api.dropboxapi.com/oauth2/token';

    const basic = Buffer.from(
      `${process.env.DROPBOX_CLIENT_ID}:${process.env.DROPBOX_CLIENT_SECRET}`,
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
      throw new Error(`Dropbox token exchange failed (${res.status}): ${txt}`);
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
    const tokenUrl = 'https://api.dropboxapi.com/oauth2/token';

    const basic = Buffer.from(
      `${process.env.DROPBOX_CLIENT_ID}:${process.env.DROPBOX_CLIENT_SECRET}`,
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
      throw new Error(`Dropbox token refresh failed (${res.status}): ${txt}`);
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
    const res = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        'Content-Type': 'application/json',
      },
      body: 'null',
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Dropbox profile fetch failed (${res.status}): ${txt}`);
    }

    const data: any = await res.json();
    return {
      id: data?.account_id ?? '',
      email: data?.email ?? '',
      name: data?.name?.display_name ?? '',
      username: '',
    };
  }
}

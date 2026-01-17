import crypto from 'crypto';

const GITLAB_BASE = 'https://gitlab.com';

export class GitLabOAuthProvider {
  private get redirectUri() {
    return `${process.env.PUBLIC_BASE_URL}/oauth/gitlab/callback`;
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
    const challenge = this.base64Url(
      crypto.createHash('sha256').update(verifier).digest(),
    );
    return { verifier, challenge };
  }

  getAuthUrl(state?: string, codeChallenge?: string) {
    const url = new URL(`${GITLAB_BASE}/oauth/authorize`);

    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', process.env.GITLAB_CLIENT_ID ?? '');
    url.searchParams.set('redirect_uri', this.redirectUri);
    url.searchParams.set('scope', 'api read_user');

    if (state) url.searchParams.set('state', state);

    if (codeChallenge) {
      url.searchParams.set('code_challenge', codeChallenge);
      url.searchParams.set('code_challenge_method', 'S256');
    }

    return url.toString();
  }

  async exchangeCode(code: string, codeVerifier: string) {
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('client_id', process.env.GITLAB_CLIENT_ID ?? '');
    body.set('client_secret', process.env.GITLAB_CLIENT_SECRET ?? '');
    body.set('code', code);
    body.set('redirect_uri', this.redirectUri);
    body.set('code_verifier', codeVerifier);

    const res = await fetch(`${GITLAB_BASE}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      throw new Error(`GitLab token exchange failed: ${await res.text()}`);
    }

    const data: any = await res.json();

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? null,
      expiry_date: data.expires_in ? Date.now() + data.expires_in * 1000 : null,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', process.env.GITLAB_CLIENT_ID ?? '');
    body.set('client_secret', process.env.GITLAB_CLIENT_SECRET ?? '');
    body.set('refresh_token', refreshToken);

    const res = await fetch(`${GITLAB_BASE}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });

    if (!res.ok) {
      throw new Error(`GitLab token refresh failed: ${await res.text()}`);
    }

    const data: any = await res.json();

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token ?? null,
      expiry_date: data.expires_in ? Date.now() + data.expires_in * 1000 : null,
    };
  }

  async getUserProfile(tokens: { access_token?: string }) {
    const res = await fetch(`${GITLAB_BASE}/api/v4/user`, {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`GitLab profile fetch failed: ${await res.text()}`);
    }

    const data: any = await res.json();
    return {
      id: String(data.id),
      email: data.public_email ?? '',
      name: data.name ?? '',
      username: data.username ?? '',
    };
  }
}

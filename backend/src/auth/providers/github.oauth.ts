export class GithubOAuthProvider {
  private clientId = process.env.GITHUB_CLIENT_ID!;
  private clientSecret = process.env.GITHUB_CLIENT_SECRET!;
  private redirectUri = `${process.env.BACKEND_URL}/oauth/github/service-callback`;

  getAuthUrl(state?: string) {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: [
        'read:user',
        'repo',
        'admin:repo_hook',
      ].join(' '),
    });

    if (state) params.set('state', state);

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  async exchangeCode(code: string) {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code,
        redirect_uri: this.redirectUri,
      }),
    });

    const data: any = await res.json();

    if (data.error) {
      throw new Error(`GitHub OAuth failed: ${data.error_description}`);
    }

    return {
      access_token: data.access_token,
      refresh_token: null,
      expiry_date: null,
    };
  }

  async getUserProfile(tokens: any) {
    const res = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
        Accept: 'application/vnd.github+json',
      },
    });

    const profile: any = await res.json();

    return {
      id: String(profile.id),
      name: profile.name ?? profile.login,
      email: profile.email ?? '',
      image: profile.avatar_url ?? null,
    };
  }
}

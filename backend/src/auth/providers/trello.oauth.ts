export class TrelloOAuthProvider {
  private apiKey = process.env.TRELLO_API_KEY!;
  private frontendCallback = `${process.env.FRONTEND_URL}/auth/trello/callback`;

  getAuthUrl(state?: string) {
    const returnUrl = state
      ? `${this.frontendCallback}?state=${encodeURIComponent(state)}`
      : this.frontendCallback;

    const params = new URLSearchParams({
      key: this.apiKey,
      name: 'AREA',
      response_type: 'token',
      expiration: 'never',
      scope: 'read,write',
      callback_method: 'fragment',
      return_url: returnUrl,
    });

    return `https://trello.com/1/authorize?${params.toString()}`;
  }

  async exchangeCode(code: string) {
    return {
      access_token: code,
      refresh_token: null,
      expiry_date: null,
    };
  }

  async getUserProfile(tokens: any) {
    const token = tokens.access_token;
    const url = new URL('https://api.trello.com/1/members/me');
    url.searchParams.set('key', this.apiKey);
    url.searchParams.set('token', token);

    const res = await fetch(url.toString());
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Trello getUserProfile failed: ${res.status} ${txt}`);
    }

    const data: any = await res.json();
    return {
      id: data.id ?? '',
      username: data.username ?? '',
      fullName: data.fullName ?? '',
    };
  }
}

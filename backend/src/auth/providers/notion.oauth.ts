import fetch from 'node-fetch';

const REDIRECT_URI = process.env.NOTION_REDIRECT_URI!;

export class NotionOAuthProvider {
  getAuthUrl(state?: string) {
  const params = new URLSearchParams({
    client_id: process.env.NOTION_CLIENT_ID!,
    response_type: 'code',
    owner: 'user',
    redirect_uri: process.env.NOTION_REDIRECT_URI!,
  });

  if (state) {
    params.append(
      'state',
      Buffer.from(JSON.stringify({ userId: Number(state) })).toString('base64')
    );
  }

  return `https://api.notion.com/v1/oauth/authorize?${params.toString()}`;
}

  async exchangeCode(code: string) {
    const res = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(
            `${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`,
          ).toString('base64'),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Notion OAuth token exchange failed: ${txt}`);
    }

    return res.json();
  }

  async getUserProfile(tokens: any) {
    return {
      id: tokens.bot_id ?? 'notion',
      name: tokens.workspace_name ?? 'Notion Workspace',
      workspaceId: tokens.workspace_id,
      accessToken: tokens.access_token,
    };
  }
}
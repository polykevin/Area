import { Injectable, Logger } from '@nestjs/common';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { GitLabOAuthProvider } from '../../auth/providers/gitlab.oauth';
import { GitLabIssue, GitLabMergeRequest } from './gitlab.interface';

@Injectable()
export class GitLabService {
  private readonly logger = new Logger(GitLabService.name);

  constructor(
    private authRepo: ServiceAuthRepository,
    private gitlabOAuth: GitLabOAuthProvider,
  ) {}

  private get baseUrl() {
    return process.env.GITLAB_BASE_URL || 'https://gitlab.com';
  }

  private async getValidToken(userId: number) {
    const auth = await this.authRepo.findByUserAndService(userId, 'gitlab');
    if (!auth) throw new Error('User not connected to GitLab');

    if (auth.expiresAt && auth.expiresAt.getTime() < Date.now()) {
      if (!auth.refreshToken) {
        throw new Error('GitLab refresh token missing');
      }

      const newTokens = await this.gitlabOAuth.refreshAccessToken(auth.refreshToken);

      this.logger.log(`Refreshed GitLab token for user ${userId}`);

      await this.authRepo.updateTokens(userId, 'gitlab', {
        accessToken: newTokens.access_token || undefined,
        refreshToken: (newTokens.refresh_token ?? auth.refreshToken) || undefined,
        expiresAt: newTokens.expiry_date ? new Date(newTokens.expiry_date) : null,
      });

      const updated = await this.authRepo.findByUserAndService(userId, 'gitlab');
      if (!updated) throw new Error('Failed to reload GitLab auth after refresh');
      return updated;
    }

    return auth;
  }

  private async gitlabFetch(
    accessToken: string,
    input: RequestInfo,
    init?: RequestInit,
  ) {
    const res = await fetch(input, {
      ...init,
      headers: {
        ...(init?.headers ?? {}),
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const bodyText = await res.text();
    let body: any = null;
    try {
      body = JSON.parse(bodyText);
    } catch {}

    if (!res.ok) {
      const method = init?.method ?? 'GET';

      const inputStr = typeof input === 'string' ? input : (input as any)?.url ? String((input as any).url) : '[RequestInfo]';

      const err: any = new Error(
        `GitLab API error (${res.status}) on ${method} ${inputStr}: ${bodyText}`,
      );
      err.status = res.status;
      err.body = body;
      err.url = inputStr;
      err.method = method;
      throw err;
    }

    return body ?? {};
  }

  async getCurrentUser(userId: number) {
    const token = await this.getValidToken(userId);
    return this.gitlabFetch(token.accessToken, `${this.baseUrl}/api/v4/user`, {
      method: 'GET',
    });
  }

  async listMyIssues(userId: number, perPage = 50): Promise<GitLabIssue[]> {
    const token = await this.getValidToken(userId);

    const url = new URL(`${this.baseUrl}/api/v4/issues`);
    url.searchParams.set('scope', 'all');
    url.searchParams.set('order_by', 'created_at');
    url.searchParams.set('sort', 'desc');
    url.searchParams.set('per_page', String(perPage));

    const data: any = await this.gitlabFetch(token.accessToken, url.toString(), {
      method: 'GET',
    });

    return Array.isArray(data) ? (data as GitLabIssue[]) : [];
  }

  async listProjectIssues(
    userId: number,
    projectId: number,
    perPage = 50,
  ): Promise<GitLabIssue[]> {
    const token = await this.getValidToken(userId);

    const url = new URL(
      `${this.baseUrl}/api/v4/projects/${encodeURIComponent(String(projectId))}/issues`,
    );
    url.searchParams.set('order_by', 'created_at');
    url.searchParams.set('sort', 'desc');
    url.searchParams.set('per_page', String(perPage));

    const data: any = await this.gitlabFetch(token.accessToken, url.toString(), {
      method: 'GET',
    });

    return Array.isArray(data) ? (data as GitLabIssue[]) : [];
  }

  async listMyMergeRequests(userId: number, perPage = 50): Promise<GitLabMergeRequest[]> {
    const token = await this.getValidToken(userId);

    const url = new URL(`${this.baseUrl}/api/v4/merge_requests`);
    url.searchParams.set('scope', 'all');
    url.searchParams.set('order_by', 'created_at');
    url.searchParams.set('sort', 'desc');
    url.searchParams.set('per_page', String(perPage));

    const data: any = await this.gitlabFetch(token.accessToken, url.toString(), {
      method: 'GET',
    });

    return Array.isArray(data) ? (data as GitLabMergeRequest[]) : [];
  }

  async createIssue(
    userId: number,
    projectId: number,
    title: string,
    description?: string,
  ) {
    const token = await this.getValidToken(userId);

    const body: any = { title };
    if (description !== undefined) body.description = description;

    return this.gitlabFetch(
      token.accessToken,
      `${this.baseUrl}/api/v4/projects/${encodeURIComponent(String(projectId))}/issues`,
      { method: 'POST', body: JSON.stringify(body) },
    );
  }

  async commentOnMergeRequest(
    userId: number,
    projectId: number,
    mergeRequestIid: number,
    bodyText: string,
  ) {
    const token = await this.getValidToken(userId);

    return this.gitlabFetch(
      token.accessToken,
      `${this.baseUrl}/api/v4/projects/${encodeURIComponent(String(projectId))}/merge_requests/${encodeURIComponent(String(mergeRequestIid))}/notes`,
      { method: 'POST', body: JSON.stringify({ body: bodyText }) },
    );
  }

  async listProjectMergeRequests(
    userId: number,
    projectId: number,
    perPage = 50,
  ) {
    const token = await this.getValidToken(userId);

    const url = new URL(
      `${this.baseUrl}/api/v4/projects/${encodeURIComponent(String(projectId))}/merge_requests`,
    );
    url.searchParams.set('order_by', 'created_at');
    url.searchParams.set('sort', 'desc');
    url.searchParams.set('per_page', String(perPage));

    const data: any = await this.gitlabFetch(token.accessToken, url.toString(), {
      method: 'GET',
    });

    return Array.isArray(data) ? data : [];
  }
}

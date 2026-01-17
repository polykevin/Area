import { Injectable, Logger } from '@nestjs/common';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { DropboxFile } from './dropbox.interface';
import { DropboxOAuthProvider } from '../../auth/providers/dropbox.oauth';

@Injectable()
export class DropboxService {
  private readonly logger = new Logger(DropboxService.name);

  constructor(
    private authRepo: ServiceAuthRepository,
    private dropboxOAuth: DropboxOAuthProvider,
  ) {}

  private async getValidToken(userId: number) {
    const auth = await this.authRepo.findByUserAndService(userId, 'dropbox');
    if (!auth) throw new Error('User not connected to Dropbox');

    if (auth.expiresAt && auth.expiresAt.getTime() < Date.now()) {
      if (!auth.refreshToken) {
        throw new Error('Dropbox refresh token missing');
      }

      const newTokens = await this.dropboxOAuth.refreshAccessToken(
        auth.refreshToken,
      );

      this.logger.log(`Refreshed Dropbox token for user ${userId}`);

      await this.authRepo.updateTokens(userId, 'dropbox', {
        accessToken: newTokens.access_token || undefined,
        refreshToken:
          (newTokens.refresh_token ?? auth.refreshToken) || undefined,
        expiresAt: newTokens.expiry_date ? new Date(newTokens.expiry_date) : null,
      });

      const updated = await this.authRepo.findByUserAndService(userId, 'dropbox');
      if (!updated) throw new Error('Failed to reload Dropbox auth after refresh');
      return updated;
    }

    return auth;
  }

  private async dropboxFetch(
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
      const err: any = new Error(`Dropbox API error (${res.status}): ${bodyText}`);
      err.status = res.status;
      err.body = body;
      throw err;
    }

    return body ?? {};
  }

  async ensureCursor(userId: number, folderPath?: string) {
    const token = await this.getValidToken(userId);

    const meta: any =
      token.metadata &&
      typeof token.metadata === 'object' &&
      !Array.isArray(token.metadata)
        ? token.metadata
        : {};

    if (meta.cursor) return meta.cursor;

    const path = folderPath ?? meta.watchPath ?? '';

    const body = {
      path,
      recursive: false,
      include_deleted: true,
      include_non_downloadable_files: true,
    };

    const data: any = await this.dropboxFetch(
      token.accessToken,
      'https://api.dropboxapi.com/2/files/list_folder',
      { method: 'POST', body: JSON.stringify(body) },
    );

    const cursor = data?.cursor;
    if (!cursor) throw new Error('Dropbox list_folder returned no cursor');

    await this.authRepo.updateMetadata(userId, 'dropbox', {
      cursor,
      watchPath: path || '',
    });

    return cursor;
  }

  async listChanges(
    userId: number,
  ): Promise<{ cursor: string; entries: DropboxFile[] }> {
    const token = await this.getValidToken(userId);

    const meta: any =
      token.metadata &&
      typeof token.metadata === 'object' &&
      !Array.isArray(token.metadata)
        ? token.metadata
        : {};

    const watchPath = meta.watchPath ?? '';

    if (!meta.cursor) {
      const body = {
        path: watchPath,
        recursive: false,
        include_deleted: true,
        include_non_downloadable_files: true,
      };

      const first: any = await this.dropboxFetch(
        token.accessToken,
        'https://api.dropboxapi.com/2/files/list_folder',
        { method: 'POST', body: JSON.stringify(body) },
      );

      let cursor = first?.cursor;
      if (!cursor) throw new Error('Dropbox list_folder returned no cursor');

      let entries = (first?.entries ?? []) as DropboxFile[];

      while (first?.has_more) {
        const next: any = await this.dropboxFetch(
          token.accessToken,
          'https://api.dropboxapi.com/2/files/list_folder/continue',
          { method: 'POST', body: JSON.stringify({ cursor }) },
        );

        entries = entries.concat((next?.entries ?? []) as DropboxFile[]);
        cursor = next?.cursor ?? cursor;

        if (!next?.has_more) break;
      }

      await this.authRepo.updateMetadata(userId, 'dropbox', {
        cursor,
        watchPath,
      });

      return { cursor, entries };
    }

    let cursor = meta.cursor as string;
    let entries: DropboxFile[] = [];

    while (true) {
      const data: any = await this.dropboxFetch(
        token.accessToken,
        'https://api.dropboxapi.com/2/files/list_folder/continue',
        { method: 'POST', body: JSON.stringify({ cursor }) },
      );

      entries = entries.concat((data?.entries ?? []) as DropboxFile[]);
      cursor = data?.cursor ?? cursor;

      if (!data?.has_more) break;
    }

    if (cursor !== meta.cursor) {
      await this.authRepo.updateMetadata(userId, 'dropbox', { cursor });
    }

    return { cursor, entries };
  }

  async uploadTextFile(userId: number, path: string, content: string) {
    const token = await this.getValidToken(userId);

    const res = await fetch('https://content.dropboxapi.com/2/files/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        'Content-Type': 'application/octet-stream',
        'Dropbox-API-Arg': JSON.stringify({
          path,
          mode: 'add',
          autorename: true,
          mute: false,
          strict_conflict: false,
        }),
      },
      body: Buffer.from(content, 'utf8'),
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Dropbox upload failed (${res.status}): ${txt}`);
    }

    return res.json();
  }

  async createSharedLink(userId: number, path: string) {
    const token = await this.getValidToken(userId);

    try {
      return await this.dropboxFetch(
        token.accessToken,
        'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings',
        { method: 'POST', body: JSON.stringify({ path }) },
      );
    } catch (e: any) {
      if (
        e?.status === 409 &&
        e?.body?.error?.['.tag'] === 'shared_link_already_exists'
      ) {
        const url =
          e?.body?.error?.shared_link_already_exists?.metadata?.url ??
          null;

        if (url) {
          return { url, alreadyExisted: true };
        }
      }

      throw e;
    }
  }
}

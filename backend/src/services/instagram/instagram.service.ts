import { Injectable, Logger } from '@nestjs/common';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { InstagramMedia } from './instagram.interface';

@Injectable()
export class InstagramService {
  private readonly logger = new Logger(InstagramService.name);

  constructor(private authRepo: ServiceAuthRepository) {}

  private async getAccessToken(userId: number): Promise<{ token: string; igUserId: string }> {
    const auth = await this.authRepo.findByUserAndService(userId, 'instagram');
    if (!auth) throw new Error('User not connected to Instagram');

    const meta =
      auth.metadata &&
      typeof auth.metadata === 'object' &&
      !Array.isArray(auth.metadata)
        ? (auth.metadata as Record<string, any>)
        : {};

    const igUserId = auth.providerUserId ?? meta.igUserId;
    if (!igUserId) throw new Error('Missing Instagram user id (providerUserId)');

    if (!auth.accessToken) throw new Error('Missing Instagram access token');

    return { token: auth.accessToken, igUserId };
  }

  async listLatestMedia(userId: number, limit = 5): Promise<InstagramMedia[]> {
    const { token, igUserId } = await this.getAccessToken(userId);

    const params = new URLSearchParams({
      fields: 'id,caption,media_type,media_url,permalink,timestamp',
      limit: String(limit),
      access_token: token,
    });

    const url = `https://graph.facebook.com/v19.0/${igUserId}/media?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Instagram media list failed (${res.status})`);
    const data = await res.json();

    return (data.data ?? []) as InstagramMedia[];
  }

  async createMediaContainer(userId: number, input: { imageUrl: string; caption?: string }) {
    const { token, igUserId } = await this.getAccessToken(userId);

    const body = new URLSearchParams({
      image_url: input.imageUrl,
      caption: input.caption ?? '',
      access_token: token,
    });

    const url = `https://graph.facebook.com/v19.0/${igUserId}/media`;
    const res = await fetch(url, { method: 'POST', body });
    if (!res.ok) throw new Error(`Instagram create container failed (${res.status})`);
    return await res.json();
  }

  async publishMedia(userId: number, containerId: string) {
    const { token, igUserId } = await this.getAccessToken(userId);

    const body = new URLSearchParams({
      creation_id: containerId,
      access_token: token,
    });

    const url = `https://graph.facebook.com/v19.0/${igUserId}/media_publish`;
    const res = await fetch(url, { method: 'POST', body });
    if (!res.ok) throw new Error(`Instagram publish failed (${res.status})`);
    return await res.json();
  }
}

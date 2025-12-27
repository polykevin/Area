import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ServiceAuthRepository {
  constructor(private prisma: PrismaService) {}

  async saveOrUpdate(data: {
    userId: number;
    service: string;
    provider_user_id: string;
    access_token: string;
    refresh_token?: string;
    expires_at?: Date | null;
    metadata?: any;
  }) {
    return this.prisma.serviceAuth.upsert({
      where: {
        userId_service: {
          userId: data.userId,
          service: data.service,
        },
      },
      create: {
        userId: data.userId,
        service: data.service,
        providerUserId: data.provider_user_id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at ? new Date(data.expires_at) : null,
        metadata: data.metadata || {},
      },
      update: {
        providerUserId: data.provider_user_id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: data.expires_at ? new Date(data.expires_at) : null,
        metadata: data.metadata || {},
      },
    });
  }

  async findByUserAndService(userId: number, service: string) {
    return this.prisma.serviceAuth.findUnique({
      where: {
        userId_service: { userId, service },
      },
    });
  }

  async findUsersWithService(service: string) {
    return this.prisma.serviceAuth.findMany({
      where: { service },
    });
  }

  async findAllByUser(userId: number) {
    return this.prisma.serviceAuth.findMany({
      where: { userId },
    });
  }

  async updateTokens(
    userId: number,
    service: string,
    data: {
      accessToken?: string;
      refreshToken?: string;
      expiresAt?: Date | null;
    }
  ) {
    return this.prisma.serviceAuth.update({
      where: { userId_service: { userId, service } },
      data: {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt:
          data.expiresAt !== undefined && data.expiresAt !== null
            ? new Date(data.expiresAt)
            : null,
      },
    });
  }

  async updateMetadata(
    userId: number,
    service: string,
    metadata: Record<string, any>,
  ) {
    const existing = await this.findByUserAndService(userId, service);

    const existingMeta =
      existing?.metadata &&
      typeof existing.metadata === 'object' &&
      !Array.isArray(existing.metadata)
        ? (existing.metadata as Record<string, any>)
        : {};

    const newMeta = {
      ...existingMeta,
      ...metadata,
    };

    return this.prisma.serviceAuth.update({
      where: { userId_service: { userId, service } },
      data: { metadata: newMeta },
    });
  }
}

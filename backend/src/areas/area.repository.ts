import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AreaRepository {
  constructor(private prisma: PrismaService) {}

  async findMatchingAreas(userId: number, service: string, type: string) {
    if (!userId || Number.isNaN(Number(userId))) {
        throw new Error(`findMatchingAreas invalid userId: ${userId}`);
    }
    return this.prisma.area.findMany({
      where: {
        userId,
        actionService: service,
        actionType: type,
        active: true,
      },
    });
  }

  async findUsersWithAction(service: string, type: string) {
    return this.prisma.area.findMany({
      where: {
        actionService: service,
        actionType: type,
        active: true,
      },
      include: { user: true },
    });
  }
}

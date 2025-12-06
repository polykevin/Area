import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AreaRepository {
  constructor(private prisma: PrismaService) {}

  async createArea(data) {
    return this.prisma.area.create({ data });
  }

  async findMatchingAreas(userId: number, service: string, type: string) {
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

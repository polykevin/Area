import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';

@Injectable()
export class AreasService {
  constructor(private prisma: PrismaService) {}

  async findByUser(userId: number) {
    return this.prisma.area.findMany({
      where: { userId },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(userId: number, id: number) {
    const area = await this.prisma.area.findFirst({
      where: { id, userId },
    });

    if (!area) throw new NotFoundException('Area not found');
    return area;
  }

  async create(userId: number, dto: CreateAreaDto) {
    return this.prisma.area.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async update(userId: number, id: number, dto: UpdateAreaDto) {
    await this.findOne(userId, id);

    return this.prisma.area.update({
      where: { id },
      data: dto,
    });
  }

  async delete(userId: number, id: number) {
    await this.findOne(userId, id);

    return this.prisma.area.delete({
      where: { id },
    });
  }
}

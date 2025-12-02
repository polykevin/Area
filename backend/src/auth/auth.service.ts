import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async register(email: string, password: string) {
    const exists = await this.prisma.user.findUnique({
      where: { email },
    });
    if (exists) {
      throw new ConflictException('Email already taken');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        provider: 'local',
      },
    });
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    };
  }
  health() {
    return { status: 'ok', scope: 'auth' };
  }
}

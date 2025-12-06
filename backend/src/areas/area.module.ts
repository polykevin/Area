import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AreaRepository } from './area.repository';
import { AreasController } from './area.controller';

@Module({
  controllers: [AreasController],
  providers: [
    PrismaService,
    AreaRepository
  ],
  exports: [
    AreaRepository
  ]
})
export class AreasModule {}

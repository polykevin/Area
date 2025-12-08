import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AreaRepository } from './area.repository';
import { AreasController } from './area.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AreasService } from './area.service';

@Module({
  imports: [PrismaModule],
  controllers: [AreasController],
  providers: [
    PrismaService,
    AreaRepository,
    AreasService
  ],
  exports: [
    AreaRepository,
    AreasService
  ]
})
export class AreasModule {}

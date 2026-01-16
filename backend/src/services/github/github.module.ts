import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AreasModule } from '../../areas/area.module';
import { GithubService } from './github.service';
import { NewIssueHook } from './hooks/new-issue.hook';
import { ServiceAuthRepository } from 'src/auth/service-auth.repository';
import { ServiceRegistry } from '../service.registry';

@Module({
  imports: [
    PrismaModule,
    AreasModule,
  ],
  providers: [
    GithubService,
    ServiceAuthRepository,
    NewIssueHook,
    ServiceRegistry,
  ],
  exports: [
    GithubService,
    ServiceAuthRepository,
    NewIssueHook,
    ServiceRegistry,
  ],
})
export class GithubModule {}

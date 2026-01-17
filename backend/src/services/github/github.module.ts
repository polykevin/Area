import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AreasModule } from '../../areas/area.module';
import { GithubService } from './github.service';
import { GithubNewIssueHook } from './hooks/new-issue.hook';
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
    GithubNewIssueHook,
    ServiceRegistry,
  ],
  exports: [
    GithubService,
    ServiceAuthRepository,
    GithubNewIssueHook,
    ServiceRegistry,
  ],
})
export class GithubModule {}

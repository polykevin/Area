import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AreasModule } from '../../areas/area.module';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { ServiceRegistry } from '../service.registry';
import { GitLabService } from './gitlab.service';
import { GitLabOAuthProvider } from '../../auth/providers/gitlab.oauth';
import { NewIssueHook } from './hooks/new-issue.hook';
import { NewMergeRequestHook } from './hooks/new-merge-request.hook';

@Module({
  imports: [
    PrismaModule,
    AreasModule,
  ],
  providers: [
    GitLabService,
    GitLabOAuthProvider,
    ServiceAuthRepository,
    NewIssueHook,
    NewMergeRequestHook,
    ServiceRegistry,
  ],
  exports: [
    GitLabService,
    GitLabOAuthProvider,
    ServiceAuthRepository,
    NewIssueHook,
    NewMergeRequestHook,
    ServiceRegistry,
  ],
})
export class GitLabModule {}

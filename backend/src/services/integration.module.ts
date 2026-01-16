import { Module } from '@nestjs/common';
import { GoogleModule } from './google/google.module';
import { AuthModule } from '../auth/auth.module';
import { AreasModule } from '../areas/area.module';
import { ServiceRegistry } from './service.registry';
import { AutomationEngine } from '../automation/engine.service';
import { GoogleService } from './google/google.service';
import { ServiceAuthRepository } from '../auth/service-auth.repository';
import { NewEmailHook } from './google/hooks/new-email.hook';
import { googleIntegration } from './google/google.integration';
import { GithubModule } from './github/github.module';
import { GithubService } from './github/github.service';
import { NewIssueHook } from './github/hooks/new-issue.hook';
import { githubIntegration } from './github/github.integration';

@Module({
  imports: [
    GoogleModule,
    GithubModule,
    AuthModule,
    AreasModule,
  ],
  providers: [
    ServiceRegistry,
    AutomationEngine,
    GoogleService,
    GithubService,
    ServiceAuthRepository,
    NewEmailHook,
  ],
  exports: [
    ServiceRegistry,
    AutomationEngine,
  ],
})
export class IntegrationModule {
  constructor(
    private registry: ServiceRegistry,
    private engine: AutomationEngine,

    private googleService: GoogleService,
    private newEmailHook: NewEmailHook,

    private githubService: GithubService,
    private newIssueHook: NewIssueHook,

    private authRepo: ServiceAuthRepository,
  ) {
    newEmailHook.setEngine(engine);
    newIssueHook.setEngine(engine);

    registry.register(
      googleIntegration(googleService, authRepo, engine, newEmailHook)
    );
    registry.register(
      githubIntegration(githubService, authRepo, engine, newIssueHook)
    );
  }
}

import { Module } from '@nestjs/common';
import { GoogleModule } from './google/google.module';
import { ServiceRegistry } from './service.registry';

@Module({
  imports: [
    GoogleModule,
  ],
  providers: [
    ServiceRegistry,
  ],
  exports: [
    ServiceRegistry,
  ],
})
export class IntegrationModule {}

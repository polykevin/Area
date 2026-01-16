import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AreasModule } from '../../areas/area.module';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { ServiceRegistry } from '../service.registry';
import { DropboxService } from './dropbox.service';
import { DropboxOAuthProvider } from '../../auth/providers/dropbox.oauth';
import { NewFileHook } from './hooks/new-file.hook';
import { FileChangedHook } from './hooks/file-changed.hook';

@Module({
  imports: [
    PrismaModule,
    AreasModule
  ],
  providers: [
    DropboxService,
    DropboxOAuthProvider,
    ServiceAuthRepository,
    NewFileHook,
    FileChangedHook,
    ServiceRegistry,
  ],
  exports: [
    DropboxService,
    DropboxOAuthProvider,
    ServiceAuthRepository,
    NewFileHook,
    FileChangedHook,
    ServiceRegistry,
  ],
})
export class DropboxModule {}

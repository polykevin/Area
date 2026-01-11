import { Module } from '@nestjs/common';
import { AuthModule } from '../../auth/auth.module';
import { InstagramService } from './instagram.service';
import { NewMediaHook } from './hooks/new-media.hook';

@Module({
  imports: [
    AuthModule,
  ],
  providers: [
    InstagramService,
    NewMediaHook,
  ],
  exports: [
    InstagramService,
    NewMediaHook,
  ],
})
export class InstagramModule {}

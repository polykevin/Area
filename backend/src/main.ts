import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import waitPort from 'wait-port';

async function bootstrap() {
  await waitPort({
    host: 'db',
    port: 5432,
    timeout: 30000,
  });

  const app = await NestFactory.create(AppModule);
  await app.listen(8080);
}
bootstrap();
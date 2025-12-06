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

  app.enableCors({
    origin: 'http://localhost:8081',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
  });

  await app.listen(8080);
}
bootstrap();
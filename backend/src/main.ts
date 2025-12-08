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

  app.enableCors({ origin: process.env.FRONTEND_URL,
    credentials: true,
  });

  await app.listen(8080, "0.0.0.0");
}
bootstrap();
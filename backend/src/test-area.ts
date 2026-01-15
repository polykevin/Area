import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AutomationEngine } from './automation/engine.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const engine = app.get(AutomationEngine);

  await engine.emitHookEvent({
    userId: 1, // ⚠️ doit exister en DB
    actionService: 'google',
    actionType: 'new_email',
    payload: {
      from: 'test@example.com',
      subject: 'Test AREA',
    },
  });

  console.log('AREA test event emitted.');
  await app.close();
}

bootstrap().catch(console.error);

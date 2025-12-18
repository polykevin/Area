import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AutomationEngine } from './automation/engine.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Get the AutomationEngine from NestJS DI container
  const engine = app.get(AutomationEngine);

  // Trigger the AREA manually
  await engine.emitHookEvent({
    userId: 1, // Replace with the actual user ID from your db
    actionService: 'google', // Replace with your AREA's actionService
    actionType: 'new_email', // Replace with your AREA's actionType
    payload: {
      from: 'kevin.poly@epitech.eu', // Example payload
    },
  });

  console.log('AREA test event emitted.');
  await app.close();
}

bootstrap();

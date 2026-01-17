import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TrelloService } from './services/trello/trello.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const trello = app.get(TrelloService);

  const listId = await trello.findListIdByName(
    1,     
    'AREA',   
    'test'   
  );

  await trello.createCard(
    1,
    listId,
    'Carte test BACKEND',
    'Créée sans clock'
  );



  await app.close();
}

bootstrap().catch(console.error);

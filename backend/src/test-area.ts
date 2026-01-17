import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotionService } from './services/notion/notion.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const notion = app.get(NotionService);

  const databaseId = '2e99859422a18036963dc0cdfd378f5b';

  console.log('[TEST] Creating Notion page...');

 await notion.createPage(
  1,
  databaseId,
  'Test NOTION backend',
  'Page créée avec OAuth 🎉'
);


  console.log('[TEST] Notion page created');

  await app.close();
}

bootstrap().catch(console.error);

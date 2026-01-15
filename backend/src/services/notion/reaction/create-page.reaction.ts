import { ReactionDefinition } from '../../abstract/service.interface';

export const NotionCreatePageReaction = {
  id: 'create_page',
  name: 'Create page',

  async execute(ctx) {
    const { notionService, event, params, token } = ctx;
    if (!notionService) {
      throw new Error('Notion service instance missing');
    }

    const title = event?.subject || 'Sans titre';
    const content = `Provenance: ${event?.from || 'Inconnu'}`;
    const databaseId = params?.databaseId || '2e99859422a18036963dc0cdfd378f5b';

    console.log('[NOTION]New page created');

    return await notionService.createPage(databaseId, title, content);
  },
};
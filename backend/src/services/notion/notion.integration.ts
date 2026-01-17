import { NotionCreatePageAction } from './action/create-page.action';
import { NotionCreatePageReaction } from './reaction/create-page.reaction';

export function notionIntegration(notionService) {
  return {
    id: 'notion',
    displayName: 'Notion',
    color: '#000000',
    iconKey: 'notion',

    instance: {
      notionService,
    },

    actions: [NotionCreatePageAction],
    reactions: [NotionCreatePageReaction],
    hooks: [],
  };
}

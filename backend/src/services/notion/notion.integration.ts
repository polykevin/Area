import { NotionCreatePageReaction } from './reaction/create-page.reaction';

export function notionIntegration(notionService) {
  return {
    id: 'notion',
    displayName: 'Notion',
    color: '#000000',
    iconKey: 'notion',

    instance: {
      notionService
    },

    actions: [],
    reactions: [
      NotionCreatePageReaction,
    ],
    hooks: []
  };
}
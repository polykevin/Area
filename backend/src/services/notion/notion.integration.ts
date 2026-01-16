import { NotionCreatePageReaction } from './reaction/create-page.reaction';

export function notionIntegration(notionService) {
  return {
    id: 'notion',
    displayName: 'Notion',

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
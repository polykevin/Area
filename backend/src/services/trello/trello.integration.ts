import { trelloCardCreatedAction } from './actions/card-created.action';
import { trelloCreateCardReaction } from './reactions/create-card.reaction';

export function trelloIntegration(
  trelloService,
  authRepo,
  engine,
  trelloCardCreatedHook,
) {
  return {
    id: 'trello',
    displayName: 'Trello',
    color: '#0052CC',
    iconKey: 'trello',

    instance: {
      trelloService,
      authRepo,
      engine,
    },

    actions: [trelloCardCreatedAction],
    reactions: [trelloCreateCardReaction],
    hooks: [trelloCardCreatedHook],
  };
}

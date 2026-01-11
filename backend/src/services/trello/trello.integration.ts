import { trelloCardCreatedAction } from './actions/card-created.action';
import { TrelloCardCreatedHook } from './hooks/card-created.hook';

export function trelloIntegration(
  authRepo,
  engine,
  trelloCardCreatedHook,
) {
  return {
    id: 'trello',
    displayName: 'Trello',

    actions: [
      trelloCardCreatedAction,
    ],

    reactions: [],

    hooks: [
      trelloCardCreatedHook,
    ],
  };
}

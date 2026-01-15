import { trelloCardCreatedAction } from "./action/card-created.action"; 

export function trelloIntegration() {
  return {
    id: 'trello',
    displayName: 'Trello',

    instance: {},

    actions: [
      trelloCardCreatedAction,
    ],

    reactions: [],
  };
}

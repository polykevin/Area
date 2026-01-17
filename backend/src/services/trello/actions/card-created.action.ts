export const trelloCardCreatedAction = {
  id: 'card_created',
  name: 'Card Created',
  displayName: 'Card Created',
  description: 'Triggered when a Trello card is created',

  input: [],

  match: (_payload: any, _params: any) => true,
};

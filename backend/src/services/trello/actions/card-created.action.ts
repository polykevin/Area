export const trelloCardCreatedAction = {
  id: 'card_created',
  name: 'card_created',
  displayName: 'Card Created',
  description: 'Triggered when a Trello card is created',

  match: (_payload: any, _params: any) => {
    return true;
  },
};

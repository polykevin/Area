export const trelloCardCreatedAction = {
  id: 'trello_card_created',
  name: 'Card created',

  match(payload: any) {
    return !!payload?.id && !!payload?.name;
  },
};

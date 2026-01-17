export const trelloCreateCardReaction = {
  id: 'create_card',
  name: 'create_card',
  displayName: 'Create Trello Card',
  description: 'Create a new card in a Trello list',

  execute: async ({ token, params, trelloService }) => {
    if (!token) {
      throw new Error('Trello account not connected');
    }

    const { boardName, listName, name, desc } = params;

    const listId = await trelloService.findListIdByName(
      token.userId,
      boardName,
      listName
    );

    await trelloService.createCard(token.userId, listId, name, desc);

    return { success: true };
  },
};

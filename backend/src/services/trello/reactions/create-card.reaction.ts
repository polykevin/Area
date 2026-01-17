export const trelloCreateCardReaction = {
  id: 'create_card',
  name: 'Create Trello Card',
  displayName: 'Create Trello Card',
  description: 'Create a new card in a Trello list',

  input: [
    {
      key: 'boardName',
      label: 'Board name',
      type: 'string',
      required: true,
      placeholder: 'My Board',
      helpText: 'Name of the Trello board.',
    },
    {
      key: 'listName',
      label: 'List name',
      type: 'string',
      required: true,
      placeholder: 'To Do',
      helpText: 'Name of the list inside the board.',
    },
    {
      key: 'name',
      label: 'Card title',
      type: 'string',
      required: true,
      placeholder: 'New task',
      helpText: 'Title of the card to create.',
    },
    {
      key: 'desc',
      label: 'Description (optional)',
      type: 'string',
      required: false,
      placeholder: 'Details...',
      helpText: 'Card description.',
    },
  ],

  async execute({ token, params, trelloService }) {
    if (!token) {
      throw new Error('Trello account not connected');
    }

    const boardName = String(params?.boardName ?? '').trim();
    const listName = String(params?.listName ?? '').trim();
    const name = String(params?.name ?? '').trim();
    const desc = params?.desc != null ? String(params.desc) : undefined;

    if (!boardName) throw new Error('boardName is required');
    if (!listName) throw new Error('listName is required');
    if (!name) throw new Error('name is required');

    const listId = await trelloService.findListIdByName(
      token.userId,
      boardName,
      listName,
    );

    await trelloService.createCard(token.userId, listId, name, desc);

    return { success: true };
  },
};

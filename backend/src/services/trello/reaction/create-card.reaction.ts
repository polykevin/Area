export const TrelloCreateCardReaction = {
  id: 'create_card',
  name: 'Create Trello card',

  async execute({ params }) {
    const {
      apiKey,
      token,
      listId,
      title,
      description,
    } = params;

    if (!apiKey || !token || !listId || !title) {
      throw new Error('Missing Trello parameters');
    }

    const url = new URL('https://api.trello.com/1/cards');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('token', token);
    url.searchParams.set('idList', listId);
    url.searchParams.set('name', title);

    if (description) {
      url.searchParams.set('desc', description);
    }

    const res = await fetch(url.toString(), {
      method: 'POST',
    });

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Trello error: ${txt}`);
    }

    return res.json();
  },
};

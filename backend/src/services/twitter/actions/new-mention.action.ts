export const newMentionAction = {
  id: 'new_mention',
  name: 'New Mention',

  match: (payload, params) => {
    if (!params) return true;

    if (params.contains && typeof payload?.text === 'string') {
      return payload.text.includes(params.contains);
    }

    return true;
  }
};

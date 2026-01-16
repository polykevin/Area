export const newMentionAction = {
  id: 'new_mention',
  name: 'New Mention',
  displayName: 'New Mention',
  description: 'Triggers when your account is mentioned.'

  match: (payload, params) => {
    if (!params) return true;

    if (params.contains && typeof payload?.text === 'string') {
      return payload.text.includes(params.contains);
    }

    return true;
  }
};

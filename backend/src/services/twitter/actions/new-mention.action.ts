export const newMentionAction = {
  id: 'new_mention',
  name: 'New Mention',
  displayName: 'New Mention',
  description: 'Triggers when your account is mentioned.',
  input: [
    {
      key: 'contains',
      label: 'Mention contains (optional)',
      type: 'string',
      required: false,
      placeholder: 'AREA',
      helpText: 'Only trigger if the mention text contains this string.',
    },
  ],

  match: (payload, params) => {
    if (!params) return true;

    if (params.contains && typeof payload?.text === 'string') {
      return payload.text.includes(params.contains);
    }

    return true;
  }
};

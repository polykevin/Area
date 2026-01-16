export const newEmailAction = {
  id: 'new_email',
  name: 'New Email Received',
  displayName: 'New Email Received',
  description: 'Triggers when a new email is received.',
  input: [
    {
      key: 'from',
      label: 'From',
      type: 'string',
      required: false,
      placeholder: 'boss@company.com',
      helpText: 'Only trigger for emails from this sender.',
    },
  ],

  match: (payload, params) => {
    if (!params) return true;
    if (params.from && payload.from !== params.from) return false;
    return true;
  }
};

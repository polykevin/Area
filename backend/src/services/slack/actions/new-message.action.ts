export const newMessageAction = {
  id: 'new_message',
  name: 'New Slack Message',
  displayName: 'New Message',
  description: 'Triggers when a new message is received.',
  input: [
    {
      key: 'channel',
      label: 'Channel / conversation (optional)',
      type: 'string',
      required: false,
      placeholder: 'general',
      helpText: 'Only trigger for messages in this channel/conversation.',
    },
    {
      key: 'user',
      label: 'From user (optional)',
      type: 'string',
      required: false,
      placeholder: 'john.doe',
      helpText: 'Only trigger if the sender matches this value.',
    },
    {
      key: 'contains',
      label: 'Message contains (optional)',
      type: 'string',
      required: false,
      placeholder: 'urgent',
      helpText: 'Only trigger if the message contains this text.',
    },
  ],
  match: (payload, params) => {
    if (!params) return true;

    if (params.channel && payload.channel !== params.channel) return false;
    if (params.user && payload.user !== params.user) return false;
    if (params.contains && !payload.text?.toLowerCase().includes(params.contains.toLowerCase())) {
      return false;
    }

    return true;
  },
};

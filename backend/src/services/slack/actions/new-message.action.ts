export const newMessageAction = {
  id: 'new_message',
  name: 'New Slack Message',
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

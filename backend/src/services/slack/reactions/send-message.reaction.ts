export const sendMessageReaction = {
  id: "send_slack_message",
  name: "Send a Slack Message",
  displayName: 'Send Message',
  description: 'Sends a message to the selected conversation or recipient.',
  input: [
    {
      key: 'channel',
      label: 'Channel / conversation',
      type: 'string',
      required: true,
      placeholder: 'general',
      helpText: 'Where to send the message.',
    },
    {
      key: 'text',
      label: 'Message',
      type: 'string',
      required: true,
      placeholder: 'Hello!',
      helpText: 'Message content to send.',
    },
  ],

  execute: async ({ token, params, slackService }) => {
    if (!token) {
      throw new Error("Slack account not connected.");
    }

    const { channel, text } = params;

    if (!channel) {
      throw new Error("Missing 'channel' parameter.");
    }

    if (!text) {
      throw new Error("Missing 'text' parameter.");
    }

    await slackService.sendMessage(token.accessToken, channel, text);

    return { success: true };
  },
};

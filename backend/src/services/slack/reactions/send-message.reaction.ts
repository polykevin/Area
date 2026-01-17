export const sendMessageReaction = {
  id: "send_slack_message",
  name: "Send a Slack Message",

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

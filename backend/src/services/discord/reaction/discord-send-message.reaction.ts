export const sendMessageReaction = {
  id: 'discord_send_message',
  name: 'discord.send.message',
  displayName: 'Send Discord message',
  description: 'Sends a discord message',

  input: [
    {
      key: 'webhookUrl',
      label: 'Webhook URL',
      type: 'string',
      required: true,
      placeholder: 'https://discord.com/api/webhooks/...',
      helpText: 'Discord webhook URL.',
    },
    {
      key: 'message',
      label: 'Message',
      type: 'string',
      required: true,
      placeholder: 'Hello from AREA 👋',
      helpText: 'Message content.',
    },
  ],

  execute: async ({ token, params, event }) => {
    if (!params?.webhookUrl) {
      throw new Error('Discord webhook URL is required');
    }

    if (!params.message) {
      throw new Error('Discord message is required');
    }

    const res = await fetch(params.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: params.message,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Discord webhook failed: ${text}`);
    }

    return { success: true };
  },
};
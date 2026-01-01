export const sendMessageReaction = {
  id: 'discord_send_message', 
  name: 'discord.send.message',
  async execute({ params }) {
    await fetch(params.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: params.message }),
    });
  }
};

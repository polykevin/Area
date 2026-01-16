export const sendMessageReaction = {
  id: 'discord_send_message', 
  name: 'discord.send.message',
  async execute({ params }) {
    // console.log("REACTION DISCORD DECLENCHEE !");
    // console.log("Paramètres reçus :", params);

    if (!params?.webhookUrl) {
      console.error("Erreur : webhookUrl missing");
      return;
    }

    await fetch(params.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: params.message }),
    });
  }
};
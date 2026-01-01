import { sendMessageReaction } from './reactions/discord-messages.action';

export function discordIntegration(discordService) {
  return {
    id: 'discord',
    displayName: 'Discord',

    instance: discordService,

    actions: [],

    reactions: [
      sendMessageReaction,
    ],

    hooks: [],
  };
}

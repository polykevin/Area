import { sendMessageReaction } from './reaction/discord-send-message.reaction'

export function discordIntegration(discordService) {
  return {
    id: 'discord',
    displayName: 'Discord',
    instance: {},
    actions: [],
    reactions: [sendMessageReaction],
    hooks: [],
  };
}
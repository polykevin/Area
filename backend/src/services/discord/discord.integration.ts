import { sendMessageReaction } from './reaction/discord-send-message.reaction'

export function discordIntegration(discordService) {
  return {
    id: 'discord',
    displayName: 'Discord',
    color: '#5865F2',
    iconKey: 'discord',
    instance: {},
    actions: [],
    reactions: [sendMessageReaction],
    hooks: [],
  };
}

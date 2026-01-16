import { newMessageAction } from './actions/new-message.action';
import { SlackNewMessageHook } from './hooks/slack-new-message.hook';
import { sendMessageReaction } from './reactions/send-message.reaction';

export function slackIntegration(slackService, authRepo, engine, newMessageHook) {
  return {
    id: 'slack',
    displayName: 'Slack',
    color: '#4A154B',
    iconKey: 'slack',

    instance: {
      slackService,
      authRepo,
      engine,
    },

    actions: [
      newMessageAction,
    ],

    reactions: [
      sendMessageReaction,
    ],

    hooks: [
      newMessageHook,
    ],
  }
};

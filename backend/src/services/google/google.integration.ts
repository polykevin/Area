import { newEmailAction } from './actions/new-email.action';
import { NewEmailHook } from './hooks/new-email.hook';
import { sendEmailReaction } from './reactions/send-email.reaction';

export function googleIntegration(googleService, authRepo, engine, newEmailHook) {
  return {
    id: 'google',
    displayName: 'Google',

    instance: {
      googleService,
      authRepo,
      engine,
    },

    actions: [
      newEmailAction,
    ],

    reactions: [
        sendEmailReaction
    ],

    hooks: [
      newEmailHook
    ]
  };
}

import { newEmailAction } from './actions/new-email.action';
import { NewEmailHook } from './hooks/new-email.hook';
import { sendEmailReaction } from './reactions/send-email.reaction';
import { createDriveFileReaction } from './reactions/create-drive-file.reaction';

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
        sendEmailReaction,
        createDriveFileReaction,
    ],

    hooks: [
      newEmailHook
    ]
  };
}

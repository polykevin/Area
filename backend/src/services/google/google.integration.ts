import { newEmailAction } from './actions/new-email.action';
import { NewEmailHook } from './hooks/new-email.hook';
import { sendEmailReaction } from './reactions/send-email.reaction';
<<<<<<< HEAD
import { createDriveFileReaction } from './reactions/create-drive-file.reaction';
=======
import { calendarEventCreatedAction } from './actions/calendar-event.action';
>>>>>>> 1a7f805

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
      calendarEventCreatedAction,
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

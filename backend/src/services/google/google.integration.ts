import { newEmailAction } from './actions/new-email.action';
import { calendarEventCreatedAction } from './actions/calendar-event.action';
import { sendEmailReaction } from './reactions/send-email.reaction';
import { createDriveFileReaction } from './reactions/create-drive-file.reaction';

export function googleIntegration(googleService, authRepo, engine, newEmailHook, calendarEventHook) {
  return {
    id: 'google',
    displayName: 'Gmail',
    color: '#EA4335',
    iconKey: 'gmail',

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
      newEmailHook,
      calendarEventHook,
    ],
  };
}

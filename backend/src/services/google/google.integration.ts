import { newEmailAction } from './actions/new-email.action';
import { NewEmailHook } from './hooks/new-email.hook';
import { sendEmailReaction } from './reactions/send-email.reaction';
import { calendarEventCreatedAction } from './actions/calendar-event.action';

export function googleIntegration(googleService, authRepo, engine, newEmailHook) {
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
        sendEmailReaction
    ],

    hooks: [
      newEmailHook
    ]
  };
}
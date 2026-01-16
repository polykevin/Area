import { everyMinuteAction } from './actions/every-minute.action';
import { everyDayAtAction } from './actions/every-day-at.action';
import { sendTimeReaction } from './reactions/send-time.reaction';

export function clockIntegration(
  clockService,
  authRepo,
  engine,
  everyMinuteHook,
  everyDayAtHook,
) {
  return {
    id: 'clock',
    displayName: 'Clock',
    color: '#00BFA5',
    iconKey: 'clock',

    instance: {
      clockService,
      authRepo,
      engine,
    },

    actions: [everyMinuteAction, everyDayAtAction],

    reactions: [sendTimeReaction],

    hooks: [everyMinuteHook, everyDayAtHook],
  };
}

export const everyDayAtAction = {
  id: 'clock.every_day_at',
  name: 'clock.every_day_at',
  displayName: 'Every day at…',
  description: 'Triggers every day at a specific hour and minute.',

  input: {
    hour: { type: 'number', required: true },
    minute: { type: 'number', required: true },
  },

  match(event: { actionService: string; actionType: string }) {
    return (
      event.actionService === 'clock' &&
      event.actionType === 'clock.every_day_at'
    );
  },

  async run({ services }) {
    return services.clockService.getCurrentTime();
  },
};

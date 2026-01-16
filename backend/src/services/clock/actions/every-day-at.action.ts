export const everyDayAtAction = {
  id: 'clock.every_day_at',
  name: 'clock.every_day_at',
  displayName: 'Every day at…',
  description: 'Triggers every day at a specific hour and minute.',
  input: [
    {
      key: 'time',
      label: 'Time (HH:MM)',
      type: 'string',
      required: true,
      placeholder: '09:00',
      helpText: '24-hour format (local time). Example: 09:00, 18:30.',
    },
  ],

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

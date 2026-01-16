export const everyMinuteAction = {
  id: 'clock.every_minute',
  name: 'clock.every_minute',
  displayName: 'Every minute',
  input: {},
  match(event: { actionService: string; actionType: string }) {
    return (
      event.actionService === 'clock' &&
      event.actionType === 'clock.every_minute'
    );
  },
  async run({ services }) {
    return services.clockService.getCurrentTime();
  },
};

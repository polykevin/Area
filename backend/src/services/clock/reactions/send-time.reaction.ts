export const sendTimeReaction = {
  id: 'clock.send_time',
  name: 'clock.send_time',
  displayName: 'Send current time',
  description: 'Returns the current time from the clock service.',

  input: {},

  async execute({ services }) {
    const { clockService } = services;
    return clockService.getCurrentTime();
  },
};

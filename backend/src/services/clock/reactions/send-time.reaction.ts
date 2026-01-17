export const sendTimeReaction = {
  id: 'clock.send_time',
  name: 'clock.send_time',
  displayName: 'Send current time',

  input: {},

  async execute({ services }) {
    const { clockService } = services;
    return clockService.getCurrentTime();
  },
};

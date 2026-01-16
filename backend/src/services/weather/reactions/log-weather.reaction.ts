import { WeatherData } from '../weather.interface';

export const logWeatherReaction = {
  id: 'log_weather',
  name: 'Log Weather Event',
  displayName: 'Log Weather Data',
  description: 'Logs the current weather data for later use or tracking.'

  execute: async ({ params, event, meta }: { params?: any; event?: WeatherData; meta?: any }) => {
    if (!event) {
      console.warn('logWeatherReaction: missing event', { params, meta });
      return { success: false, reason: 'missing_event' };
    }

    const {
      temperature,
      condition,
      humidity,
      timestamp,
      ...rest
    } = event as Partial<WeatherData>;

    console.log(
      `[log_weather] ${timestamp ?? new Date().toISOString()} — ${location} — ${condition ?? 'N/A'} — temp: ${temperature ?? 'N/A'}`
    );

    console.debug('log_weather - details:', {
      humidity,
      extra: Object.keys(rest).length ? rest : undefined,
      params,
      meta,
    });

    return { success: true };
  },
};

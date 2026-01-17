import { newWeatherDataAction } from './actions/new-weather-data.action';
import { NewWeatherDataHook } from './hooks/new-weather-data.hook';
import { logWeatherReaction } from './reactions/log-weather.reaction';

export function weatherIntegration(weatherService, authRepo, engine, newWeatherDataHook) {
  return {
    id: 'weather',
    displayName: 'Weather',
    color: '#1E88E5',
    iconKey: 'weather',

    instance: {
      weatherService,
      authRepo,
      engine,
    },

    actions: [
      newWeatherDataAction,
    ],

    reactions: [
      logWeatherReaction,
    ],

    hooks: [
      newWeatherDataHook,
    ],
  };
}

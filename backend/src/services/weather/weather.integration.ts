import { newWeatherDataAction } from './actions/new-weather-data.action';
import { NewWeatherDataHook } from './hooks/new-weather-data.hook';
//import { logWeatherReaction } from './reactions/log-weather.reaction';

export function weatherIntegration(weatherService, authRepo, engine, newWeatherDataHook) {
  return {
    id: 'weather',
    displayName: 'Weather',

    instance: {
      weatherService,
      authRepo,
      engine,
    },

    actions: [
      newWeatherDataAction,
    ],

    reactions: [
      //logWeatherReaction,
    ],

    hooks: [
      newWeatherDataHook,
    ],
  };
}

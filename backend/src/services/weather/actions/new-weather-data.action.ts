import { ActionDefinition } from '../../abstract/service.interface';
import { WeatherData } from '../weather.interface';

export const newWeatherDataAction: ActionDefinition<WeatherData, any> = {
  id: 'new_weather_data',
  name: 'New Weather Data',
  match: () => true,
};

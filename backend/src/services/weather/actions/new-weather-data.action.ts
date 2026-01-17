import { ActionDefinition } from '../../abstract/service.interface';
import { WeatherData } from '../weather.interface';

export const newWeatherDataAction: ActionDefinition<WeatherData, any> = {
  id: 'new_weather_data',
  name: 'New Weather Data',
  displayName: 'New Weather Data',
  description: 'Triggers when new weather data is available for the selected location.',
  input: [
    {
      key: 'location',
      label: 'Location',
      type: 'string',
      required: true,
      placeholder: 'Paris, FR',
      helpText: 'Location to monitor for weather updates.',
    },
  ],

  match: () => true,
};

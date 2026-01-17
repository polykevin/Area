import { Injectable, Logger } from '@nestjs/common';
import { WeatherData } from './weather.interface';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData | null> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

    const res = await fetch(url);
    if (!res.ok) {
      this.logger.error(`Weather API failed (${res.status})`);
      throw new Error(`Weather API failed (${res.status})`);
    }

    const data = await res.json();
    const current = data.current_weather;
    if (!current) return null;

    return {
      temperature: current.temperature ?? null,
      windspeed: current.windspeed ?? null,
      humidity: null,
      condition: current.weathercode?.toString() ?? null,
      timestamp: Date.now(),
    };
  }

  async getHourlyForecast(latitude: number, longitude: number, hours = 12) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,windspeed_10m&forecast_days=1`;

    const res = await fetch(url);
    if (!res.ok) {
      this.logger.error(`Weather hourly forecast failed (${res.status})`);
      throw new Error(`Weather hourly forecast failed (${res.status})`);
    }

    return await res.json();
  }
}

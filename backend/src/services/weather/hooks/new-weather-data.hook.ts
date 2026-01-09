import { Injectable } from '@nestjs/common';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';
import { WeatherService } from '../weather.service';

@Injectable()
export class NewWeatherDataHook {
  private engine: AutomationEngine;

  constructor(
    private authRepo: ServiceAuthRepository,
    private weather: WeatherService,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }

  async poll() {
    if (!this.engine) return;

    const subscribed = await this.authRepo.findUsersWithService('weather');

    for (const record of subscribed) {
      const userId = record.userId;

      const meta =
        record.metadata &&
        typeof record.metadata === 'object' &&
        !Array.isArray(record.metadata)
          ? (record.metadata as Record<string, any>)
          : {};

      const lastTemp = meta.lastTemperature ?? null;

      const latitude = meta.latitude;
      const longitude = meta.longitude;
      if (latitude == null || longitude == null) continue;

      const data = await this.weather.getCurrentWeather(latitude, longitude);
      if (!data) continue;

      if (lastTemp !== null && lastTemp === data.temperature) continue;

      await this.engine.emitHookEvent({
        userId,
        actionService: 'weather',
        actionType: 'new_weather_data',
        payload: data,
      });

      await this.authRepo.updateMetadata(userId, 'weather', {
        lastTemperature: data.temperature,
      });
    }
  }
}

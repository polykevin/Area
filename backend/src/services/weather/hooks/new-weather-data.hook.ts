import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';
import { WeatherService } from '../weather.service';

@Injectable()
export class NewWeatherDataHook {
  private engine: AutomationEngine;
  private readonly logger = new Logger(NewWeatherDataHook.name);

  constructor(
    private authRepo: ServiceAuthRepository,
    private weather: WeatherService,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }

  @Cron('*/30 * * * * *')
  async poll() {
    this.logger.log(`cron poll triggered: ${new Date().toISOString()}`);
    if (!this.engine) {
      this.logger.log('cron poll aborted: engine not set');
      return;
    }

    try {

    const subscribed = await this.authRepo.findUsersWithService('weather');

      this.logger.log(`found ${subscribed.length} subscribed users for weather`);

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
      
      this.logger.log(`processing userId=${userId} latitude=${latitude} longitude=${longitude} lastTemp=${lastTemp}`);
      
      if (latitude == null || longitude == null) {
        this.logger.log(`skipping userId=${userId}: missing coordinates`);
        continue;
      }

      const data = await this.weather.getCurrentWeather(latitude, longitude);
      if (!data) {
        this.logger.log(`skipping userId=${userId}: weather API returned no data`);
        continue;
      }

      this.logger.log(`userId=${userId} current temp=${data.temperature} lastTemp=${lastTemp}`);

      if (lastTemp !== null && lastTemp === data.temperature) {
        this.logger.log(`skipping userId=${userId}: temperature unchanged (${data.temperature})`);
        continue;
      }

      this.logger.log(`emitting event for userId=${userId} with temp=${data.temperature}`);

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

      this.logger.log(`cron poll completed: ${new Date().toISOString()}`);
    } catch (err) {
      this.logger.error('error during weather cron poll', err as any);
    }
  }
}

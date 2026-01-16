import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';
import { ClockService } from '../clock.service';

@Injectable()
export class EveryDayAtHook {
  id = 'clock.every_day_at';
  private engine: AutomationEngine;
  private readonly logger = new Logger(EveryDayAtHook.name);

  constructor(
    private readonly authRepo: ServiceAuthRepository,
    private readonly clock: ClockService,
  ) {}

  setEngine(engine: AutomationEngine) {
    this.engine = engine;
  }

  @Cron('* * * * *')
  async poll() {

    if (!this.engine)
      return;

    const now = this.clock.getCurrentTime();
    const currentHour = now.hour;
    const currentMinute = now.minute;
    const users = await this.authRepo.findUsersWithService('clock');

    for (const record of users) {
      const userId = record.userId;

      const meta =
        record.metadata &&
        typeof record.metadata === 'object' &&
        !Array.isArray(record.metadata)
          ? (record.metadata as Record<string, any>)
          : {};

      const targetHour = meta.hour;
      const targetMinute = meta.minute;

      if (targetHour == null || targetMinute == null)
        continue;

      if (targetHour === currentHour && targetMinute === currentMinute) {

        await this.engine.emitHookEvent({
          userId,
          actionService: 'clock',
          actionType: 'clock.every_day_at',
          payload: { time: now },
        });
      }
    }
  }
}

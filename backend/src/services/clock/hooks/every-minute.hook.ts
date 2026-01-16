import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ServiceAuthRepository } from '../../../auth/service-auth.repository';
import { AutomationEngine } from '../../../automation/engine.service';
import { ClockService } from '../clock.service';

@Injectable()
export class EveryMinuteHook {
  id = 'clock.every_minute';
  private engine: AutomationEngine;
  private readonly logger = new Logger(EveryMinuteHook.name);

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

    const users = await this.authRepo.findUsersWithService('clock');

    for (const record of users) {
      const userId = record.userId;

      await this.engine.emitHookEvent({
        userId,
        actionService: 'clock',
        actionType: 'clock.every_minute',
        payload: { time: now },
      });
    }
  }
}

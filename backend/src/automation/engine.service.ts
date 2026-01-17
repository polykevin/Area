import { Injectable, Logger } from '@nestjs/common';
import { ServiceRegistry } from '../services/service.registry';
import { ServiceAuthRepository } from '../auth/service-auth.repository';
import { AreaRepository } from '../areas/area.repository';

@Injectable()
export class AutomationEngine {
  private readonly logger = new Logger(AutomationEngine.name);

  constructor(
    private registry: ServiceRegistry,
    private authRepo: ServiceAuthRepository,
    private areaRepo: AreaRepository,
  ) {}

  async emitHookEvent(event) {
    if (!event?.userId || Number.isNaN(Number(event.userId))) {
      throw new Error(`emitHookEvent called with invalid userId: ${event?.userId}`);
    }

    const areas = await this.areaRepo.findMatchingAreas(
      event.userId,
      event.actionService,
      event.actionType,
    );

    const actionService = this.registry.get(event.actionService);
    const actionDef = actionService?.actions?.find(a => a.id === event.actionType);

    for (const area of areas) {
      if (actionDef?.match) {
        const ok = actionDef.match(event.payload, area.actionParams ?? {});
        if (!ok) {
          this.logger.debug(
            `Skip areaId=${area.id} (action filters did not match). ` +
              `service=${event.actionService} type=${event.actionType} ` +
              `params=${JSON.stringify(area.actionParams)} ` +
              `target=${event?.payload?.target_branch} source=${event?.payload?.source_branch}`,
          );
          continue;
        }
      }

      const service = this.registry.get(area.reactionService);
      if (!service) continue;

      const reaction = service.reactions.find(r => r.id === area.reactionType);
      if (!reaction) continue;

      const auth = await this.authRepo.findByUserAndService(
        area.userId,
        area.reactionService,
      );

      await reaction.execute({
        token: auth,
        params: area.reactionParams,
        event: event.payload,
        ...service.instance,
      });
    }
  }
}

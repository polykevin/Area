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
      event.actionType
    );

    this.logger.log(`emitHookEvent: user=${event.userId} service=${event.actionService} type=${event.actionType} matchedAreas=${areas.length}`);

    for (const area of areas) {
      try {
        const service = this.registry.get(area.reactionService);
        if (!service) {
          this.logger.warn(`no service registered for reactionService=${area.reactionService}`);
          continue;
        }
        const reaction = service.reactions.find(r => r.id === area.reactionType);
        if (!reaction) {
          this.logger.warn(`no reaction ${area.reactionType} on service ${area.reactionService}`);
          continue;
        }
        const auth = await this.authRepo.findByUserAndService(
          area.userId,
          area.reactionService
        );

        this.logger.log(`executing reaction ${area.reactionService}.${area.reactionType} for areaId=${area.id} user=${area.userId}`);

        await reaction.execute({
          token: auth,
          params: area.reactionParams,
          event: event.payload,
          ...service.instance
        });

        this.logger.log(`reaction executed: areaId=${area.id}`);
      } catch (err) {
        this.logger.error(`error executing reaction for areaId=${area.id}`, err as any);
      }
    }
  }
}

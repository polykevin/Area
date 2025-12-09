import { Injectable } from '@nestjs/common';
import { ServiceRegistry } from '../services/service.registry';
import { ServiceAuthRepository } from '../auth/service-auth.repository';
import { AreaRepository } from '../areas/area.repository';

interface HookEvent {
  userId: number;
  actionService: string;
  actionType: string;
  payload: unknown;
}

@Injectable()
export class AutomationEngine {
  constructor(
    private registry: ServiceRegistry,
    private authRepo: ServiceAuthRepository,
    private areaRepo: AreaRepository,
  ) {}

  async emitHookEvent(event: HookEvent) {
    const areas = await this.areaRepo.findMatchingAreas(
      event.userId,
      event.actionService,
      event.actionType,
    );

    for (const area of areas) {
      const service = this.registry.get(area.reactionService);
      if (!service) continue;
      const reaction = service.reactions.find(
        (r) => r.id === area.reactionType,
      );
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

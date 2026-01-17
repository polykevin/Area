import { Injectable } from '@nestjs/common';
import { ServiceRegistry } from './services/service.registry';

@Injectable()
export class AppService {
  constructor(private registry: ServiceRegistry) {}

  getHello() {
      return { message: "Hello World!" };
  }

  getServices() {
    return this.registry.getAll().map((service) => ({
      id: service.id,
      displayName: service.displayName ?? service.id,
      color: service.color ?? null,
      iconKey: service.iconKey ?? service.id,

      actions: service.actions.map((a) => ({
        id: a.id,
        displayName: a.displayName ?? a.id,
        description: a.description ?? '',
        paramsSchema: a.input ?? {},
      })),

      reactions: service.reactions.map((r) => ({
        id: r.id,
        displayName: r.displayName ?? r.id,
        description: r.description ?? '',
        paramsSchema: r.input ?? {},
      })),
    }));
  }
}

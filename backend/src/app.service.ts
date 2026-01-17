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
      name: service.id,
      actions: service.actions.map((action) => ({
        name: action.id,
        description: "description",
      })),
      reactions: service.reactions.map((reaction) => ({
        name: reaction.id,
        description: "description",
      })),
    }));
  }
}
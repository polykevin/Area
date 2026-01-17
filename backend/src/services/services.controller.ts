import { Controller, Get } from "@nestjs/common";
import { ServiceRegistry } from "./service.registry";

@Controller("services")
export class ServicesController {
  constructor(private readonly registry: ServiceRegistry) {}

  @Get("catalog")
  getCatalog() {
    const services = this.registry.getAll().map((s) => ({
      id: s.id,
      displayName: s.displayName,
      actions: s.actions.map((a) => ({
        id: a.id,
        name: a.name,
      })),
      reactions: s.reactions.map((r) => ({
        id: r.id,
        name: r.name,
      })),
    }));

    return { services };
  }
}
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';
import { ServiceRegistry } from './services/service.registry';

@Controller()
export class AboutController {
  constructor(private registry: ServiceRegistry) {}

  @Get('/about.json')
  getAbout(@Req() req) {
    const clientIp =
      req.headers['x-forwarded-for'] ||
      req.socket.remoteAddress ||
      req.ip ||
      null;

    const services = this.registry.getAll().map((service) => ({
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

    return {
      client: {
        host: clientIp,
      },
      server: {
        current_time: Math.floor(Date.now() / 1000),
        services,
      },
    };
  }
}

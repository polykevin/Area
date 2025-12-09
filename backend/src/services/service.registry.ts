import { Injectable } from '@nestjs/common';
import { ServiceDefinition } from './abstract/service.interface';

@Injectable()
export class ServiceRegistry {
  private readonly services = new Map<string, ServiceDefinition>();

  register(service: ServiceDefinition) {
    if (this.services.has(service.id)) {
      throw new Error(`Service ${service.id} already registered`);
    }
    this.services.set(service.id, service);
    console.log(`Service registered: ${service.id}`);
  }

  get(id: string) {
    return this.services.get(id);
  }

  getAll() {
    return Array.from(this.services.values());
  }
}

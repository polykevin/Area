import { Module } from "@nestjs/common";
import { IntegrationModule } from "./integration.module";
import { ServicesController } from "./services.controller";

@Module({
  imports: [IntegrationModule],
  controllers: [ServicesController],
})
export class ServicesModule {}
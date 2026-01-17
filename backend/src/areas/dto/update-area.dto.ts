import { IsOptional, IsObject, IsBoolean } from "class-validator";
import { Prisma } from "@prisma/client";

export class UpdateAreaDto {
  @IsOptional()
  @IsObject()
  actionParams?: Prisma.InputJsonValue;

  @IsOptional()
  @IsObject()
  reactionParams?: Prisma.InputJsonValue;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
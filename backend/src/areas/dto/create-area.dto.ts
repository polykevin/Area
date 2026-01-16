import { IsString, IsObject, IsOptional, IsBoolean } from "class-validator";
import { Prisma } from "@prisma/client";

export class CreateAreaDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  actionService: string;

  @IsString()
  actionType: string;

  @IsObject()
  actionParams: Prisma.InputJsonValue;

  @IsString()
  reactionService: string;

  @IsString()
  reactionType: string;

  @IsObject()
  reactionParams: Prisma.InputJsonValue;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
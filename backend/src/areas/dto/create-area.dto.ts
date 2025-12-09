import { IsString, IsObject } from "class-validator";

export class CreateAreaDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  actionService: string;

  @IsString()
  actionType: string;

  @IsObject()
  actionParams: any;

  @IsString()
  reactionService: string;

  @IsString()
  reactionType: string;

  @IsObject()
  reactionParams: any;
}

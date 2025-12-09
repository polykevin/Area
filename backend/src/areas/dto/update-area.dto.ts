import { IsOptional, IsObject } from 'class-validator';

export class UpdateAreaDto {
  @IsOptional()
  @IsObject()
  actionParams?: any;

  @IsOptional()
  @IsObject()
  reactionParams?: any;

  @IsOptional()
  active?: boolean;
}

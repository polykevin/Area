import { Body, Controller, Post, Req } from '@nestjs/common';
import { AreaRepository } from './area.repository';

@Controller('areas')
export class AreasController {
  constructor(private areaRepo: AreaRepository) {}

  @Post()
  async create(@Req() req, @Body() body) {
    return this.areaRepo.createArea({
      userId: req.user.id,
      actionService: body.actionService,
      actionType: body.actionType,
      actionParams: body.actionParams,
      reactionService: body.reactionService,
      reactionType: body.reactionType,
      reactionParams: body.reactionParams,
    });
  }
}

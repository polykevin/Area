import { Controller, Get,Post, Body, Param, Put,
  Delete, Req, UseGuards } from '@nestjs/common';
import { AreasService } from './area.service';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('areas')
export class AreasController {
  constructor(private areas: AreasService) {}

  @Get()
  getMyAreas(@Req() req) {
    return this.areas.findByUser(req.user.id);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateAreaDto) {
    return this.areas.create(req.user.id, dto);
  }

  @Get(':id')
  getOne(@Req() req, @Param('id') id: string) {
    return this.areas.findOne(req.user.id, Number(id));
  }

  @Put(':id')
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateAreaDto) {
    return this.areas.update(req.user.id, Number(id), dto);
  }

  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.areas.delete(req.user.id, Number(id));
  }
}


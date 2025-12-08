import { Controller, Get, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private googleService: GoogleService) {}

  @UseGuards(JwtAuthGuard)
  @Get('emails')
  listEmails(@Req() req) {
    return this.googleService.listEmails(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
    @Get('email/:id')
    async getEmail(@Req() req, @Param('id') id: string) {
    return this.googleService.getEmail(req.user.sub, id);
    }
}

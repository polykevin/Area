import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServiceAuthRepository } from '../auth/service-auth.repository';

@Controller('oauth/trello')
export class TrelloOauthController {
  constructor(
    private config: ConfigService,
    private authRepo: ServiceAuthRepository,
  ) {}

  @Get('url')
  getUrl(@Query('userId') userId: string) {
    const key = this.config.get('TRELLO_API_KEY');

    const returnUrl =
      `${process.env.FRONTEND_URL}/oauth/trello/callback?state=${userId}`;

    return {
      url:
        `https://trello.com/1/authorize` +
        `?expiration=never` +
        `&scope=read,write` +
        `&response_type=token` +
        `&key=${key}` +
        `&return_url=${encodeURIComponent(returnUrl)}`,
    };
  }

  @Post('connect')
  async connect(@Body() body: { token: string; state: string }) {
    const apiKey = this.config.get<string>('TRELLO_API_KEY');
    if (!apiKey) {
        throw new Error('TRELLO_API_KEY is missing in env');
    }
    await this.authRepo.saveOrUpdate({
      userId: Number(body.state),
      service: 'trello',
      provider_user_id: body.state,
      access_token: apiKey,
      refresh_token: body.token,
      metadata: {},
    });

    return { success: true };
  }
}

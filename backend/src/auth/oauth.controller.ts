import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { OauthFactoryService } from './oauth.factory';
import { ServiceAuthRepository } from './service-auth.repository';
import type { Request, Response } from 'express';


@Controller('oauth')
export class OauthController {
  constructor(
    private oauthFactory: OauthFactoryService,
    private authRepo: ServiceAuthRepository,
  ) {}

  @Get(':provider/url')
  getAuthUrl(
    @Param('provider') provider: string,
    @Query('userId') userId: string,
    @Res() res: Response
  ) {
    const oauth = this.oauthFactory.create(provider);
    const url = oauth.getAuthUrl(userId);
    return res.redirect(url);
  }

  @Get(':provider/callback')
  async callback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Query('state') userId: string,
    @Res() res: Response
  ) {
    const oauth = this.oauthFactory.create(provider);
    const tokens = await oauth.exchangeCode(code);
    const profile = await oauth.getUserProfile(tokens);

    await this.authRepo.saveOrUpdate({
      userId: Number(userId),
      service: provider,
      provider_user_id: profile.id ?? '',
      access_token: tokens.access_token ?? '',
      refresh_token: tokens.refresh_token ?? null,
      metadata: profile,
    });
    return res.redirect(`http://localhost:8081/services?connected=${provider}`);
  }
}

import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import {
  OauthFactoryService,
  OAuthProvider,
  OAuthTokens,
  OAuthProfile,
} from './oauth.factory';
import { ServiceAuthRepository } from './service-auth.repository';
import type { Response } from 'express';

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
    @Res() res: Response,
  ) {
    const oauth: OAuthProvider = this.oauthFactory.create(provider);
    const url = oauth.getAuthUrl(userId);
    return res.redirect(url);
  }

  @Get(':provider/callback')
  async callback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Query('state') userId: string,
    @Res() res: Response,
  ) {
    const oauth: OAuthProvider = this.oauthFactory.create(provider);
    const tokens: OAuthTokens = await oauth.exchangeCode(code);
    const profile: OAuthProfile = await oauth.getUserProfile(tokens);

    await this.authRepo.saveOrUpdate({
      userId: Number(userId),
      service: provider,
      provider_user_id: profile.id ?? '',
      access_token: tokens.access_token ?? '',
      refresh_token: tokens.refresh_token ?? undefined,
      metadata: profile,
    });
    return res.redirect(
      `${process.env.FRONTEND_URL}/services?connected=${provider}`,
    );
  }
}

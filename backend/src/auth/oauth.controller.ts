import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { OauthFactoryService } from './oauth.factory';
import { ServiceAuthRepository } from './service-auth.repository';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('oauth')
export class OauthController {
  constructor(
    private oauthFactory: OauthFactoryService,
    private authRepo: ServiceAuthRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':provider/url')
  getAuthUrl(@Param('provider') provider: string) {
    const oauth = this.oauthFactory.create(provider);
    return { url: oauth.getAuthUrl() };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':provider/callback')
  async callback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Req() req,
    @Res() res
  ) {
    const oauth = this.oauthFactory.create(provider);
    const tokens = await oauth.exchangeCode(code);
    const profile = await oauth.getUserProfile(tokens);

    await this.authRepo.saveOrUpdate({
      userId: req.user.id,
      service: provider,
      provider_user_id: profile.id,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expiry_date
        ? new Date(tokens.expiry_date)
        : null,
      metadata: profile,
    });

    return res.redirect('/dashboard?connected=' + provider);
  }
}

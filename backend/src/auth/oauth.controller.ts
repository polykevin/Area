import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { OauthFactoryService } from './oauth.factory';
import { ServiceAuthRepository } from './service-auth.repository';

@Controller('oauth')
export class OauthController {
  constructor(
    private oauthFactory: OauthFactoryService,
    private authRepo: ServiceAuthRepository,
  ) {}

  @Get(':provider/url')
  getAuthUrl(@Param('provider') provider: string, @Res() res) {
    const oauth = this.oauthFactory.create(provider);
    return res.json({ url: oauth.getAuthUrl() });
  }

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
      expires_at: tokens.expiry_date,
      metadata: profile,
    });

    return res.redirect('/dashboard?connected=' + provider);
  }
}

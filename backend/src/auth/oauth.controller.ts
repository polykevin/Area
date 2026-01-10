import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { OauthFactoryService } from './oauth.factory';
import { ServiceAuthRepository } from './service-auth.repository';
import type { Request, Response } from 'express';
import { BadRequestException } from '@nestjs/common';


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

    const uid = Number(userId);
    if (!Number.isFinite(uid)) {
      throw new BadRequestException('Missing/invalid userId. Call /oauth/:provider/url?userId=<id>');
    }

    const oauth = this.oauthFactory.create(provider);
    const url = oauth.getAuthUrl(String(uid));
    return res.redirect(url);
  }


  @Get(':provider/callback')
  async callback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Query('state') userId: string,
    @Res() res: Response
  ) {
    const uid = Number(userId);
    if (!Number.isFinite(uid)) {
      throw new BadRequestException('Missing/invalid state (userId).');
    }

    const oauth = this.oauthFactory.create(provider);
    const tokens = await oauth.exchangeCode(code);
    const profile = await oauth.getUserProfile(tokens);

    await this.authRepo.saveOrUpdate({
      userId: uid,
      service: provider,
      provider_user_id: profile.id ?? '',
      access_token: tokens.access_token ?? '',
      refresh_token: tokens.refresh_token ?? undefined,
      metadata: profile,
    });

    return res.redirect(`${process.env.FRONTEND_URL}/services?connected=${provider}`);
  }

  @Get(':provider/service-callback')
  async serviceCallback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response
  ) {

    let uid: number;
    let locationData: { latitude?: string; longitude?: string } = {};

    // For weather service, state may be base64 encoded with coordinates
    if (provider === 'weather' && state) {
      try {
        const decoded = JSON.parse(Buffer.from(state, 'base64').toString('utf-8'));
        uid = Number(decoded.userId);
        if (decoded.latitude) locationData.latitude = decoded.latitude;
        if (decoded.longitude) locationData.longitude = decoded.longitude;
      } catch {
        uid = Number(state);
      }
    } else {
      uid = Number(state);
    }

    if (!Number.isFinite(uid)) {
      throw new BadRequestException('Missing/invalid state (userId).');
    }

    const oauth = this.oauthFactory.create(provider);

    try {
      const tokens = await oauth.exchangeCode(code);

      const profile = await oauth.getUserProfile(tokens);

      const metadata = { ...profile, ...locationData };
      if (locationData.latitude) metadata.latitude = parseFloat(locationData.latitude as string);
      if (locationData.longitude) metadata.longitude = parseFloat(locationData.longitude as string);

      await this.authRepo.saveOrUpdate({
        userId: uid,
        service: provider,
        provider_user_id: profile.id ?? '',
        access_token: tokens.access_token ?? '',
        refresh_token: tokens.refresh_token ?? undefined,
        metadata: metadata,
      });

      return res.redirect(`${process.env.FRONTEND_URL}/services?connected=${provider}`);
    } catch (err) {
      throw err;
    }
  }
}

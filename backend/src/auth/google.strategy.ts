import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from '@nestjs/common';
import { Strategy, Profile } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): {
    email: string;
    provider: string;
    providerId: string;
    accessToken: string;
    refreshToken: string | null;
  } {
    const email = profile.emails?.[0]?.value ?? '';
    return {
      email,
      provider: 'google',
      providerId: profile.id,
      accessToken,
      refreshToken,
    };
  }
}

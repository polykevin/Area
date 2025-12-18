import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from '@nestjs/common';
import { Strategy, Profile, StrategyOptions } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/gmail.readonly',
      ],
      accessType: 'offline',
      prompt: 'consent',
    } as StrategyOptions);
  }

  authorizationParams(): { [key: string]: string } {
    return {
      prompt: 'select_account',
    };
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const email = profile.emails?.[0]?.value ?? '';
    return {
      email,
      provider: 'google' as const,
      providerId: profile.id,
      accessToken,
      refreshToken: refreshToken ?? null,
    };
  }
}
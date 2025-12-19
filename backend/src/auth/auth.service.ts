import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { ServiceAuthRepository } from './service-auth.repository';

interface OAuthProfile {
  email: string;
  provider: string;
  providerId: string;
  accessToken: string;
  refreshToken: string | null;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private serviceAuthRepo: ServiceAuthRepository,
  ) {}

  async register(email: string, password: string) {
    const exists = await this.prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      throw new ConflictException('Email already taken');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        provider: 'local',
      },
    });

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
  private signToken(user: { id: number; email: string }) {
    return this.jwtService.sign({ sub: user.id, email: user.email });
  }
  async oauthLogin(profile: OAuthProfile) {
    const { email, provider, providerId, accessToken, refreshToken } = profile;

    let user = await this.prisma.user.findFirst({
      where: {
        provider: profile.provider,
        providerId: profile.providerId,
      },
    });

    if (!user) {
      user = await this.prisma.user.upsert({
        where: { email: profile.email },
        update: {
          provider: profile.provider,
          providerId: profile.providerId,
        },
        create: {
          email: profile.email,
          provider: profile.provider,
          providerId: profile.providerId,
        },
      });
    }

    return this.signToken({ id: user.id, email: user.email });
    // let user = await this.prisma.user.findUnique({
    //   where: { email },
    // });

    // if (!user) {
    //   user = await this.prisma.user.create({
    //     data: {
    //       email,
    //       provider,
    //       providerId,
    //       oauthCredentials: {
    //         create: {
    //           provider,
    //           accessToken,
    //           refreshToken,
    //         },
    //       },
    //     },
    //   });
    // }

    // const payload = { sub: user.id, email: user.email };
    // const access_token = await this.jwtService.signAsync(payload);

    // return {
    //   message: 'OAuth login successful',
    //   access_token,
    //   user: {
    //     id: user.id,
    //     email: user.email,
    //     createdAt: user.createdAt,
    //   },
    // };
  }

  private googleClient = new OAuth2Client(
    '1008857371236-3d09ddvj4l7p3deubnufbih0susfpt5a.apps.googleusercontent.com'
  );

  async oauthLoginWithIdToken(idToken: string) {
    try {
      console.log(
        'Mobile Google login – idToken first 40 chars:',
        idToken.slice(0, 40),
      );

      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience:
          '1008857371236-3d09ddvj4l7p3deubnufbih0susfpt5a.apps.googleusercontent.com',
      });

      const payload = ticket.getPayload();
      console.log('Google payload:', payload);

      if (!payload || !payload.email || !payload.sub) {
        throw new UnauthorizedException('Invalid Google token (payload missing)');
      }

      const email = payload.email;
      const provider = 'google';
      const providerId = payload.sub;

      let user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email,
            provider,
            providerId,
            oauthCredentials: {
              create: {
                provider,
                accessToken: '',
                refreshToken: '',
              },
            },
          },
        });
      }

      const tokenPayload = { sub: user.id, email: user.email };
      const accessToken = await this.jwtService.signAsync(tokenPayload);

      return {
        message: 'Google mobile login successful',
        access_token: accessToken,
      };
    } catch (err) {
      console.error('Google mobile login failed:', err);
      throw new UnauthorizedException('Invalid or expired Google token');
    }
  }


  async getConnectedServices(userId: number) {
    const records = await this.serviceAuthRepo.findAllByUser(userId);
    return records.map(r => r.service);
  }

  health() {
    return { status: 'ok', scope: 'auth' };
  }
}
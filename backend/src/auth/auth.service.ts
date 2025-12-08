import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';

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
  async oauthLogin(profile: OAuthProfile) {
    const { email, provider, providerId, accessToken, refreshToken } = profile;

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
              accessToken,
              refreshToken,
            },
          },
        },
      });
    }

    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      message: 'OAuth login successful',
      access_token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }

  private googleClient = new OAuth2Client(
    '1008857371236-3d09ddvj4l7p3deubnufbih0susfpt5a.apps.googleusercontent.com'
  );

  async oauthLoginWithIdToken(idToken: string) {
    const ticket = await this.googleClient.verifyIdToken({
      idToken,
      audience: '1008857371236-3d09ddvj4l7p3deubnufbih0susfpt5a.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || !payload.sub) {
      throw new UnauthorizedException('Invalid Google token');
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

    return {
      message: "Google mobile login successful",
      access_token: await this.jwtService.signAsync(tokenPayload),
    };
  }
  health() {
    return { status: 'ok', scope: 'auth' };
  }
}
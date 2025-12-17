import {
  Res,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Request } from 'express';
import { GoogleIdTokenDto } from './dto/google-id-token.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface RequestUser {
  id: number;
  email: string;
  provider?: string;
  providerId?: string;
  accessToken?: string;
  refreshToken?: string | null;
  services?: string[];
}

interface OAuthProfile {
  email: string;
  provider: string;
  providerId: string;
  accessToken: string;
  refreshToken: string | null;
}

interface AuthenticatedRequest extends Request {
  user?: RequestUser;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly prisma: PrismaService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      scope: 'auth',
    };
  }

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req: AuthenticatedRequest) {
    if (!req.user) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        serviceAuth: {
          select: {
            id: true,
            service: true,
            accessToken: true,
            refreshToken: true,
          },
        },
      },
    });

    return user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(): void {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: { user: OAuthProfile },
    @Res() res: Response,
  ) {
    if (!req.user) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/callback?error=oauth_failed`,
      );
    }

    const jwt = await this.authService.oauthLogin(req.user);

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/google/callback?access_token=${jwt}`,
    );
  }

  @Post('google/mobile')
  async googleMobile(@Body() dto: GoogleIdTokenDto) {
    return this.authService.oauthLoginWithIdToken(dto.idToken);
  }
}
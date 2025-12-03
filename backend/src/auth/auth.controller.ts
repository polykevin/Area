import { Body, Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';

interface RequestUser {
  email: string;
  provider?: string;
  providerId?: string;
  accessToken?: string;
  refreshToken?: string | null;
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
  constructor(private authService: AuthService) {}

  @Get('health')
  getHealth() {
    return {
      status: "ok",
      scope: "auth",
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
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth(): void {
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleAuthRedirect(@Req() req: { user: OAuthProfile }) {
    if (!req.user)
        return { error: 'User not found in OAuth process' };
    return this.authService.oauthLogin(req.user);
  }
}

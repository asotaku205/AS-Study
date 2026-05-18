import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '../decorators/public';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @Post('login')
  @Public()
  @UseGuards(LocalAuthGuard)
  async handleLogin(@Request() req, @Res({ passthrough: true }) res) {
    const tokens = await this.authService.login(req.user);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { access_token: tokens.access_token};
  }


  @Post('refresh')
  @Public()
  async refreshToken(@Request() req, @Res({ passthrough: true }) res) {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new BadRequestException('Refresh token không được cung cấp');
    }
    const tokens = await this.authService.refreshToken(refreshToken);
    res.cookie('refresh_token', tokens.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { access_token: tokens.access_token };
  }


  @Post('logout')
  async handleLogout(@Request() req, @Res({ passthrough: true }) res) {
    await this.authService.logout(req.user.userId);
    res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
    return { message: 'Đăng xuất thành công' };
  }


  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

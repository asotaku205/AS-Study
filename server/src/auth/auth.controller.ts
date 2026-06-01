import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { Public } from '../decorators/public';
import { UsersService } from '../users/users.service';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { GoogleAuthGuard } from './passport/google-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}


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
  @Get('google')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async handleGoogleLogin(@Request() req) {
    // Passport sẽ tự động chuyển hướng người dùng đến trang đăng nhập của Google
    return { message: 'Đang chuyển hướng đến Google để đăng nhập...' };    
  }
  @Get('google/callback')
  @Public()
  @UseGuards(GoogleAuthGuard)
  async handleGoogleLoginCallback(@Request() req, @Res({ passthrough: true }) res) {
    const state = req.query.state as string | undefined;
    const result = await this.authService.loginWithGoogle(req.user, state);
    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    const redirectUrl = `${process.env.FRONTEND_URL}/oauth/google/callback?access_token=${result.access_token}${result.isNewUser ? '&isNewUser=true' : ''}`;
    return res.redirect(redirectUrl);
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
  async getProfile(@Request() req): Promise<UserResponseDto> {
    return this.usersService.findOneByIdResponse(req.user.userId);
  }
  @Post('change-password')
  async changePassword(@Request() req, @Body() body: { currentPassword?: string; newPassword: string }) {
    await this.authService.changePassword(req.user.userId, body.currentPassword, body.newPassword);
    return { message: 'Đổi mật khẩu thành công' };
  }

  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() body: { username: string }) {
    await this.authService.forgotPassword(body.username);
    return { message: 'Nếu tài khoản có email đã xác thực, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu' };
  }
  @Post('reset-password')
  @Public()
  async resetPassword(@Body() body: { token: string; newPassword: string }) {
    await this.authService.resetPassword(body.token, body.newPassword);
    return { message: 'Đặt lại mật khẩu thành công' };
  }
}

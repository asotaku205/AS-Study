import {
    BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
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
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }
  @Post('refresh')
  @Public()
  refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    if(!refreshToken) {
      throw new BadRequestException("Refresh token không được cung cấp");
    }
    return this.authService.refreshToken( refreshToken);
  }
  @Post('logout')
  handleLogout(@Request() req) {
    return this.authService.logout(req.user.userId);
  }
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}

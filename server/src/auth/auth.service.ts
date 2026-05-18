import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from '../users/entity/user.entity';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  // Xác thực người dùng
  async validateUser(signInDto: SignInDto): Promise<any> {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }
    const passwordMatch = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (user && passwordMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  // Tạo access token và refresh token
  async getTokens(
    userId: number,
    email: string,
    role: UserRole
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { email: email, sub: userId, role: role };
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
      }),
    };
  }
  // Đăng nhập và trả về token
  async login(user: any) {
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }
  // kiểm tra refresh token và tạo mới access token
  async refreshToken(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
    });

    const user = await this.usersService.findOneById(payload.sub);
    if (!user || !user.refreshTokenHashed) {
      throw new UnauthorizedException(
        'Người dùng không tồn tại hoặc chưa đăng nhập',
      );
    }
    const refreshTokenMatch = await this.usersService.hashRefreshToken(refreshToken);
    if ( refreshTokenMatch !== user.refreshTokenHashed) {
      throw new UnauthorizedException('Refresh token không hợp lệ');
    }
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }
  // Đăng xuất và xóa refresh token
  async logout(userId: number) {
    await this.usersService.clearRefreshToken(userId);
    return { message: 'Đăng xuất thành công' };
  }
}

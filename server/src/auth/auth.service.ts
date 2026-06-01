import { BadRequestException, ConflictException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Provider, UserRole } from '../users/entity/user.entity';
import { UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'crypto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly mailService: MailService,
  ) {}
  // Xác thực người dùng
  async validateUser(signInDto: SignInDto): Promise<any> {
    const user = await this.usersService.findOneByUsername(signInDto.username);
    if (!user) {
      throw new UnauthorizedException('Username hoặc mật khẩu không đúng');
    }
    if (user.isBanned) {
      throw new ForbiddenException('Tài khoản đã bị khóa');
    }
    if (!user.password) {
      throw new UnauthorizedException('Username hoặc mật khẩu không đúng');
    }
    const passwordMatch = await bcrypt.compare(
      signInDto.password,
      user.password,
    );
    if (!passwordMatch) {
      throw new UnauthorizedException('Username hoặc mật khẩu không đúng');
    }
    const { password, ...result } = user;
    return result;
  }
  // Tạo access token và refresh token
  async getTokens(
    userId: number,
    email: string | null,
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
     if (user.isBanned) {
    throw new ForbiddenException(
      'Tài khoản đã bị khóa',
    ) };
    const tokens = await this.getTokens(user.id, user.email, user.role);
    await this.usersService.updateRefreshToken(user.id, tokens.refresh_token);
    return tokens;
  }
  async loginWithGoogle(user: any, tokenToLink?: string) {
    const providerId = user.providerId || user.id;
    let existingUser = await this.usersService.findOneByProviderId(providerId);
    let isNewUser = false;

    if (tokenToLink) {
      try {
        const payload = this.jwtService.verify(tokenToLink, {
          secret: this.configService.get('JWT_ACCESS_SECRET'),
        });
        const userId = payload.sub;
        if (userId) {
          existingUser = await this.usersService.linkGoogleProvider(
            userId,
            providerId,
            user.email,
          );
        }
      } catch (e) {
        console.error('Failed to link Google account via token:', e);
      }
    }

    if (!existingUser) {
      existingUser = await this.usersService.findOneByEmailOrNull(user.email);

      if (!existingUser) {
        existingUser = await this.usersService.createUserWithGoogle({
          email: user.email,
          name: user.name || user.email,
          providerId: providerId,
        });
        isNewUser = true;
      } else {
        existingUser = await this.usersService.linkGoogleProvider(
          existingUser.id,
          providerId,
          user.email,
        );
      }
    } else {
      if (user.email && existingUser.email !== user.email) {
        existingUser = await this.usersService.linkGoogleProvider(
          existingUser.id,
          providerId,
          user.email,
        );
      }
    }

    if (existingUser.isBanned) {
      throw new ForbiddenException('Tài khoản đã bị khóa');
    }

    const tokens = await this.getTokens(
      existingUser.id,
      existingUser.email,
      existingUser.role,
    );
    await this.usersService.updateRefreshToken(
      existingUser.id,
      tokens.refresh_token,
    );
    return { ...tokens, isNewUser };
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
    if(user.isBanned) {
      throw new ForbiddenException('Tài khoản đã bị khóa');
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
  async changePassword(userId: number, currentPassword: string | undefined, newPassword: string) {
     let user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new UnauthorizedException('Người dùng không tồn tại');
    }
    if (user.password) {
      if (!currentPassword) {
        throw new BadRequestException('Mật khẩu hiện tại là bắt buộc');
      }
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!passwordMatch) {
        throw new BadRequestException('Mật khẩu hiện tại không đúng');
      }
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePassword(userId, hashedNewPassword);
  }

  async forgotPassword(username: string) {
    const user = await this.usersService.findOneByUsernameOrNull(username);
    if (!user || !user.email) {
      return;
    }
    const token = this.generateToken();
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await this.usersService.setResetToken(user.id, tokenHash, expiresAt);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await this.mailService.sendResetPasswordEmail(user.email, resetLink);
  }
  async resetPassword(token: string, newPassword: string) {
    const tokenHash = this.hashToken(token);
    const user = await this.usersService.findByResetTokenHash(tokenHash);
    if (!user || !user.resetTokenExpiresAt) {
      throw new BadRequestException('Token không hợp lệ');
    }
    if (user.resetTokenExpiresAt.getTime() < Date.now()) {
      throw new BadRequestException('Token đã hết hạn');
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.updatePasswordAndClearResetToken(
      user.id,
      hashedNewPassword,
    );
  }
  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}

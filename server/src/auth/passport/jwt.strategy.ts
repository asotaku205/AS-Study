
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService, private usersService:UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: any) {
    const user = await this.usersService.findOneById(
      payload.sub,
    );

    if (!user) {
      throw new UnauthorizedException(
        'Không tìm thấy người dùng hoặc người dùng chưa đăng nhập',
      );
    }

    if (user.isBanned) {
      throw new ForbiddenException(
        'Tài khoản đã bị khóa',
      );
    }
    return { userId: user.id, email: user.email, role: user.role };
  }
}

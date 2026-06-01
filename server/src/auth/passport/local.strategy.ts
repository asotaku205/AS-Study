
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SignInDto } from '../dto/sign-in.dto';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    const signInDto = new SignInDto();
    signInDto.username = username;
    signInDto.password = password;
    const user = await this.authService.validateUser(signInDto);
    
    if (!user) {
      throw new UnauthorizedException("Username hoặc mật khẩu không đúng");
    }
    return user;
  }
}

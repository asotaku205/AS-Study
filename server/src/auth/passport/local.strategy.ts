
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SignInDto } from '../dto/sign-in.dto';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const signInDto = new SignInDto();
    signInDto.email = email;
    signInDto.password = password;
    const user = await this.authService.validateUser(signInDto);
    
    if (!user) {
      throw new UnauthorizedException("Email hoặc mật khẩu không đúng");
    }
    return user;
  }
}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../users/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './passport/local.strategy';
import { JwtStrategy } from './passport/jwt.strategy';
import { GoogleStrategy } from './passport/google.strategy';
import { MailModule } from '../mail/mail.module';



@Module({
  imports: [TypeOrmModule.forFeature([User]),
  PassportModule,
  JwtModule.registerAsync({
    useFactory: async(configService: ConfigService) => ({
    secret: configService.get('JWT_ACCESS_SECRET'),
    signOptions: { expiresIn: configService.get('JWT_ACCESS_EXPIRES_IN') },
    }),
    inject: [ConfigService],
  }),
  UserModule,
  MailModule
],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy,JwtStrategy, GoogleStrategy ],
  
  exports: [AuthService],
})
export class AuthModule {}

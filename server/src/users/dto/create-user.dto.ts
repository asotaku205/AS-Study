import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
export class CreateUserDto {
    @IsString()
    name: string;
    @IsString()
    username: string;
    @IsEmail()
    @IsOptional()
    email?: string;
    @IsString()
    @MinLength(6,{ message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;
}
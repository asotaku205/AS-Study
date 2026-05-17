import { IsEmail, IsEnum, IsOptional, IsString, Min, MinLength } from 'class-validator';
export class CreateUserDto {
    @IsString()
    name: string;
    @IsEmail()
    email: string;
    @IsString()
    @MinLength(6,{ message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    password: string;
    @IsEnum(['user', 'admin'], { message: 'Role phải là user hoặc admin' })
    @IsOptional()
    role?: string;
}
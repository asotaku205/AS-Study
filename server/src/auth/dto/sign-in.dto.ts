import { IsEmail, IsNotEmpty, IsString, Min, MinLength } from "class-validator";

export class SignInDto {
    @IsEmail()
    @IsNotEmpty({ message: "Email không được để trống" })
    email: string;
    @IsString()
    @IsNotEmpty({ message: "Mật khẩu không được để trống" })
    password: string;
}
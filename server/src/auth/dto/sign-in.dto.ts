import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {
    @IsString()
    @IsNotEmpty({ message: "Username không được để trống" })
    username: string;
    @IsString()
    @IsNotEmpty({ message: "Mật khẩu không được để trống" })
    password: string;
    
}
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional } from 'class-validator';
export class UpdateUserDto {
    @IsOptional()
    name?: string;
    @IsOptional()
    username?: string;
    @IsOptional()
    email?: string;
    @IsOptional()
    password?: string;
    

}
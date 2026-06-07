import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  siteName?: string;

  @IsOptional()
  @IsEmail()
  adminEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDesc?: string;

  @IsOptional()
  @IsBoolean()
  allowRegister?: boolean;

  @IsOptional()
  @IsBoolean()
  maintenanceMode?: boolean;

  @IsOptional()
  @IsBoolean()
  autoPublish?: boolean;

  @IsOptional()
  @IsBoolean()
  emailNotify?: boolean;

  @IsOptional()
  @IsBoolean()
  twoFactor?: boolean;
}

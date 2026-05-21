import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

import { DocumentVisibility } from '../entities/document.entity';
import { Type } from 'class-transformer';

export class UploadDocumentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;
  @Type(() => Number)
  @IsNumber()
  ownerUserId: number;
  @Type(() => Number)
  @IsNumber()
  categoryId: number;

  @IsOptional()
  @IsEnum(DocumentVisibility)
  visibility?: DocumentVisibility;
}

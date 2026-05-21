import { IsEnum } from 'class-validator';
import { DocumentVisibility } from '../entities/document.entity';

export class ChangeVisibilityDto {
  @IsEnum(DocumentVisibility)
  visibility: DocumentVisibility;
}
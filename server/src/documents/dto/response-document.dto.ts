import {
  DocumentStatus,
  DocumentVisibility,
} from '../entities/document.entity';
import { Expose } from 'class-transformer';

export class DocumentResponseDto {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  fileUrl: string;

  @Expose()
  mimeType: string;

  @Expose() 
  sizeBytes: number;

  @Expose()
  visibility: DocumentVisibility;

  @Expose()
  status: DocumentStatus;

  @Expose()
  ocrText: string | null;

  @Expose()
  createdAt: Date;
}
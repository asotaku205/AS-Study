import { DocumentStatus } from '../entities/document.entity';

export class CreateDocumentDto {
  originalName: string;

  storedName: string;

  mime: string;

  size: number;

  path: string;

  title?: string;

  description?: string;

  ownerId?: number;

  status: DocumentStatus;
}

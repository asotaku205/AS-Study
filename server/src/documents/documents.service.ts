import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { UploadDocumentDto } from './dto/upload-document.dto';
import {
  Document,
  DocumentStatus,
  DocumentVisibility,
} from './entities/document.entity';
import { DocumentResponseDto } from './dto/response-document.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'express';
import Tesseract from 'tesseract.js';
import * as pdf from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
  ) {}

  async uploadDocument(
    file: Express.Multer.File,
    dto: UploadDocumentDto,
  ): Promise<DocumentResponseDto> {
    if (!file) {
      throw new BadRequestException('Chưa có file được tải lên');
    }

    let categoryId = dto.categoryId;
    if (categoryId) {
      const categoryExists = await this.documentsRepository.manager.findOne(
        'Category',
        {
          where: { id: categoryId },
        },
      );
      if (!categoryExists) {
        const firstCategory = await this.documentsRepository.manager.findOne(
          'Category',
          {},
        );
        categoryId = firstCategory ? (firstCategory as any).id : null;
      }
    }

    const document = this.documentsRepository.create({
      title: dto.title,

      description: dto.description,

      ownerUserId: dto.ownerUserId,

      categoryId: categoryId,

      mimeType: file.mimetype,

      originalName: file.originalname,

      storedName: file.filename,

      fileUrl: file.path.replace(/\\/g, '/'),

      sizeBytes: file.size,

      visibility: dto.visibility || DocumentVisibility.Private,

      status:
        dto.visibility === DocumentVisibility.Public
          ? DocumentStatus.Pending
          : DocumentStatus.Draft,
    });

    const savedDocument = await this.documentsRepository.save(document);
    return plainToInstance(DocumentResponseDto, savedDocument, {
      excludeExtraneousValues: true,
    });
  }
  findAll() {
    return this.documentsRepository.find({ relations: ['owner'] , order: { createdAt: 'DESC' }});
  }

  async findOne(id: number): Promise<Document> {
    const docs = await this.documentsRepository.findOne({
      where: { id },
    });
    if (!docs) {
      throw new NotFoundException('Tài liệu không tồn tại');
    }
    return docs;
  }

  async deleteDocument(id: number, requestUserId?: number) {
    const document = await this.findOne(id);

    // Kiểm tra quyền sở hữu: chỉ chủ tài liệu mới được xóa
    if (requestUserId !== undefined && document.ownerUserId !== requestUserId) {
      throw new ForbiddenException('Bạn không có quyền xóa tài liệu này');
    }

    const filePath = path.join(process.cwd(), document.fileUrl);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await this.documentsRepository.delete(id);

    return {
      message: 'Xóa tài liệu thành công',
    };
  }
  async updateDocumentStatus(
    id: number,
    status: DocumentStatus,
  ): Promise<DocumentResponseDto> {
    const document = await this.findOne(id);
    document.status = status;
    const updatedDocument = await this.documentsRepository.save(document);
    return plainToInstance(DocumentResponseDto, updatedDocument, {
      excludeExtraneousValues: true,
    });
  }
  async findByUserId(userId: number): Promise<Document[]> {
    return await this.documentsRepository.find({
      where: { ownerUserId: userId },
      order: { createdAt: 'DESC' },
    });
  }
  async getPublicDocument(): Promise<Document[]> {
    const document = await this.documentsRepository.find({
      where: {
        visibility: DocumentVisibility.Public,
        status: DocumentStatus.Published,
      },
    });
    if (!document) {
      throw new NotFoundException('Tài liệu công khai không tồn tại');
    }
    return document;
  }

  async changeVisibility(
    id: number,
    newVisibility: DocumentVisibility,
  ): Promise<DocumentResponseDto> {
    const doc = await this.findOne(id);

    if (newVisibility === DocumentVisibility.Public) {
      doc.status = DocumentStatus.Pending;
    } else {
      doc.status = DocumentStatus.Draft;
    }

    doc.visibility = newVisibility;
    const saved = await this.documentsRepository.save(doc);
    return plainToInstance(DocumentResponseDto, saved, {
      excludeExtraneousValues: true,
    });
  }
  async getFeaturedDocuments(): Promise<Document[]> {
    return await this.documentsRepository.find({
      where: {
        visibility: DocumentVisibility.Public,
        status: DocumentStatus.Published,
      },
      order: { viewCount: 'DESC' },
      take: 3,
    });
  }
  async incrementViewCount(
    id: number,
    visibility: DocumentVisibility,
  ): Promise<void> {
    if (visibility === DocumentVisibility.Public) {
      await this.documentsRepository.increment({ id }, 'viewCount', 1);
    }
  }
  async downloadDocument(id: number, res: Response) {
    const document = await this.findOne(id);

    if (document.visibility === DocumentVisibility.Private) {
      throw new BadRequestException(
        'Tài liệu này là riêng tư và không thể tải xuống',
      );
    }
    const filePath = path.join(process.cwd(), document.fileUrl);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('File tài liệu không tồn tại trên server');
    }
    return res.download(filePath, document.originalName);
  }
  async runOcr(id: number): Promise<DocumentResponseDto> {
    const document = await this.findOne(id);

    const mime = document.mimeType;
    const name = document.originalName;

    const isImage =
      mime.startsWith('image/') || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(name);
    const isPdf = mime === 'application/pdf' || /\.pdf$/i.test(name);
    const isDocx =
      mime ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      /\.docx$/i.test(name);
    const isDoc = mime === 'application/msword' || /\.doc$/i.test(name);
    const isTxt =
      mime === 'text/plain' ||
      mime === 'text/markdown' ||
      mime === 'text/x-markdown' ||
      /\.(txt|md|csv)$/i.test(name);
    const isXlsx =
      mime ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      mime === 'application/vnd.ms-excel' ||
      /\.(xlsx|xls)$/i.test(name);

    const supported = isImage || isPdf || isDocx || isDoc || isTxt || isXlsx;
    if (!supported) {
      throw new BadRequestException(
        'Định dạng file không được hỗ trợ trích xuất văn bản',
      );
    }

    const filePath = path.join(process.cwd(), document.fileUrl);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Không tìm thấy tệp tài liệu trên máy chủ');
    }

    try {
      let text = '';

      if (isImage) {
        // Ảnh → luôn dùng OCR
        const result = await Tesseract.recognize(filePath, 'eng+vie');
        text = result.data.text;
      } else if (isPdf) {
        // PDF → thử đọc text layer trước
        const dataBuffer = fs.readFileSync(filePath);
        const pdfParser = typeof pdf === 'function' ? pdf : (pdf as any).default;
        const parsedData = await pdfParser(dataBuffer);
        const directText = (parsedData.text || '').trim();

        if (directText.length > 50) {
          // PDF có text layer → đọc trực tiếp
          text = directText;
        } else {
          // PDF scan → dùng OCR
          const result = await Tesseract.recognize(filePath, 'eng+vie');
          text = result.data.text;
        }
      } else if (isDocx || isDoc) {
        // DOCX/DOC → dùng mammoth
        const result = await mammoth.extractRawText({ path: filePath });
        text = result.value;
      } else if (isTxt) {
        // TXT/MD/CSV → đọc trực tiếp
        text = fs.readFileSync(filePath, 'utf-8');
      } else if (isXlsx) {
        // XLSX/XLS → dùng xlsx
        const workbook = XLSX.readFile(filePath);
        const lines: string[] = [];
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          lines.push(`=== ${sheetName} ===`);
          lines.push(XLSX.utils.sheet_to_csv(sheet));
        });
        text = lines.join('\n');
      }

      // PostgreSQL không hỗ trợ ký tự null (0x00)
      document.ocrText = (text || '').replace(/\u0000/g, '');
      const updated = await this.documentsRepository.save(document);

      return plainToInstance(DocumentResponseDto, updated, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        throw new BadRequestException({
          message: 'Không thể trích xuất văn bản',
          detail: error.message,
        });
      }

      throw new BadRequestException('Không thể trích xuất văn bản từ tệp này');
    }
  }

  async countByUserId(userId: number): Promise<number> {
    return await this.documentsRepository.count({
      where: { ownerUserId: userId },
    });
  }

  async getDocsByCategory(): Promise<{ name: string; value: number }[]> {
    const results = await this.documentsRepository
      .createQueryBuilder('doc')
      .leftJoin('doc.category', 'cat')
      .select('cat.name', 'name')
      .addSelect('COUNT(doc.id)', 'value')
      .groupBy('cat.name')
      .getRawMany();
    return results.map((r) => ({
      name: r.name || 'Chưa phân loại',
      value: parseInt(r.value),
    }));
  }
}

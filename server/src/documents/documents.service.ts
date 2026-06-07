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
import { PDFParse } from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import PptxParser from 'node-pptx-parser';
import { SettingsService } from '../settings/settings.service';
import { QuizzService } from '../quizz/quizz.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
    private readonly settingsService: SettingsService,
    private readonly quizzService: QuizzService,
  ) {}

  private async attachQuizCounts<T extends { id: number }>(
    documents: T[],
  ): Promise<(T & { quizCount: number })[]> {
    if (!documents.length) {
      return [];
    }
    const counts = await this.quizzService.getCountsByDocumentIds(
      documents.map((doc) => doc.id),
    );
    return documents.map((doc) => ({
      ...doc,
      quizCount: counts[doc.id] || 0,
    }));
  }

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

    const settings = await this.settingsService.getSettings();
    const visibility = dto.visibility || DocumentVisibility.Private;
    let status = DocumentStatus.Draft;

    if (visibility === DocumentVisibility.Public) {
      status = settings.autoPublish
        ? DocumentStatus.Published
        : DocumentStatus.Pending;
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

      visibility,

      status,
    });

    const savedDocument = await this.documentsRepository.save(document);
    return plainToInstance(DocumentResponseDto, savedDocument, {
      excludeExtraneousValues: true,
    });
  }
  async findAll() {
    const docs = await this.documentsRepository.find({
      relations: ['owner'],
      order: { createdAt: 'DESC' },
    });
    return this.attachQuizCounts(docs);
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

  async findOneDetailed(id: number) {
    const doc = await this.documentsRepository.findOne({
      where: { id },
      relations: ['owner', 'category'],
    });
    if (!doc) {
      throw new NotFoundException('Tài liệu không tồn tại');
    }
    const [withCount] = await this.attachQuizCounts([doc]);
    return withCount;
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
  async findByUserId(userId: number) {
    const docs = await this.documentsRepository.find({
      where: { ownerUserId: userId },
      order: { createdAt: 'DESC' },
    });
    return this.attachQuizCounts(docs);
  }
  async getPublicDocument() {
    const documents = await this.documentsRepository.find({
      where: {
        visibility: DocumentVisibility.Public,
        status: DocumentStatus.Published,
      },
    });
    if (!documents.length) {
      throw new NotFoundException('Tài liệu công khai không tồn tại');
    }
    return this.attachQuizCounts(documents);
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
  async getFeaturedDocuments() {
    const docs = await this.documentsRepository.find({
      where: {
        visibility: DocumentVisibility.Public,
        status: DocumentStatus.Published,
      },
      order: { viewCount: 'DESC' },
      take: 3,
    });
    return this.attachQuizCounts(docs);
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
    const isPptx =
      mime ===
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      /\.pptx$/i.test(name);
    const isPpt =
      mime === 'application/vnd.ms-powerpoint' || /\.ppt$/i.test(name);

    if (isPpt && !isPptx) {
      throw new BadRequestException(
        'Định dạng .ppt cũ chưa được hỗ trợ. Vui lòng lưu file dưới dạng .pptx (PowerPoint 2007 trở lên).',
      );
    }

    const supported =
      isImage || isPdf || isDocx || isDoc || isTxt || isXlsx || isPptx;
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
        const parser = new PDFParse({ data: dataBuffer });
        const parsedData = await parser.getText();
        const directText = (parsedData.text || '').trim();

        if (directText.length > 50) {
          // PDF có text layer → đọc trực tiếp
          text = directText;
          await parser.destroy();
        } else {
          // PDF scan → dùng OCR cho từng trang thông qua screenshot
          const MAX_OCR_PAGES = 20; // Giới hạn tối đa 20 trang để tránh timeout và OOM
          const totalPages = Math.min(parsedData.total || 0, MAX_OCR_PAGES);
          const ocrPages: string[] = [];
          
          // Khởi tạo worker Tesseract dùng chung để tăng tốc hiệu năng
          let worker: Tesseract.Worker | null = null;
          try {
            worker = await Tesseract.createWorker('eng+vie');
          } catch (workerInitErr) {
            console.error('Không thể khởi tạo Tesseract worker dùng chung:', workerInitErr);
          }
          
          // 1. Render ảnh của tất cả các trang song song để tiết kiệm thời gian render CPU
          const renderPromises: Promise<any>[] = [];
          for (let i = 1; i <= totalPages; i++) {
            renderPromises.push(
              parser.getScreenshot({
                partial: [i],
                imageBuffer: true,
                imageDataUrl: false,
              })
              .then(res => ({ pageNum: i, res }))
              .catch(err => {
                console.error(`Lỗi render trang ${i}:`, err);
                return { pageNum: i, res: null };
              })
            );
          }
          
          const renderResults = await Promise.all(renderPromises);
          
          // 2. Chạy OCR tuần tự trên Tesseract worker đã khởi tạo
          for (const renderResult of renderResults) {
            if (renderResult.res && renderResult.res.pages && renderResult.res.pages.length > 0) {
              const pageData = renderResult.res.pages[0];
              const buffer = Buffer.from(pageData.data);
              
              try {
                let pageText = '';
                if (worker) {
                  const result = await worker.recognize(buffer);
                  pageText = result.data.text;
                } else {
                  const result = await Tesseract.recognize(buffer, 'eng+vie');
                  pageText = result.data.text;
                }
                ocrPages.push(pageText);
              } catch (pageOcrError) {
                console.error(`Lỗi OCR trang ${renderResult.pageNum}:`, pageOcrError);
              }
            }
          }
          
          if (worker) {
            await worker.terminate();
          }
          
          text = ocrPages.join('\n');
          await parser.destroy();
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
      } else if (isPptx) {
        // PPTX → trích xuất text từng slide
        const parser = new PptxParser(filePath);
        const slides = await parser.extractText();
        const lines: string[] = [];
        slides.forEach((slide, index) => {
          lines.push(`=== Slide ${index + 1} ===`);
          lines.push(slide.text.join('\n'));
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

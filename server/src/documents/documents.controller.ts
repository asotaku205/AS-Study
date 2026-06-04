import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseIntPipe,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import { diskStorage } from 'multer';   
import { extname } from 'path';
import type { Response } from 'express';
import * as crypto from 'crypto';
import { DocumentStatus } from './entities/document.entity';
import { ChangeVisibilityDto } from './dto/change-visibility.dto';
import * as fs from 'fs';

import { ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES } from './constants/file-types';
import { LocalAuthGuard } from '../auth/passport/local-auth.guard';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { Public } from '../decorators/public';
const ensureDirExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, callback) => {
          let folder = './uploads/others';

          if (file.mimetype.startsWith('image/')) {
            folder = './uploads/images';
          } else if (file.mimetype.startsWith('video/')) {
            folder = './uploads/videos';
          } else if (file.mimetype.startsWith('audio/')) {
            folder = './uploads/audios';
          } else {
            folder = './uploads/documents';
          }

          ensureDirExists(folder);

          callback(null, folder);
        },

        filename: (req, file, callback) => {
          const uniqueName = crypto.randomUUID() + extname(file.originalname);
          callback(null, uniqueName);
        },
      }),
      limits: {
        fileSize: 100 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        const extension = extname(file.originalname).toLowerCase();

        const isValidMime = ALLOWED_MIME_TYPES.includes(file.mimetype);

        const isValidExtension = ALLOWED_EXTENSIONS.includes(extension);

        if (!isValidMime || !isValidExtension) {
          return callback(
            new BadRequestException('File không được hỗ trợ'),
            false,
          );
        }

        callback(null, true);
      },
    }),
  )
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    dto: UploadDocumentDto,
  ) {
    return this.documentsService.uploadDocument(file, dto);
  }
  @Get('my-documents')
  @UseGuards(JwtAuthGuard)
  async findMyDocuments(@Request() req) {
    const userId = req.user.userId;
    return await this.documentsService.findByUserId(userId);
  }

  @Get()
  @Public()
  findAll() {
    return this.documentsService.findAll();
  }
  @Get('public')
  @Public()
  async findPublicDocument() {
    const document = await this.documentsService.getPublicDocument();
    return document;
  }
  @Get('featured')
  @Public()
  async findFeaturedDocuments() {
    return await this.documentsService.getFeaturedDocuments();
  }

  @Get('count/mine')
  @UseGuards(JwtAuthGuard)
  async countMine(@Request() req) {
    const count = await this.documentsService.countByUserId(req.user.userId);
    return { count };
  }

  @Get('stats/by-category')
  async getDocsByCategory() {
    return await this.documentsService.getDocsByCategory();
  }


  @Patch(':id/visibility')
  async changeVisibility(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeVisibilityDto,
  ) {
    return this.documentsService.changeVisibility(id, dto.visibility);
  }
  @Get(':id/download')
  async downloadDocument(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    return await this.documentsService.downloadDocument(id, res);
  }
  @Patch(':id')
  async incrementViewCount(@Param('id', ParseIntPipe) id: number) {
    const document = await this.documentsService.findOne(id);
    await this.documentsService.incrementViewCount(id, document.visibility);
  }
  @Get(':id')
  @Public()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.documentsService.findOne(id);
  }
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    return await this.documentsService.deleteDocument(+id, req.user?.userId);
  }
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: DocumentStatus,
  ) {
    return await this.documentsService.updateDocumentStatus(id, status);
  }

  @Post(':id/ocr')
  async runOcr(@Param('id', ParseIntPipe) id: number) {
    return await this.documentsService.runOcr(id);
  }
}

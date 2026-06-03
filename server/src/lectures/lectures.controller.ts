import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';

@Controller('lectures')
export class LecturesController {
  constructor(private readonly lecturesService: LecturesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('save-lecture')
  async saveLecture(@Req() req, @Body() body: { title: string; content: string }) {
    return await this.lecturesService.saveLecture(req.user.userId, body.title, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-lectures')
  async getMyLectures(@Req() req) {
    return await this.lecturesService.getMyLectures(req.user.userId);
  }
}

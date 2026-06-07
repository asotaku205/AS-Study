import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Req,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { QuizzService } from './quizz.service';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';
import { RolesGuard } from '../auth/passport/roles.guard';
import { Roles } from '../decorators/roles';
import { UserRole } from '../users/entity/user.entity';

@Controller('quizz')
export class QuizzController {
  constructor(private readonly quizzService: QuizzService) {}

  @UseGuards(JwtAuthGuard)
  @Post('save-result')
  async saveResult(
    @Req() req,
    @Body()
    body: {
      topic: string;
      difficulty: string;
      questionCount: number;
      score: number | null;
      questions?: any;
      documentId?: number;
    },
  ) {
    return await this.quizzService.saveResult(
      req.user.userId,
      body.topic,
      body.difficulty,
      body.questionCount,
      body.score,
      body.questions,
      body.documentId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/score')
  async updateScore(
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { score: number; questions?: any },
  ) {
    return await this.quizzService.updateScore(
      id,
      req.user.userId,
      body.score,
      body.questions,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-quizzes')
  async getMyQuizzes(@Req() req) {
    return await this.quizzService.getMyQuizzes(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-stats')
  async getMyStats(@Req() req) {
    return await this.quizzService.getMyStats(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-recent')
  async getMyRecentActivity(@Req() req) {
    return await this.quizzService.getMyRecentActivity(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Get('admin-stats')
  async getAdminStats() {
    return await this.quizzService.getAdminStats();
  }
}

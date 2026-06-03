import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
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
  async saveResult(@Req() req, @Body() body: { topic: string; difficulty: string; questionCount: number; score: number | null }) {
    return await this.quizzService.saveResult(req.user.id, body.topic, body.difficulty, body.questionCount, body.score);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-stats')
  async getMyStats(@Req() req) {
    return await this.quizzService.getMyStats(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-recent')
  async getMyRecentActivity(@Req() req) {
    return await this.quizzService.getMyRecentActivity(req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.Admin)
  @Get('admin-stats')
  async getAdminStats() {
    return await this.quizzService.getAdminStats();
  }
  
}

import { Controller, Post, Get, Delete, Body, Res, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/passport/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('sessions')
  async getSessions(@Req() req) {
    return await this.chatService.getSessions(req.user.userId);
  }

  @Get('sessions/:id/messages')
  async getSessionMessages(@Req() req, @Param('id') id: string) {
    return await this.chatService.getSessionMessages(req.user.userId, parseInt(id));
  }

  @Post('sessions')
  async createSession(@Req() req, @Body('title') title?: string) {
    return await this.chatService.createSession(req.user.userId, title);
  }

  @Delete('sessions/:id')
  async deleteSession(@Req() req, @Param('id') id: string) {
    return await this.chatService.deleteSession(req.user.userId, parseInt(id));
  }

  @Post()
  async generateResponse(
    @Req() req,
    @Body('message') message: string,
    @Body('sessionId') sessionId?: number,
    @Body('documentId') documentId?: number,
    @Body('documentIds') documentIds?: number[],
    @Body('history') history?: { role: 'user' | 'ai'; content: string }[],
  ) {
    const { reply, sessionId: returnedSessionId } = await this.chatService.generateResponse(
      req.user.userId,
      message,
      sessionId,
      documentId,
      documentIds,
      history,
    );
    return { reply, sessionId: returnedSessionId };
  }

  @Post('stream')
  async streamResponse(
    @Req() req,
    @Res() res: Response,
    @Body('message') message: string,
    @Body('sessionId') sessionId?: number,
    @Body('documentId') documentId?: number,
    @Body('documentIds') documentIds?: number[],
    @Body('history') history?: { role: 'user' | 'ai'; content: string }[],
  ) {
    await this.chatService.streamResponse(
      req.user.userId,
      message,
      sessionId,
      documentId,
      documentIds,
      history,
      res,
    );
  }

  @Post('generate-quiz')
  async generateQuiz(
    @Body('text') text: string,
    @Body('difficulty') difficulty: string,
    @Body('questionCount') questionCount: number,
  ) {
    return await this.chatService.generateQuiz(text, difficulty, questionCount);
  }

  @Post('generate-lecture')
  async generateLecture(
    @Body('text') text: string,
    @Body('studyMode') studyMode: string,
  ) {
    return await this.chatService.generateLecture(text, studyMode);
  }
}

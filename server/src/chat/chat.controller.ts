import { Controller, Post, Body, Res } from '@nestjs/common';
import { ChatService } from './chat.service';
import type { Response } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async generateResponse(
    @Body('message') message: string,
    @Body('documentId') documentId?: number,
    @Body('history') history?: { role: 'user' | 'ai'; content: string }[],
  ) {
    const reply = await this.chatService.generateResponse(message, documentId, history);
    return { reply };
  }

  @Post('stream')
  async streamResponse(
    @Res() res: Response,
    @Body('message') message: string,
    @Body('documentId') documentId?: number,
    @Body('history') history?: { role: 'user' | 'ai'; content: string }[],
  ) {
    await this.chatService.streamResponse(message, documentId, history, res);
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

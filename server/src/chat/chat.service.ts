import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Document } from '../documents/entities/document.entity';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Response } from 'express';

export interface ChatHistoryItem {
  role: 'user' | 'model';
  parts: { text: string }[];
}

@Injectable()
export class ChatService {
  private ai: GoogleGenerativeAI | null = null;

  // Thứ tự ưu tiên model — thử lần lượt nếu bị rate-limit
  // (gemini-1.5-flash bị 404 với project này, chỉ dùng gemini-2.0)
  private readonly MODEL_PRIORITY = [
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
  ];

  constructor(
    @InjectRepository(Document)
    private readonly documentsRepository: Repository<Document>,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.ai = new GoogleGenerativeAI(apiKey);
    } else {
      console.warn('GEMINI_API_KEY is not set. AI Chat will run in mock mode.');
    }
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────
  private async prepareContext(documentId?: number, documentIds?: number[]): Promise<string> {
    const ids: number[] = [];
    if (documentId) ids.push(documentId);
    if (documentIds && Array.isArray(documentIds)) {
      documentIds.forEach(id => {
        if (id && !ids.includes(id)) ids.push(id);
      });
    }
    if (ids.length === 0) return '';

    const documents = await this.documentsRepository.find({
      where: { id: In(ids) },
      select: ['id', 'ocrText', 'title'],
    });

    if (documents.length === 0) throw new NotFoundException('Không tìm thấy tài liệu được yêu cầu');

    let combinedText = '';
    for (const doc of documents) {
      const text = doc.ocrText || '';
      if (!text.trim()) {
        throw new BadRequestException(`Tài liệu "${doc.title}" chưa được trích xuất chữ (OCR). Hãy chạy trích xuất chữ trước khi chat!`);
      }
      combinedText += `=== Nội dung tài liệu: ${doc.title} ===\n${text}\n\n`;
    }
    return combinedText.trim();
  }

  private buildHistory(history?: { role: 'user' | 'ai'; content: string }[]): ChatHistoryItem[] {
    const geminiHistory: ChatHistoryItem[] = [];
    if (history && history.length > 0) {
      history.forEach((h) => {
        geminiHistory.push({
          role: h.role === 'ai' ? 'model' : 'user',
          parts: [{ text: h.content }],
        });
      });
    }
    while (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
      geminiHistory.shift();
    }
    return geminiHistory;
  }

  private buildSystemPrompt(contextText: string): string {
    let prompt =
      'Bạn là một trợ lý học tập AI thông thái, thân thiện và hữu ích, có tên là "AI Scholarly". ' +
      'Bạn hãy trả lời các câu hỏi của người dùng một cách rõ ràng, ngắn gọn và dễ hiểu bằng tiếng Việt.';
    if (contextText) {
      prompt +=
        `\n\nDưới đây là nội dung tài liệu học tập của người dùng đã tải lên:\n---\n${contextText}\n---\n\n` +
        'Nhiệm vụ của bạn là CHỈ sử dụng thông tin trong tài liệu trên để trả lời câu hỏi của người dùng. ' +
        'Nếu thông tin không có trong tài liệu, hãy lịch sự thông báo cho người dùng.';
    }
    return prompt;
  }

  private classifyError(error: any): '429' | '401' | '404' | 'other' {
    const msg = error?.message || '';
    if (msg.includes('429') || msg.includes('Too Many Requests')) return '429';
    if (msg.includes('401') || msg.includes('API_KEY_INVALID')) return '401';
    if (msg.includes('404') || msg.includes('not found')) return '404';
    return 'other';
  }

  // ─── Non-streaming (giữ lại để tương thích) ───────────────────────────────
  async generateResponse(
    message: string,
    documentId?: number,
    documentIds?: number[],
    history?: { role: 'user' | 'ai'; content: string }[],
  ): Promise<string> {
    if (!message) throw new BadRequestException('Tin nhắn không được để trống');

    const contextText = await this.prepareContext(documentId, documentIds);
    if (!this.ai) return this.getMockResponse(message, contextText);

    const geminiHistory = this.buildHistory(history);
    const systemPrompt = this.buildSystemPrompt(contextText);
    const MAX_RETRIES = 2;
    let lastError: any = null;

    for (const modelName of this.MODEL_PRIORITY) {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const model = this.ai.getGenerativeModel({ model: modelName });
          const chatSession = model.startChat({
            history: geminiHistory,
            systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
          });
          const response = await chatSession.sendMessage(message);
          return response.response.text();
        } catch (error: any) {
          lastError = error;
          console.error(`[Chat] Error with ${modelName} (attempt ${attempt + 1}):`, error.message);
          const kind = this.classifyError(error);
          if (kind === '429' && attempt < MAX_RETRIES) {
            const m = error.message?.match(/retry in (\d+(?:\.\d+)?)s/i);
            const waitMs = m ? Math.ceil(parseFloat(m[1])) * 1000 + 500 : (attempt + 1) * 6000;
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }
          if (kind === '429') { break; }
          if (kind === '401') return '⚠️ API key Gemini không hợp lệ. Vui lòng liên hệ quản trị viên.';
          if (kind === '404') { break; }
          return '⚠️ Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.';
        }
      }
    }

    console.error('[Chat] All models failed:', lastError?.message);
    return '⚠️ Dịch vụ AI hiện đang bận. Vui lòng thử lại sau vài phút nhé!';
  }

  // ─── Streaming via SSE ─────────────────────────────────────────────────────
  async streamResponse(
    message: string,
    documentId: number | undefined,
    documentIds: number[] | undefined,
    history: { role: 'user' | 'ai'; content: string }[] | undefined,
    res: Response,
  ): Promise<void> {
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const send = (data: object) => res.write(`data: ${JSON.stringify(data)}\n\n`);
    const done = () => { res.write('data: [DONE]\n\n'); res.end(); };

    if (!message) { send({ error: 'Tin nhắn không được để trống' }); return done(); }

    let contextText = '';
    try {
      contextText = await this.prepareContext(documentId, documentIds);
    } catch (e: any) {
      send({ error: e.message });
      return done();
    }

    if (!this.ai) {
      send({ text: this.getMockResponse(message, contextText) });
      return done();
    }

    const geminiHistory = this.buildHistory(history);
    const systemPrompt = this.buildSystemPrompt(contextText);
    const MAX_RETRIES = 1;
    let lastError: any = null;

    for (const modelName of this.MODEL_PRIORITY) {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const model = this.ai.getGenerativeModel({ model: modelName });
          const chatSession = model.startChat({
            history: geminiHistory,
            systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] },
          });

          const result = await chatSession.sendMessageStream(message);
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) send({ text });
          }
          return done();
        } catch (error: any) {
          lastError = error;
          console.error(`[Chat Stream] Error with ${modelName} (attempt ${attempt + 1}):`, error.message);
          const kind = this.classifyError(error);
          if (kind === '429' && attempt < MAX_RETRIES) {
            const m = error.message?.match(/retry in (\d+(?:\.\d+)?)s/i);
            const waitMs = m ? Math.ceil(parseFloat(m[1])) * 1000 + 500 : 5000;
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }
          if (kind === '429') { break; }
          if (kind === '401') { send({ error: '⚠️ API key không hợp lệ.' }); return done(); }
          if (kind === '404') { break; }
          send({ error: '⚠️ Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.' });
          return done();
        }
      }
    }

    console.error('[Chat Stream] All models failed:', lastError?.message);
    send({ error: '⚠️ Dịch vụ AI đang bận. Vui lòng thử lại sau vài phút!' });
    done();
  }

  async generateQuiz(
    text: string,
    difficulty: string,
    questionCount: number,
  ): Promise<{ questions: any[] }> {
    if (!text) throw new BadRequestException('Nguồn nội dung không được để trống');
    if (!this.ai) {
      return {
        questions: [
          {
            id: 1,
            question: `[Chế độ Demo] Câu hỏi về: ${text.slice(0, 50)}...`,
            options: ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
            correctAnswer: 0,
            hint: "Gợi ý cho câu hỏi demo",
            explanation: "Lựa chọn A là đáp án demo chính xác."
          }
        ]
      };
    }

    const difficultyText = difficulty === 'expert' ? 'Chuyên gia' : difficulty === 'advanced' ? 'Nâng cao' : 'Cơ bản';
    const count = questionCount || 5;

    const systemPrompt = 
      'Bạn là chuyên gia xây dựng câu hỏi trắc nghiệm học thuật. ' +
      'Nhiệm vụ của bạn là đọc kỹ đoạn văn bản hoặc chủ đề người dùng cung cấp, sau đó tạo ra danh sách câu hỏi trắc nghiệm khách quan.\n\n' +
      'Yêu cầu:\n' +
      `1. Tạo chính xác ${count} câu hỏi.\n` +
      `2. Độ khó của câu hỏi phải ở mức: ${difficultyText}.\n` +
      '3. Mỗi câu hỏi phải có đúng 4 phương án lựa chọn (A, B, C, D) dưới dạng mảng.\n' +
      '4. `correctAnswer` phải là chỉ số của phương án đúng trong mảng (từ 0 đến 3).\n' +
      '5. Cung cấp một gợi ý ngắn gọn (`hint`) cho mỗi câu hỏi.\n' +
      '6. Cung cấp một câu giải thích ngắn gọn lý do vì sao đáp án đúng lại chính xác (`explanation`).\n' +
      '7. Phản hồi phải trả về ĐÚNG định dạng JSON cấu trúc sau:\n' +
      '{\n' +
      '  "questions": [\n' +
      '    {\n' +
      '      "id": 1,\n' +
      '      "question": "Nội dung câu hỏi?",\n' +
      '      "options": ["Đáp án 0", "Đáp án 1", "Đáp án 2", "Đáp án 3"],\n' +
      '      "correctAnswer": 1,\n' +
      '      "hint": "Gợi ý",\n' +
      '      "explanation": "Giải thích chi tiết vì sao đáp án đúng"\n' +
      '    }\n' +
      '  ]\n' +
      '}\n' +
      'Chú ý: Không thêm bất kỳ text nào ngoài chuỗi JSON.';

    const MAX_RETRIES = 1;
    let lastError: any = null;

    for (const modelName of this.MODEL_PRIORITY) {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const model = this.ai.getGenerativeModel({
            model: modelName,
            generationConfig: { responseMimeType: 'application/json' }
          });
          const response = await model.generateContent([
            { text: systemPrompt },
            { text: `Nội dung nguồn:\n${text}` }
          ]);
          return JSON.parse(response.response.text());
        } catch (error: any) {
          lastError = error;
          console.error(`[ChatService] Error generating quiz with ${modelName} (attempt ${attempt + 1}):`, error.message);
          const kind = this.classifyError(error);
          
          if (kind === '429' && attempt < MAX_RETRIES) {
            const m = error.message?.match(/retry in (\d+(?:\.\d+)?)s/i);
            const waitMs = m ? Math.ceil(parseFloat(m[1])) * 1000 + 500 : (attempt + 1) * 3000;
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }
          
          if (kind === '401') {
            throw new BadRequestException('API key Gemini không hợp lệ. Vui lòng kiểm tra lại cấu hình.');
          }

          break; // Thử model tiếp theo trong MODEL_PRIORITY
        }
      }
    }

    console.error('[ChatService] All models failed to generate quiz:', lastError?.message);
    throw new BadRequestException(`Không thể sinh trắc nghiệm từ AI lúc này: ${lastError?.message || 'Lỗi kết nối'}`);
  }

  async generateLecture(
    text: string,
    studyMode: string,
  ): Promise<{ title: string; content: string }> {
    if (!text) throw new BadRequestException('Nguồn nội dung không được để trống');
    if (!this.ai) {
      return {
        title: `Bài giảng: ${text.slice(0, 30)}...`,
        content: `### [Chế độ Demo] Nội dung bài học\n\nĐây là bài giảng mẫu về chủ đề **${text}**. Cấu hình API key để nhận được bài học biên soạn thực tế từ AI.`
      };
    }

    let modeText = 'Chi tiết & Chuyên sâu (đầy đủ lý thuyết, phân tích cặn kẽ từng khái niệm)';
    if (studyMode === 'summary') {
      modeText = 'Tóm tắt Nhanh (tập trung vào ý chính, gạch đầu dòng ngắn gọn, dễ nhớ)';
    } else if (studyMode === 'practical') {
      modeText = 'Thiên về Ứng dụng (nhiều ví dụ thực tiễn, case study và bài tập tình huống)';
    }

    const systemPrompt = 
      'Bạn là một giảng viên AI biên soạn giáo án và bài giảng học tập xuất sắc. ' +
      'Nhiệm vụ của bạn là đọc kỹ đoạn văn bản hoặc chủ đề người dùng cung cấp, sau đó thiết kế một bài học chất lượng cao.\n\n' +
      'Yêu cầu:\n' +
      `1. Biên soạn theo phong cách học tập: ${modeText}.\n` +
      '2. Bài học phải có tiêu đề rõ ràng, các mục lớn (dùng Markdown h2, h3, danh sách, in đậm, khối trích dẫn) được cấu trúc chặt chẽ.\n' +
      '3. Cuối bài giảng, hãy thiết kế một phần "Bài tập tư duy" hoặc câu hỏi thảo luận gợi mở.\n' +
      '4. Trả về kết quả dưới định dạng JSON có cấu trúc như sau:\n' +
      '{\n' +
      '  "title": "Tiêu đề bài học",\n' +
      '  "content": "Nội dung bài học dạng Markdown"\n' +
      '}\n' +
      'Chú ý: Không thêm bất kỳ text nào ngoài chuỗi JSON.';

    const MAX_RETRIES = 1;
    let lastError: any = null;

    for (const modelName of this.MODEL_PRIORITY) {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const model = this.ai.getGenerativeModel({
            model: modelName,
            generationConfig: { responseMimeType: 'application/json' }
          });
          const response = await model.generateContent([
            { text: systemPrompt },
            { text: `Nội dung nguồn:\n${text}` }
          ]);
          return JSON.parse(response.response.text());
        } catch (error: any) {
          lastError = error;
          console.error(`[ChatService] Error generating lecture with ${modelName} (attempt ${attempt + 1}):`, error.message);
          const kind = this.classifyError(error);
          
          if (kind === '429' && attempt < MAX_RETRIES) {
            const m = error.message?.match(/retry in (\d+(?:\.\d+)?)s/i);
            const waitMs = m ? Math.ceil(parseFloat(m[1])) * 1000 + 500 : (attempt + 1) * 3000;
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }
          
          if (kind === '401') {
            throw new BadRequestException('API key Gemini không hợp lệ. Vui lòng kiểm tra lại cấu hình.');
          }

          break; // Thử model tiếp theo trong MODEL_PRIORITY
        }
      }
    }

    console.error('[ChatService] All models failed to generate lecture:', lastError?.message);
    throw new BadRequestException(`Không thể sinh bài giảng từ AI lúc này: ${lastError?.message || 'Lỗi kết nối'}`);
  }

  private getMockResponse(message: string, contextText: string): string {
    const msgLower = message.toLowerCase();
    if (contextText) {
      if (msgLower.includes('tóm tắt') || msgLower.includes('summary')) {
        return `[Chế độ Demo] Tôi đã nhận tài liệu (${contextText.length} ký tự). Tóm tắt giả lập:\n1. Tài liệu chứa nội dung học tập quan trọng.\n2. Bạn có thể hỏi chi tiết hơn về các phần cụ thể.`;
      }
      return `[Chế độ Demo] Câu hỏi của bạn: "${message}". Vui lòng cấu hình GEMINI_API_KEY để nhận câu trả lời thực.`;
    }
    if (msgLower.includes('chào') || msgLower.includes('hi') || msgLower.includes('hello')) {
      return 'Xin chào! Tôi là Trợ lý AI Scholarly (Chế độ Demo). Hãy cấu hình API key để dùng đầy đủ tính năng!';
    }
    return `[Chế độ Demo] Đã nhận câu hỏi: "${message}". Thêm GEMINI_API_KEY vào file .env để bắt đầu!`;
  }
}

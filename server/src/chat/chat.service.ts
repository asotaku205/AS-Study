import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  // Thứ tự ưu tiên model — tự động thử các model tiếp theo nếu bị rate-limit
  private readonly MODEL_PRIORITY = [
    'gemini-3.1-flash-lite',
    'gemini-2.5-flash-lite',
    'gemini-2.5-flash',
  ];
  private buildLectureModeInstruction(mode: string): string {
    switch (mode) {
      case 'summary':
        return `
=== SUMMARY MODE ===

Mục tiêu:
- Ôn tập nhanh.
- Nắm ý chính.
- Giảm chi tiết phụ.

Bloom:
70% Remember
20% Understand
10% Apply

Yêu cầu:
- 1000-2500 từ.
- Ưu tiên bullet points.
- Bảng tổng hợp kiến thức.
- Chỉ giữ kiến thức quan trọng nhất.
`;
      case 'practical':
        return `
=== PRACTICAL MODE ===

Mục tiêu:
- Học để áp dụng.

Bloom:
20% Understand
40% Apply
30% Analyze
10% Evaluate

Tỷ lệ:
30% lý thuyết
70% thực hành

Mỗi chương bắt buộc có:
- Use Case
- Case Study
- Common Mistakes
- Best Practice
- Practical Tips
`;
      default:
        return `
=== DEEP LEARNING MODE ===

Mục tiêu:
- Hiểu sâu bản chất.

Bloom:
20% Understand
30% Apply
30% Analyze
20% Evaluate

Mỗi chủ đề phải có:
- Historical Context
- Internal Logic
- Comparative Analysis
- Critical Thinking
- Expert Commentary

Không giới hạn độ dài.
`;
    }
  }
  private buildQuizDifficultyInstruction(difficulty: string): string {
    switch (difficulty) {
      case 'expert':
        return `
=== EXPERT LEVEL ===

Bloom Distribution:

20% Apply
50% Analyze
30% Evaluate

Không hỏi:
- Khái niệm đơn thuần
- Định nghĩa đơn thuần

Ưu tiên:
- Scenario
- Case Study
- Root Cause Analysis
- So sánh giải pháp
- Đánh giá lựa chọn
`;
      case 'advanced':
        return `
=== ADVANCED LEVEL ===

Bloom Distribution:

30% Understand
40% Apply
30% Analyze

Ưu tiên:
- Tình huống
- So sánh
- Ứng dụng
- Phân tích
`;
      default:
        return `
=== BASIC LEVEL ===

Bloom Distribution:

70% Remember
30% Understand

Ưu tiên:
- Định nghĩa
- Thuật ngữ
- Khái niệm
`;
    }
  }
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
  private async prepareContext(
    documentId?: number,
    documentIds?: number[],
  ): Promise<string> {
    const ids: number[] = [];
    if (documentId) ids.push(documentId);
    if (documentIds && Array.isArray(documentIds)) {
      documentIds.forEach((id) => {
        if (id && !ids.includes(id)) ids.push(id);
      });
    }
    if (ids.length === 0) return '';

    const documents = await this.documentsRepository.find({
      where: { id: In(ids) },
      select: ['id', 'ocrText', 'title'],
    });

    if (documents.length === 0)
      throw new NotFoundException('Không tìm thấy tài liệu được yêu cầu');

    let combinedText = '';
    for (const doc of documents) {
      const text = doc.ocrText || '';
      if (!text.trim()) {
        throw new BadRequestException(
          `Tài liệu "${doc.title}" chưa được trích xuất chữ (OCR). Hãy chạy trích xuất chữ trước khi chat!`,
        );
      }
      combinedText += `=== Nội dung tài liệu: ${doc.title} ===\n${text}\n\n`;
    }
    return combinedText.trim();
  }

  private buildHistory(
    history?: { role: 'user' | 'ai'; content: string }[],
  ): ChatHistoryItem[] {
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
            systemInstruction: {
              role: 'system',
              parts: [{ text: systemPrompt }],
            },
          });
          const response = await chatSession.sendMessage(message);
          return response.response.text();
        } catch (error: any) {
          lastError = error;
          console.error(
            `[Chat] Error with ${modelName} (attempt ${attempt + 1}):`,
            error.message,
          );
          const kind = this.classifyError(error);
          if (kind === '429' && attempt < MAX_RETRIES) {
            const m = error.message?.match(/retry in (\d+(?:\.\d+)?)s/i);
            const waitMs = m
              ? Math.ceil(parseFloat(m[1])) * 1000 + 500
              : (attempt + 1) * 6000;
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }
          if (kind === '429') {
            break;
          }
          if (kind === '401')
            return ' API key Gemini không hợp lệ. Vui lòng liên hệ quản trị viên.';
          if (kind === '404') {
            break;
          }
          return ' Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.';
        }
      }
    }

    console.error('[Chat] All models failed:', lastError?.message);
    return ' Dịch vụ AI hiện đang bận. Vui lòng thử lại sau vài phút nhé!';
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

    const send = (data: object) =>
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    const done = () => {
      res.write('data: [DONE]\n\n');
      res.end();
    };

    if (!message) {
      send({ error: 'Tin nhắn không được để trống' });
      return done();
    }

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
            systemInstruction: {
              role: 'system',
              parts: [{ text: systemPrompt }],
            },
          });

          const result = await chatSession.sendMessageStream(message);
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) send({ text });
          }
          return done();
        } catch (error: any) {
          lastError = error;
          console.error(
            `[Chat Stream] Error with ${modelName} (attempt ${attempt + 1}):`,
            error.message,
          );
          const kind = this.classifyError(error);
          if (kind === '429' && attempt < MAX_RETRIES) {
            const m = error.message?.match(/retry in (\d+(?:\.\d+)?)s/i);
            const waitMs = m ? Math.ceil(parseFloat(m[1])) * 1000 + 500 : 5000;
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }
          if (kind === '429') {
            break;
          }
          if (kind === '401') {
            send({ error: ' API key không hợp lệ.' });
            return done();
          }
          if (kind === '404') {
            break;
          }
          send({
            error: ' Đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.',
          });
          return done();
        }
      }
    }

    console.error('[Chat Stream] All models failed:', lastError?.message);
    send({ error: ' Dịch vụ AI đang bận. Vui lòng thử lại sau vài phút!' });
    done();
  }

  // ─── Quiz Generator ────────────────────────────────────────────────────────
  async generateQuiz(
    text: string,
    difficulty: string,
    questionCount: number,
  ): Promise<{ questions: any[] }> {
    if (!text)
      throw new BadRequestException('Nguồn nội dung không được để trống');
    if (!this.ai) {
      return {
        questions: [
          {
            id: 1,
            question: `[Chế độ Demo] Câu hỏi về: ${text.slice(0, 50)}...`,
            options: ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D'],
            correctAnswer: 0,
            hint: 'Gợi ý cho câu hỏi demo',
            explanation: 'Lựa chọn A là đáp án demo chính xác.',
          },
        ],
      };
    }
    const difficultyText = this.buildQuizDifficultyInstruction(difficulty);
    const count = questionCount || 5;

    const systemPrompt = `Bạn là một chuyên gia khảo thí xây dựng câu hỏi trắc nghiệm học thuật xuất sắc.
Nhiệm vụ: Phân tích sâu sắc tài liệu nguồn được cung cấp, tìm kiếm tất cả thuật ngữ, khái niệm, công thức, định nghĩa quan trọng để tạo ra bộ đề trắc nghiệm chuẩn chỉnh có tính phân hóa học thuật cao nhất.

=== THÔNG SỐ ===
- Số câu cần tạo: ĐÚNG CHÍNH XÁC ${count} câu hỏi (không hơn, không kém).
- Mức độ khó yêu cầu: ${difficultyText}.

=== QUY TẮC PHÂN PHỐI ĐỘ KHÓ (Nếu đề có nhiều câu):
1. CƠ BẢN (Nhận biết): Hỏi trực tiếp về định nghĩa, thuật ngữ cốt lõi (Ví dụ: "[Keyword] là gì?").
2. TRUNG BÌNH (Thông hiểu): Yêu cầu so sánh, phân biệt cách hoạt động, giải thích một đoạn logic (Ví dụ: "Sự khác biệt giữa [Keyword A] và [Keyword B] là gì?").
3. NÂNG CAO/CHUYÊN GIA (Vận dụng & Phân tích): Đặt vào các tình huống thực tế phức tạp, tìm lỗi sai, dự đoán output (Ví dụ: "Khi nào nên dùng [Keyword A] thay vì [Keyword B]?").

=== CHIẾN THUẬT PHÂN TÍCH NHẦM LẪN (MISCONCEPTION):
- Các phương án nhiễu (distractors) KHÔNG ĐƯỢC viết ngớ ngẩn. Chúng phải đại diện cho các lỗi tư duy phổ biến (ví dụ: nhầm lẫn giữa hai khái niệm tương tự, áp dụng sai công thức, lỗi cú pháp hay gặp).
- Hãy phân phối ngẫu nhiên vị trí của đáp án đúng ("correctAnswer" từ 0 đến 3), tránh việc dồn quá nhiều đáp án đúng vào một vị trí (như 100% đáp án là 0).
- Tránh hỏi dạng phủ định lặp lại liên tục như "Điều nào sau đây SAI/KHÔNG đúng?". Hãy hỏi thẳng vào bản chất khái niệm.
- KHÔNG dùng lại cùng một Keyword ở nhiều câu hỏi khác nhau nhằm tối đa hóa phạm vi kiểm tra kiến thức.

=== HƯỚNG DẪN LỰA CHỌN CHỦ ĐỀ ĐA DẠNG:
- Nếu là LẬP TRÌNH/CODE: Tận dụng các code snippets thực tế chiếm khoảng 50-60% số câu hỏi để kiểm tra khả năng đọc hiểu, dự đoán kết quả hoặc tìm lỗi sai.
- Nếu là NGÔN NGỮ: Tập trung vào ngữ pháp chuyên ngành, collocation, ngữ cảnh sử dụng từ.
- Nếu là KHOA HỌC TỰ NHIÊN: Đưa công thức, định luật, cơ chế quy trình. Đối với các biểu thức hoặc ký hiệu toán học/khoa học, hãy sử dụng định dạng LaTeX chuẩn chỉ: $...$ cho inline và $$...$$ cho block hiển thị.
- Nếu là KINH TẾ/KINH DOANH: Tập trung phân tích mô hình, chiến lược, chỉ số, tình huống kinh doanh thực tế.
- Nếu là LỊCH SỬ/VĂN HỌC/ĐỊA LÝ/XÃ HỘI: Khai thác sâu về mối quan hệ nhân quả, bối cảnh lịch sử, triết học, học thuyết xã hội hoặc ý nghĩa của tác phẩm văn học. Tránh đặt các câu hỏi học vẹt ngày tháng năm khô khan, hãy tập trung hỏi về bản chất tác động, hệ quả của sự kiện hoặc thông điệp cốt lõi.

=== TIÊU CHUẨN CẤU TRÚC GIẢI THÍCH (EXPLANATION) HOÀN HẢO:
Mỗi trường "explanation" bắt buộc phải có bố cục gồm 3 phần liên kết chặt chẽ nhằm triệt tiêu hoàn toàn lỗ hổng kiến thức:
  1. Định nghĩa khoa học của keyword hoặc thuật ngữ cốt lõi được nhắc đến trong câu hỏi (1-2 câu).
  2. Phân tích cụ thể lý do tại sao phương án được chọn là đúng và vì sao từng phương án nhiễu còn lại là sai (chỉ ra bẫy nhận thức của phương án đó).
  3. Cung cấp một ví dụ thực tế mở rộng hoặc một lưu ý/mẹo ghi nhớ cực kỳ bổ ích (1 câu).
*Tuyệt đối không giải thích chung chung kiểu "Đáp án A đúng theo văn bản học tập". Không copy y hệt trường "hint" dán vào "explanation".*

=== ĐỊNH DẠNG OUTPUT JSON ===
Bạn phải trả về đúng và duy nhất cấu trúc JSON sau, không kèm bất kỳ ký tự markdown bọc ngoài nào (như \`\`\`json):
{
  "questions": [
    {
      "id": 1,
      "question": "Nội dung câu hỏi trực tiếp và cụ thể?",
      "options": ["Đáp án A", "Đáp án B", "Đáp án C", "Đáp án D"],
      "correctAnswer": 0,
      "hint": "Gợi ý định hướng suy nghĩ ngắn gọn",
      "explanation": "[Định nghĩa thuật ngữ cốt lõi] + [Phân tích chi tiết lý do đúng/sai của các phương án] + [Ví dụ thực tế/lưu ý ghi nhớ]"
    }
  ]
}`;

    const MAX_RETRIES = 1;
    let lastError: any = null;

    for (const modelName of this.MODEL_PRIORITY) {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const model = this.ai.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          });
          const response = await model.generateContent([
            { text: systemPrompt },
            { text: `Nội dung nguồn:\n${text}` },
          ]);
          return JSON.parse(response.response.text());
        } catch (error: any) {
          lastError = error;
          console.error(
            `[ChatService] Error generating quiz with ${modelName} (attempt ${attempt + 1}):`,
            error.message,
          );
          const kind = this.classifyError(error);

          if (kind === '429' && attempt < MAX_RETRIES) {
            const m = error.message?.match(/retry in (\d+(?:\.\d+)?)s/i);
            const waitMs = m
              ? Math.ceil(parseFloat(m[1])) * 1000 + 500
              : (attempt + 1) * 3000;
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }

          if (kind === '401') {
            throw new BadRequestException(
              'API key Gemini không hợp lệ. Vui lòng kiểm tra lại cấu hình.',
            );
          }

          break; // Thử model tiếp theo trong MODEL_PRIORITY
        }
      }
    }

    console.error(
      '[ChatService] All models failed to generate quiz:',
      lastError?.message,
    );
    throw new BadRequestException(
      `Không thể sinh trắc nghiệm từ AI lúc này: ${lastError?.message || 'Lỗi kết nối'}`,
    );
  }

  // ─── Lecture Generator ─────────────────────────────────────────────────────
  async generateLecture(
    text: string,
    studyMode: string,
  ): Promise<{ title: string; content: string }> {
    if (!text)
      throw new BadRequestException('Nguồn nội dung không được để trống');
    if (!this.ai) {
      return {
        title: `Bài giảng: ${text.slice(0, 30)}...`,
        content: `### [Chế độ Demo] Nội dung bài học\n\nĐây là bài giảng mẫu về chủ đề **${text}**. Cấu hình API key để nhận được bài học biên soạn thực tế từ AI.`,
      };
    }
    const modeInstruction = this.buildLectureModeInstruction(studyMode);

    const systemPrompt = `Bạn là một Giảng viên Giáo sư AI có khả năng truyền đạt xuất sắc và thiết kế giáo án học thuật chuyên sâu ở trình độ đại học quốc tế.
Nhiệm vụ: Nghiên cứu, phân tích toàn bộ nội dung nguồn được cung cấp. Tuyệt đối không lược bỏ hay bỏ sót bất kỳ chi tiết, thuật ngữ, khái niệm hoặc định nghĩa quan trọng nào. Chuyển hóa toàn bộ nguồn kiến thức thô này thành một bài giảng hoàn chỉnh, khoa học, vô cùng chi tiết và cuốn hút.

=== CHẾ ĐỘ BIÊN SOẠN YÊU CẦU: ${modeInstruction} ===

=== CHIẾN LƯỢC BIÊN SOẠN CHỐNG VIẾT NGẮN & SƠ SÀI (BẮT BUỘC) ===
1.
KHÔNG tạo bản tóm tắt.

KHÔNG tạo ghi chú học tập.

KHÔNG viết kiểu liệt kê ý chính.

Hãy viết như đang trực tiếp giảng dạy cho sinh viên.

Mọi kiến thức phải được dạy theo chiều sâu.

Không chỉ trả lời:

"Đây là gì?"

Mà phải trả lời:

Vì sao nó xuất hiện?
Nó giải quyết vấn đề gì?
Nó hoạt động như thế nào?
Điều gì xảy ra nếu nó không tồn tại?
Nó khác gì với các phương pháp khác?
Giá trị của nó ngày nay là gì?

Trước khi viết:

Xác định lĩnh vực.
Xác định các chủ đề chính.
Xác định các keyword quan trọng.
Xác định các mối liên hệ giữa các chủ đề.
Xây dựng Knowledge Map nội bộ.

Không hiển thị bước này.

Tự động thiết kế cấu trúc phù hợp.

Không sử dụng cấu trúc cố định.

Cấu trúc phải:

Đi từ nền tảng tới nâng cao.
Đi từ nguyên nhân tới kết quả.
Đi từ lý thuyết tới ứng dụng.
Đi từ khái niệm tới tư duy phản biện.
Biến toàn bộ tài liệu nguồn thành một bài giảng hoàn chỉnh giúp người học:

Hiểu bản chất.
Hiểu nguyên nhân.
Hiểu cơ chế.
Hiểu mối liên hệ.
Hiểu ứng dụng.
Có khả năng giải thích lại bằng ngôn ngữ của chính mình.
Có khả năng vận dụng vào thực tế.
Được phép mở rộng kiến thức bằng:

- Kiến thức học thuật phổ biến
- Ví dụ lịch sử
- Case study
- So sánh học thuật

Nhưng không được tự tạo dữ kiện lịch sử, số liệu hoặc trích dẫn không có cơ sở.

2. PHÂN TÍCH SÂU TỪNG MỤC: Với mỗi khái niệm, định nghĩa, hoặc ý chính, hãy viết ít nhất từ 2 đến 3 đoạn văn giải thích rõ bản chất, tầm quan trọng và cách áp dụng, thay vì chỉ liệt kê một vài dòng ngắn.Mọi keyword quan trọng đều phải xuất hiện.
3. KỸ THUẬT FEYNMAN: Đối với mọi khái niệm khó hiểu hoặc trừu tượng, bắt buộc phải lồng ghép ít nhất một phép so sánh/ẩn dụ thực tế gần gũi với đời sống để học viên dễ tiếp thu.
4. GIỌNG ĐIỆU SƯ PHẠM CUỐN HÚT: Viết bài giảng bằng giọng văn chia sẻ, phân tích mạch lạc, có tính liên kết chặt chẽ và chuyển ý mượt mà giữa các chương mục.
=== ABSOLUTE LENGTH REQUIREMENT ===
Đây KHÔNG PHẢI bản tóm tắt.
Đây là giáo trình học tập chuyên sâu.
Mục tiêu:
- Tối thiểu 5000 từ.
- Mục tiêu lý tưởng 8000–12000 từ.
Không được:
- Tóm tắt.
- Liệt kê ý chính ngắn gọn.
- Mô tả sơ sài.
- Bỏ qua keyword.
Đối với mỗi khái niệm quan trọng:
Bắt buộc triển khai:
1. Định nghĩa
2. Bản chất
3. Cơ chế
4. Thành phần
5. Ưu điểm
6. Nhược điểm
7. Ví dụ
8. Ứng dụng
9. Anti-pattern
10. Best practice
11. So sánh
12. Expert note
Mỗi khái niệm tối thiểu 300 từ.
Mỗi chương tối thiểu 500 từ.
Nếu bài giảng chưa đủ chi tiết thì tiếp tục mở rộng cho đến khi hoàn thành đầy đủ mọi chủ đề.
=== QUY TẮC ĐỊNH DẠNG BẢNG MARKDOWN (MARKDOWN TABLES) BẮT BUỘC ===
Để đảm bảo bảng Markdown được render chính xác trên giao diện và không bị lỗi định dạng, bạn phải tuân thủ nghiêm ngặt các quy tắc sau:
1. Mỗi hàng của bảng (hàng tiêu đề, hàng phân cách '| :--- | :--- |', và từng hàng dữ liệu) bắt buộc phải được xuống dòng hoàn toàn riêng biệt bằng ký tự xuống dòng thực tế (được biểu diễn là \\n trong chuỗi JSON). TUYỆT ĐỐI KHÔNG gộp chung các dòng này trên một hàng ngang duy nhất.
2. Bắt buộc phải có dòng phân cách '| :--- | :--- |' (hoặc tương tự) ngay phía dưới hàng tiêu đề để trình phân tích Markdown nhận diện là bảng.
3. Đảm bảo số cột ở tất cả các hàng trong bảng phải bằng nhau.
Ví dụ định dạng bảng đúng (mỗi dòng cách nhau bởi dấu xuống dòng):
| Thuật ngữ | Định nghĩa súc tích | Giải thích chi tiết |
| :--- | :--- | :--- |
| Thuật ngữ A | Định nghĩa ngắn gọn | Phần diễn giải chi tiết cho thuật ngữ A |

=== THIẾT KẾ CẤU TRÚC BÀI GIẢNG THÔNG MINH ===

KHÔNG sử dụng cấu trúc bài giảng cố định.

Trước khi viết bài giảng, hãy thực hiện các bước sau một cách âm thầm:

BƯỚC 1: PHÂN TÍCH TÀI LIỆU

* Xác định lĩnh vực học thuật.
* Xác định ngành nghề liên quan.
* Xác định môn học.
* Xác định các chủ đề chính.
* Xác định các keyword quan trọng.
* Xác định mối quan hệ giữa các khái niệm.

BƯỚC 2: XÂY DỰNG KNOWLEDGE MAP

Tạo bản đồ kiến thức nội bộ:

* Concept
* Dependency
* Importance
* Difficulty
* Related Concepts

BƯỚC 3: THIẾT KẾ OUTLINE ĐỘNG

Dựa trên loại tài liệu, tự động lựa chọn cấu trúc bài giảng phù hợp nhất.

Tuyệt đối KHÔNG ép mọi môn học vào cùng một cấu trúc.

=== VAI TRÒ ===

Bạn là chuyên gia thiết kế giáo trình, giảng viên đại học và chuyên gia chuyển đổi tài liệu thành bài giảng học tập chuyên sâu.

Mục tiêu là biến tài liệu nguồn thành một bài giảng hoàn chỉnh, có tính sư phạm cao, giúp người học hiểu sâu bản chất thay vì chỉ ghi nhớ thông tin.

====================================================
GIAI ĐOẠN 1: PHÂN TÍCH KIẾN THỨC
================================

Trước khi viết bài giảng, hãy âm thầm thực hiện:

1. Xác định lĩnh vực chính của tài liệu.

Ví dụ:

* Công nghệ thông tin
* Khoa học tự nhiên
* Khoa học xã hội
* Kinh tế
* Quản trị
* Marketing
* Luật
* Y học
* Giáo dục
* Kỹ thuật
* Nghệ thuật
* Ngôn ngữ học
* Hoặc lĩnh vực phù hợp khác

2. Trích xuất:

* Khái niệm
* Định nghĩa
* Thuật ngữ
* Công thức
* Thuật toán
* Quy trình
* Mô hình
* Học thuyết
* Sự kiện
* Cơ chế
* Nguyên nhân
* Hệ quả
* Ví dụ
* Case Study

3. Xây dựng Knowledge Map nội bộ.

Mỗi kiến thức cần được xác định:

* Mức độ quan trọng
* Độ khó
* Kiến thức phụ thuộc
* Mối liên hệ với các chủ đề khác

4. Nhóm các nội dung liên quan thành các chương logic.

====================================================
GIAI ĐOẠN 2: THIẾT KẾ CẤU TRÚC BÀI GIẢNG
========================================

KHÔNG sử dụng cấu trúc cố định.

Hãy tự thiết kế cấu trúc tối ưu dựa trên:

* Bản chất của kiến thức
* Lĩnh vực học thuật
* Mức độ phức tạp
* Trình tự học tập tự nhiên

Cấu trúc phải:

* Đi từ cơ bản đến nâng cao
* Từ nền tảng đến ứng dụng
* Từ khái niệm đến phân tích
* Từ lý thuyết đến thực hành

Được phép:

* Thêm chương
* Gộp chương
* Chia chương
* Đổi tên chương

Nếu cần.

====================================================
GIAI ĐOẠN 3: TRIỂN KHAI NỘI DUNG
================================

Mỗi chương nên bao gồm các phần phù hợp với loại kiến thức đang được trình bày.

Đối với mỗi khái niệm quan trọng, cần cố gắng trình bày:

1. Định nghĩa

2. Bản chất

3. Vai trò hoặc mục đích

4. Thành phần hoặc cấu trúc

5. Nguyên lý hoặc cơ chế hoạt động

6. Ví dụ minh họa

7. Trường hợp sử dụng

8. Ưu điểm

9. Hạn chế

10. Sai lầm thường gặp

11. So sánh với các khái niệm liên quan

12. Liên hệ thực tế

13. Góc nhìn chuyên gia

Không phải khái niệm nào cũng cần đầy đủ tất cả các mục trên, nhưng phải lựa chọn các mục phù hợp để giúp người học hiểu sâu nhất.

====================================================
PHONG CÁCH GIẢNG DẠY
====================

Viết như một giảng viên đang trực tiếp giảng bài.

Ưu tiên:

* Giải thích rõ ràng
* Dễ hiểu
* Logic
* Có chiều sâu
* Có ví dụ thực tế

Khi gặp kiến thức khó:

* Chia nhỏ thành từng bước
* Giải thích trực quan
* Sử dụng phép so sánh hoặc ẩn dụ nếu phù hợp

Không chỉ nêu kết luận.

Phải giải thích vì sao.

====================================================
YÊU CẦU VỀ ĐỘ PHỦ
=================

Không được bỏ sót:

* Chủ đề chính
* Khái niệm quan trọng
* Công thức quan trọng
* Thuật ngữ quan trọng
* Quy trình quan trọng

Mọi nội dung quan trọng trong tài liệu phải xuất hiện trong bài giảng.
====================================================
PHẦN KẾT THÚC
=============

Cuối bài giảng luôn bao gồm:

# Tóm tắt kiến thức cốt lõi

# Active Recall

Tạo các câu hỏi giúp người học tự kiểm tra mức độ hiểu bài.

# Gợi ý học tiếp

Đề xuất các chủ đề liên quan nên học sau khi hoàn thành bài giảng.

====================================================
YÊU CẦU CHUNG CHO MỌI LĨNH VỰC
==============================

* Mỗi chương phải được triển khai chuyên sâu.

* Không chỉ liệt kê ý chính.

* Mỗi keyword quan trọng phải được giải thích:

  * Định nghĩa
  * Bản chất
  * Vai trò
  * Cơ chế
  * Ví dụ
  * Lỗi thường gặp
  * Liên hệ thực tế

* Tự bổ sung các chương cần thiết nếu chủ đề yêu cầu.

* Ưu tiên tính logic và khả năng học tập hơn việc tuân thủ một cấu trúc cứng nhắc.

* Người đọc sau khi học xong phải có khả năng hiểu sâu, giải thích lại và vận dụng kiến thức.


=== ĐỊNH DẠNG OUTPUT ===
KHÔNG trả về JSON.
Trả về Markdown thuần.
Dòng đầu tiên:

# [Tiêu đề bài giảng]

Sau đó là toàn bộ nội dung bài giảng chi tiết.
Không sử dụng markdown code block.
Không bọc trong JSON.
Không giải thích ngoài nội dung bài giảng.`;

    const MAX_RETRIES = 1;
    let lastError: any = null;

    for (const modelName of this.MODEL_PRIORITY) {
      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const model = this.ai.getGenerativeModel({
            model: modelName,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 32768,
            },
          });

          const response = await model.generateContent([
            { text: systemPrompt },
            { text: `Nội dung nguồn:\n${text}` },
          ]);

          const raw = response.response.text();

          const titleMatch =
            raw.match(/^#\s+(.+)$/m) || raw.match(/^TITLE:\s*(.+)$/im);

          const title = titleMatch?.[1]?.trim() || 'Bài giảng';

          return {
            title,
            content: raw,
          };
        } catch (error: any) {
          lastError = error;
          console.error(
            `[ChatService] Error generating lecture with ${modelName} (attempt ${attempt + 1}):`,
            error.message,
          );
          const kind = this.classifyError(error);

          if (kind === '429' && attempt < MAX_RETRIES) {
            const m = error.message?.match(/retry in (\d+(?:\.\d+)?)s/i);
            const waitMs = m
              ? Math.ceil(parseFloat(m[1])) * 1000 + 500
              : (attempt + 1) * 3000;
            await new Promise((r) => setTimeout(r, waitMs));
            continue;
          }

          if (kind === '401') {
            throw new BadRequestException(
              'API key Gemini không hợp lệ. Vui lòng kiểm tra lại cấu hình.',
            );
          }

          break; // Thử model tiếp theo trong MODEL_PRIORITY
        }
      }
    }

    console.error(
      '[ChatService] All models failed to generate lecture:',
      lastError?.message,
    );
    throw new BadRequestException(
      `Không thể sinh bài giảng từ AI lúc này: ${lastError?.message || 'Lỗi kết nối'}`,
    );
  }

  private getMockResponse(message: string, contextText: string): string {
    const msgLower = message.toLowerCase();
    if (contextText) {
      if (msgLower.includes('tóm tắt') || msgLower.includes('summary')) {
        return `[Chế độ Demo] Tôi đã nhận tài liệu (${contextText.length} ký tự). Tóm tắt giả lập:\n1. Tài liệu chứa nội dung học tập quan trọng.\n2. Bạn có thể hỏi chi tiết hơn về các phần cụ thể.`;
      }
      return `[Chế độ Demo] Câu hỏi của bạn: "${message}". Vui lòng cấu hình GEMINI_API_KEY để nhận câu trả lời thực.`;
    }
    if (
      msgLower.includes('chào') ||
      msgLower.includes('hi') ||
      msgLower.includes('hello')
    ) {
      return 'Xin chào! Tôi là Trợ lý AI Scholarly (Chế độ Demo). Hãy cấu hình API key để dùng đầy đủ tính năng!';
    }
    return `[Chế độ Demo] Đã nhận câu hỏi: "${message}". Thêm GEMINI_API_KEY vào file .env để bắt đầu!`;
  }
}

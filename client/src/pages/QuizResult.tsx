import { ArrowRight, BarChart3, BookOpen, BrainCircuit, CheckCircle2, Clock, RefreshCw, Sparkles, Target, Trophy, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { chatWithAI } from "../services/chatService";

type AIRecommendation = {
  id: number;
  title: string;
  description: string;
  actionText: string;
  actionType: "study" | "quiz" | "link";
};

type QuestionResult = {
  id: number;
  q: string;
  yourAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
};

type QuizResultData = {
  score: number;
  time: string;
  correct: number;
  total: number;
  aiRecommendations: AIRecommendation[];
  questions: QuestionResult[];
  historyId?: number;
  quizTitle?: string;
};

// Format the time field: duration string (e.g. "3 phút 20 giây") is shown as-is;
// ISO date strings from historical results are shown as a localized date.
const formatTime = (time: string): string => {
  if (!time) return "--";
  // ISO date strings contain 'T' and 'Z' or '+'
  if (/^\d{4}-\d{2}-\d{2}T/.test(time)) {
    try {
      return new Date(time).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return time;
    }
  }
  return time;
};

const QuizResult = () => {
  const [resultsData, setResultsData] = useState<QuizResultData | null>(null);
  const [isGeneratingRec, setIsGeneratingRec] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Lấy tiêu đề quiz từ activeQuiz hoặc resultData
  const getQuizTitle = (): string => {
    try {
      const activeQuiz = localStorage.getItem("activeQuiz");
      if (activeQuiz) {
        const parsed = JSON.parse(activeQuiz);
        if (parsed.title) return parsed.title;
      }
    } catch { /* ignore */ }
    return resultsData?.quizTitle || "Trắc nghiệm ôn tập";
  };

  // Xử lý khi bấm nút hành động từ AI recommendation
  const handleRecommendationAction = (rec: AIRecommendation) => {
    const quizTitle = getQuizTitle();
    const wrongQuestions = resultsData?.questions.filter(q => !q.isCorrect) || [];
    
    // Tạo nội dung tóm tắt các câu sai để gửi làm context
    const weakContent = wrongQuestions.map(q => 
      `Câu hỏi: ${q.q}\nĐáp án đúng: ${q.correctAnswer}\nGiải thích: ${q.explanation}`
    ).join("\n\n");

    if (rec.actionType === "study") {
      // Lưu context bài học cần ôn vào localStorage rồi navigate tạo lecture
      const studySource = `Chủ đề cần ôn tập: "${rec.title}"

Dựa trên kết quả bài quiz "${quizTitle}", học sinh cần củng cố kiến thức sau:

${weakContent || "Ôn tập tổng quan chủ đề " + quizTitle}

Hãy tạo bài học tập trung vào các điểm yếu trên, giải thích rõ ràng và có ví dụ minh hoạ thực tế.`;

      localStorage.setItem("continueLecture", JSON.stringify({
        title: `Ôn tập: ${rec.title}`,
        content: studySource,
      }));
      navigate("/create-lecture?continue=1");

    } else if (rec.actionType === "quiz") {
      // Lưu context bài quiz về chủ đề yếu rồi navigate tạo quiz
      const quizSource = `Chủ đề cần luyện tập: "${rec.title}"

Học sinh vừa làm quiz "${quizTitle}" và gặp khó khăn với các nội dung sau:

${weakContent || "Chủ đề tổng quan: " + quizTitle}

Hãy tạo bộ câu hỏi trắc nghiệm tập trung vào các điểm yếu này để giúp học sinh cải thiện.`;

      localStorage.setItem("lectureSourceForQuiz", JSON.stringify({
        title: `Luyện tập: ${rec.title}`,
        content: quizSource,
      }));
      navigate("/create-quiz?fromLecture=1");
    }
  };

  // Gọi AI để tạo đề xuất
  const generateAIRecommendations = async (currentData: QuizResultData) => {
    setIsGeneratingRec(true);
    setAiError(null);

    try {
      const wrongQuestions = currentData.questions.filter((q) => !q.isCorrect);
      const correctCount = currentData.correct;
      const totalCount = currentData.total;

      const wrongQuestionsSummary = wrongQuestions.length > 0
        ? wrongQuestions.map((q, i) => `${i + 1}. Câu hỏi: "${q.q}"\n   - Học sinh chọn: "${q.yourAnswer}"\n   - Đáp án đúng: "${q.correctAnswer}"`).join("\n")
        : "Không làm sai câu nào.";

      const prompt = `Bạn là chuyên gia cố vấn học tập AI Scholarly. Hãy phân tích kết quả bài trắc nghiệm sau của học sinh để đưa ra lời khuyên định hướng chuẩn xác:
- Điểm số: ${currentData.score}% (${correctCount}/${totalCount} câu đúng).
- Chi tiết các câu hỏi học sinh làm sai:
${wrongQuestionsSummary}

Dựa trên kết quả thực tế trên, hãy phân tích điểm yếu học thuật và đưa ra đúng 2 đề xuất hành động ôn tập thực tế dưới dạng một mảng JSON duy nhất.
Mỗi đề xuất bắt buộc phải tuân theo cấu trúc schema sau:
[
  {
    "id": 1,
    "title": "Tên chủ đề học sinh cần củng cố (dưới 8 từ, viết ngắn gọn)",
    "description": "Lời khuyên học tập cụ thể: giải thích tại sao làm sai và hướng ôn tập, khoảng 2 câu rõ ràng.",
    "actionText": "NHÃN NÚT HÀNH ĐỘNG VIẾT IN HOA (ví dụ: TẠO BÀI HỌC ÔN TẬP hoặc LUYỆN TẬP TRẮC NGHIỆM)",
    "actionType": "study hoặc quiz — chọn study nếu cần ôn tập lý thuyết bài học, chọn quiz nếu cần tạo thêm bài trắc nghiệm mới để luyện tập"
  }
]

Lưu ý: Chỉ trả về chuỗi JSON thô nằm trong mảng []. KHÔNG bọc trong markdown block \`\`\`json và KHÔNG kèm bất kỳ lời giải thích nào khác ngoài JSON.`;

      const response = await chatWithAI(prompt);
      
      // Parse JSON từ AI
      let cleanedResponse = response.trim();
      // Loại bỏ markdown tags nếu có
      if (cleanedResponse.startsWith("```")) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      }

      const recommendations: AIRecommendation[] = JSON.parse(cleanedResponse);

      if (Array.isArray(recommendations) && recommendations.length > 0) {
        // Đảm bảo mỗi rec có actionType hợp lệ
        const validRecs = recommendations.map(rec => ({
          ...rec,
          actionType: (rec.actionType === "study" || rec.actionType === "quiz") ? rec.actionType : "study" as const
        }));

        const updatedData = {
          ...currentData,
          aiRecommendations: validRecs
        };

        setResultsData(updatedData);
        localStorage.setItem("activeQuizResult", JSON.stringify(updatedData));

        // Cập nhật lại mục lịch sử tương ứng
        if (currentData.historyId) {
          const quizHistory = JSON.parse(localStorage.getItem("quizHistory") || "[]");
          const updatedHistory = quizHistory.map((item: any) => {
            if (item.id === currentData.historyId) {
              return {
                ...item,
                aiRecommendations: validRecs
              };
            }
            return item;
          });
          localStorage.setItem("quizHistory", JSON.stringify(updatedHistory));
        }
      } else {
        throw new Error("Dữ liệu gợi ý từ AI không đúng định dạng mảng.");
      }
    } catch (err: any) {
      console.error("Lỗi khi sinh đề xuất AI:", err);
      setAiError("Không thể tạo đề xuất tự động từ AI. Đang sử dụng các đề xuất mặc định.");
      // Fallback recommendations
      const fallbackRecs: AIRecommendation[] = [
        {
          id: 1,
          title: "Ôn tập kiến thức còn yếu",
          description: "Hãy sử dụng chế độ học tập để AI tạo bài giảng tập trung vào các câu hỏi bạn vừa trả lời chưa chính xác.",
          actionText: "TẠO BÀI HỌC ÔN TẬP",
          actionType: "study"
        },
        {
          id: 2,
          title: "Luyện tập trắc nghiệm mới",
          description: "Tạo một bài quiz mới tập trung vào chủ đề bạn còn yếu để rèn luyện thêm trước khi nâng độ khó.",
          actionText: "LUYỆN TẬP TRẮC NGHIỆM",
          actionType: "quiz"
        }
      ];

      const updatedData = {
        ...currentData,
        aiRecommendations: fallbackRecs
      };
      setResultsData(updatedData);
    } finally {
      setIsGeneratingRec(false);
    }
  };

  useEffect(() => {
    const activeResultStr = localStorage.getItem("activeQuizResult");
    if (activeResultStr) {
      try {
        const parsed: QuizResultData = JSON.parse(activeResultStr);
        setResultsData(parsed);

        // Nếu chưa có gợi ý AI, tự động sinh
        if (!parsed.aiRecommendations || parsed.aiRecommendations.length === 0) {
          generateAIRecommendations(parsed);
        }
        return;
      } catch (err) {
        console.error("Lỗi khi load activeQuizResult:", err);
      }
    }

    // Fallback to mock data
    const mockData: QuizResultData = {
      score: 80,
      time: "12:34",
      correct: 8,
      total: 10,
      quizTitle: "Trắc nghiệm mẫu",
      aiRecommendations: [
        {
          id: 1,
          title: "Chính sách Tiền tệ & Lạm phát",
          description: "Bạn gặp khó khăn trong việc phân biệt các công cụ của NHTW. Hãy xem lại chương 4 trong tài liệu tham khảo.",
          actionText: "TẠO BÀI HỌC ÔN TẬP",
          actionType: "study"
        },
        {
          id: 2,
          title: "Mô hình IS-LM trong Kinh tế mở",
          description: "Sự hiểu biết về tác động của tỷ giá hối đoái còn hạn chế. Bài quiz này cho thấy tỷ lệ sai 60% ở mảng này.",
          actionText: "LUYỆN TẬP TRẮC NGHIỆM",
          actionType: "quiz"
        }
      ],
      questions: [
        {
          id: 1,
          q: "Ngôn ngữ lập trình nào được sử dụng chủ yếu để xây dựng giao diện web?",
          yourAnswer: "JavaScript",
          correctAnswer: "JavaScript",
          isCorrect: true,
          explanation: "JavaScript là ngôn ngữ chuẩn để tạo tính tương tác trên trình duyệt, kết hợp cùng HTML và CSS tạo nên giao diện web động."
        },
        {
          id: 2,
          q: "ReactJS là một thư viện của ngôn ngữ nào?",
          yourAnswer: "TypeScript",
          correctAnswer: "JavaScript",
          isCorrect: false,
          explanation: "Mặc dù ReactJS thường được dùng với TypeScript hiện nay, nhưng bản chất nó là một thư viện của JavaScript, được phát triển bởi Facebook."
        }
      ]
    };
    setResultsData(mockData);
  }, []);

  if (!resultsData) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 font-bold">Đang tải kết quả...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-12">
      {/* Overview Card */}
      <section 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 dark:from-white to-transparent"></div>
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-2">
            <Trophy className="w-8 h-8 text-slate-900 dark:text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Hoàn thành bài thi!</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
            <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <BarChart3 className="w-5 h-5 text-slate-400 mb-3" />
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2">Điểm số</span>
              <div className="text-4xl font-bold text-slate-900 dark:text-white">{resultsData.score}%</div>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <Clock className="w-5 h-5 text-slate-400 mb-3" />
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2">Thời gian</span>
              <div className="text-2xl font-semibold text-slate-900 dark:text-white leading-snug">{formatTime(resultsData.time)}</div>
            </div>

            <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <Target className="w-5 h-5 text-slate-400 mb-3" />
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2">Đúng</span>
              <div className="text-4xl font-semibold text-emerald-600 dark:text-emerald-400">
                {resultsData.correct} <span className="text-xl text-slate-400 dark:text-slate-500">/ {resultsData.total}</span>
              </div>
            </div>

            <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <XCircle className="w-5 h-5 text-slate-400 mb-3" />
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2">Sai</span>
              <div className="text-4xl font-semibold text-rose-600 dark:text-rose-400">
                {resultsData.total - resultsData.correct} <span className="text-xl text-slate-400 dark:text-slate-500">/ {resultsData.total}</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/create-quiz"
              className="px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-5 h-5" /> Tạo Quiz mới
            </Link>
            <button
              onClick={() => {
                const quizTitle = getQuizTitle();
                const wrongQuestions = resultsData.questions.filter(q => !q.isCorrect);
                const studyContent = wrongQuestions.length > 0
                  ? wrongQuestions.map(q => `Câu hỏi: ${q.q}\nĐáp án đúng: ${q.correctAnswer}\nGiải thích: ${q.explanation}`).join("\n\n")
                  : `Ôn tập tổng quan chủ đề: ${quizTitle}`;

                localStorage.setItem("continueLecture", JSON.stringify({
                  title: `Ôn tập: ${quizTitle}`,
                  content: `Chủ đề bài quiz: "${quizTitle}"\nĐiểm số: ${resultsData.score}%\n\nCác nội dung cần ôn tập:\n${studyContent}\n\nHãy tạo bài học giải thích chi tiết các kiến thức trên, đi kèm ví dụ minh hoạ thực tế.`,
                }));
                navigate("/create-lecture?continue=1");
              }}
              className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <BrainCircuit className="w-5 h-5" /> Ôn tập ngay <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-sm"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Đề xuất tư vấn từ AI Scholarly
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Dựa trên phân tích kết quả bài trắc nghiệm của bạn:
            </p>
          </div>
          <Sparkles className={`w-8 h-8 text-slate-400 dark:text-slate-500 shrink-0 mt-1 ${isGeneratingRec ? 'animate-pulse' : ''}`} />
        </div>

        {isGeneratingRec ? (
          <div className="space-y-6">
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-slate-400 animate-pulse"></span>
              AI đang phân tích kết quả bài làm của bạn...
            </div>
            <div className="flex gap-6 items-start animate-pulse">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md w-1/3"></div>
                <div className="h-4 bg-slate-50 dark:bg-slate-800/60 rounded-md w-3/4"></div>
                <div className="h-4 bg-slate-50 dark:bg-slate-800/60 rounded-md w-1/2"></div>
              </div>
            </div>
            <div className="flex gap-6 items-start animate-pulse">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-slate-100 dark:bg-slate-800 rounded-md w-1/4"></div>
                <div className="h-4 bg-slate-50 dark:bg-slate-800/60 rounded-md w-2/3"></div>
                <div className="h-4 bg-slate-50 dark:bg-slate-800/60 rounded-md w-1/2"></div>
              </div>
            </div>
          </div>
        ) : aiError ? (
          <div className="space-y-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-xl text-sm font-semibold">
              {aiError}
            </div>
            {resultsData.aiRecommendations && resultsData.aiRecommendations.length > 0 && (
              <div className="space-y-8">
                {resultsData.aiRecommendations.map((rec) => (
                  <div key={rec.id} className="flex gap-6 items-start">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-2xl text-slate-900 dark:text-white shrink-0">
                      {rec.id.toString().padStart(2, '0')}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                        {rec.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                        {rec.description}
                      </p>
                      <div className="pt-2">
                        <button 
                          onClick={() => handleRecommendationAction(rec)}
                          className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b-2 border-transparent hover:border-slate-900 dark:hover:border-white transition-colors pb-0.5 cursor-pointer"
                        >
                          {rec.actionType === "study" ? <BookOpen className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                          {rec.actionText} <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : resultsData.aiRecommendations && resultsData.aiRecommendations.length > 0 ? (
          <div className="space-y-8">
            {resultsData.aiRecommendations.map((rec) => (
              <div key={rec.id} className="flex gap-6 items-start hover:translate-x-1 transition-transform duration-200">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-bold text-2xl text-slate-900 dark:text-white shrink-0">
                  {rec.id.toString().padStart(2, '0')}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {rec.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                    {rec.description}
                  </p>
                  <div className="pt-2">
                    <button 
                      onClick={() => handleRecommendationAction(rec)}
                      className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b-2 border-transparent hover:border-slate-900 dark:hover:border-white transition-colors pb-0.5 cursor-pointer"
                    >
                      {rec.actionType === "study" ? <BookOpen className="w-4 h-4" /> : <RefreshCw className="w-4 h-4" />}
                      {rec.actionText} <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* Detailed Review */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Chi tiết bài làm
          </h2>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {resultsData.questions.length} câu hỏi
          </span>
        </div>
        
        <div className="space-y-6">
          {resultsData.questions.map((q, idx) => (
            <div 
              key={q.id} 
              className={`bg-white dark:bg-slate-900 rounded-2xl border ${
                q.isCorrect ? 'border-emerald-200 dark:border-emerald-900/50' : 'border-rose-200 dark:border-rose-900/50'
              } p-6 shadow-sm overflow-hidden relative`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                q.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
              }`}></div>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {q.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-500" />
                  )}
                </div>
                <div className="flex-1 space-y-5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
                    <span className="text-slate-400 dark:text-slate-500 mr-2">{idx + 1}.</span>
                    {q.q}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Bạn chọn:</span>
                      <span className={`font-semibold text-base ${
                        q.isCorrect 
                          ? 'text-emerald-700 dark:text-emerald-400' 
                          : 'text-rose-700 dark:text-rose-400'
                      }`}>
                        {q.yourAnswer}
                      </span>
                    </div>
                    {!q.isCorrect && (
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Đáp án đúng:</span>
                        <span className="font-semibold text-base text-emerald-700 dark:text-emerald-400">
                          {q.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>

                  {q.explanation && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mt-4 flex gap-3">
                      <BrainCircuit className="w-5 h-5 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-white block mb-1">AI Giải thích:</span>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default QuizResult;
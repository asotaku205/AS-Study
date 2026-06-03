import { CheckCircle } from "lucide-react";
import Question from "../components/users/quiz/Question";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/users/ChatBox";
import { saveQuizResult } from "../services/quizzService";
import { getCurrentUserId } from "../services/authService";
type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  explanation?: string;
};

const QuizMode = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentQuestionIdx, setCurrrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [mockQuiz, setMockQuiz] = useState<QuizQuestion[]>([]);
  const [quizTitle, setQuizTitle] = useState("Trắc nghiệm ôn tập");
  const [documentId, setDocumentId] = useState<number | undefined>(undefined);

  const navigate = useNavigate();
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const activeQuizStr = localStorage.getItem("activeQuiz");
    if (activeQuizStr) {
      try {
        const parsed = JSON.parse(activeQuizStr);
        if (parsed.questions && parsed.questions.length > 0) {
          setMockQuiz(parsed.questions);
          if (parsed.title) {
            setQuizTitle(parsed.title);
          }
          if (parsed.documentId) {
            setDocumentId(Number(parsed.documentId));
          }
          return;
        }
      } catch (err) {
        console.error("Lỗi khi load activeQuiz:", err);
      }
    }

    // Fallback to mock data
    setMockQuiz([
      {
        id: 1,
        question:
          "Ngôn ngữ lập trình nào được sử dụng chủ yếu để xây dựng giao diện web?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correctAnswer: 2,
        hint: "Đây là ngôn ngữ duy nhất chạy mặc định trên trình duyệt web.",
        explanation: "JavaScript là ngôn ngữ chuẩn để tạo tính tương tác trên trình duyệt, kết hợp cùng HTML và CSS tạo nên giao diện web động."
      },
      {
        id: 2,
        question: "ReactJS là một thư viện của ngôn ngữ nào?",
        options: ["TypeScript", "PHP", "JavaScript", "Ruby"],
        correctAnswer: 2,
        hint: "Hãy nghĩ về ngôn ngữ mà bạn vừa chọn ở câu hỏi trước.",
        explanation: "Mặc dù ReactJS thường được dùng với TypeScript hiện nay, nhưng bản chất nó là một thư viện của JavaScript, được phát triển bởi Facebook."
      },
      {
        id: 3,
        question: "NodeJS cho phép chạy JavaScript ở đâu?",
        options: ["Trình duyệt", "Mobile", "Máy chủ (Server-side)", "Desktop"],
        correctAnswer: 2,
        hint: "Nó giúp JavaScript thoát khỏi môi trường trình duyệt để xử lý backend.",
        explanation: "NodeJS là môi trường runtime mã nguồn mở, cho phép chạy JavaScript ở phía server-side ngoài trình duyệt."
      },
    ]);
  }, []);

  const handlePrev = () => {
    setCurrrentQuestionIdx((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrrentQuestionIdx((prev) => Math.min(prev + 1, mockQuiz.length - 1));
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitQuiz = async () => {
    if (mockQuiz.length === 0) return;

    let correctCount = 0;
    const questionsResult = mockQuiz.map((q) => {
      const userAnswerIdx = answers[q.id];
      const isCorrect = userAnswerIdx === q.correctAnswer;
      if (isCorrect) {
        correctCount++;
      }

      return {
        id: q.id,
        q: q.question,
        yourAnswer: userAnswerIdx !== undefined ? q.options[userAnswerIdx] : "Không trả lời",
        correctAnswer: q.options[q.correctAnswer],
        isCorrect,
        explanation: q.explanation || "Giải thích cho câu hỏi này."
      };
    });

    const score = Math.round((correctCount / mockQuiz.length) * 100);

    const timeTakenMs = Date.now() - startTime;
    const minutes = Math.floor(timeTakenMs / 60000);
    const seconds = Math.floor((timeTakenMs % 60000) / 1000);
    const timeString = minutes > 0 ? `${minutes} phút ${seconds} giây` : `${seconds} giây`;

    const quizResult = {
      score,
      time: timeString,
      correct: correctCount,
      total: mockQuiz.length,
      aiRecommendations: [], // Sẽ được sinh động từ AI ở trang kết quả
      questions: questionsResult,
      quizTitle: quizTitle
    };

    localStorage.setItem("activeQuizResult", JSON.stringify(quizResult));

    // Cập nhật điểm số và thông tin câu hỏi trong lịch sử của quiz này
    const userId = getCurrentUserId();
    const historyKey = userId ? `quizHistory_${userId}` : "quizHistory";
    const quizHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
    const activeQuizStr = localStorage.getItem("activeQuiz");
    let targetHistoryId: number | null = null;
    let quizDifficulty = "Medium";

    if (activeQuizStr) {
      try {
        const parsed = JSON.parse(activeQuizStr);
        if (parsed.historyId) {
          targetHistoryId = parsed.historyId;
        }
        if (parsed.difficulty) {
          quizDifficulty = parsed.difficulty;
        }
      } catch (e) {
        console.error("Lỗi parse activeQuiz:", e);
      }
    }

    // Nếu không tìm thấy historyId cụ thể, dùng ID đầu tiên làm fallback
    if (!targetHistoryId && quizHistory.length > 0) {
      targetHistoryId = quizHistory[0].id;
    }

    const updatedHistory = quizHistory.map((item: any) => {
      if (item.id === targetHistoryId) {
        return {
          ...item,
          score: `${score}%`,
          date: new Date().toISOString(),
          questions: mockQuiz.map((q) => {
            const userAnswerIdx = answers[q.id];
            return {
              id: q.id,
              q: q.question,
              options: q.options,
              yourAnswer: userAnswerIdx !== undefined ? q.options[userAnswerIdx] : "Không trả lời",
              correctAnswer: q.options[q.correctAnswer],
              isCorrect: userAnswerIdx === q.correctAnswer,
              explanation: q.explanation || "Giải thích cho câu hỏi này."
            };
          })
        };
      }
      return item;
    });
    localStorage.setItem(historyKey, JSON.stringify(updatedHistory));

    // Call API to save to database
    try {
      // Map difficulty sang đúng định dạng chữ hoa đầu dòng hoặc chuẩn của DB
      const formattedDiff = quizDifficulty.charAt(0).toUpperCase() + quizDifficulty.slice(1);
      // Save the original mockQuiz (with options) so retaking old quizzes works correctly
      await saveQuizResult(quizTitle, formattedDiff, mockQuiz.length, score, mockQuiz);
    } catch (err) {
      console.error("Lỗi khi lưu quiz result lên server:", err);
    }

    navigate("/quiz-result");
  };

  if (mockQuiz.length === 0) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <p className="text-slate-500 dark:text-slate-400 font-bold">Đang tải câu hỏi...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Quiz Area  */}
      <div className="flex-1 lg:flex-2 flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
        <Question
          currentQuestionIdx={currentQuestionIdx}
          mockQuiz={mockQuiz}
          answers={answers}
          onSelectOption={handleSelectOption}
          isChatOpen={isChatOpen}
          setIsChatOpen={setIsChatOpen}
        />

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <button
            onClick={handlePrev}
            disabled={currentQuestionIdx === 0}
            className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Quay lại
          </button>

          {currentQuestionIdx === mockQuiz.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              className="flex items-center gap-2 px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
            >
              <CheckCircle className="w-5 h-5" />
              Nộp bài
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
            >
              Tiếp theo
            </button>
          )}
        </div>
      </div>

      {/* Chatbot Area */}
      {isChatOpen && <ChatBox setIsChatOpen={setIsChatOpen} documentId={documentId} />}
    </div>
  );
};

export default QuizMode;
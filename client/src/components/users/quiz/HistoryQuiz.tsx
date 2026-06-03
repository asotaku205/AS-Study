import { CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "../../../services/authService";
import { getMyQuizzes } from "../../../services/quizzService";

type RecentQuiz = {
  id: number;
  title: string;
  date: string;
  score: string;
  questions: any[];
  difficulty?: string;
  aiRecommendations?: any[];
};

const formatTimeAgo = (dateStr: string) => {
  if (!dateStr) return "Vừa xong";
  if (!dateStr.includes("-") && !dateStr.includes("/")) return dateStr;
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} giờ trước`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};

const HistoryQuiz = () => {
  const [quizzes, setQuizzes] = useState<RecentQuiz[]>([]);
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const historyKey = userId ? `quizHistory_${userId}` : "quizHistory";

  useEffect(() => {
    getMyQuizzes()
      .then((data) => {
        const formatted = data.map((item: any) => ({
          id: item.id,
          title: item.topic,
          date: item.createdAt,
          score: item.score !== null ? `${item.score}%` : "--",
          questions: item.questions || [],
          difficulty: item.difficulty,
        }));
        setQuizzes(formatted);
      })
      .catch((err) => {
        console.error("Lỗi khi tải quizzes từ DB:", err);
        const quizHistoryStr = localStorage.getItem(historyKey);
        if (quizHistoryStr) {
          try {
            const parsed = JSON.parse(quizHistoryStr);
            setQuizzes(parsed);
          } catch (localErr) {
            console.error("Lỗi khi parse local quizHistory:", localErr);
          }
        }
      });
  }, [historyKey]);

  const handleRetakeQuiz = (quiz: RecentQuiz) => {
    if (!quiz.questions || quiz.questions.length === 0) return;
    // Guard against old result-format data (missing options array)
    const hasOptions = quiz.questions.every((q: any) => Array.isArray(q.options));
    if (!hasOptions) {
      alert("Quiz này được lưu theo định dạng cũ và không thể làm lại. Vui lòng tạo quiz mới.");
      return;
    }
    const newHistoryId = Date.now();

    // Thêm một lượt làm mới vào đầu lịch sử
    const quizHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
    const newHistoryItem = {
      id: newHistoryId,
      title: quiz.title,
      date: new Date().toISOString(),
      score: "--",
      questions: quiz.questions,
      difficulty: quiz.difficulty || "basic"
    };
    localStorage.setItem(historyKey, JSON.stringify([newHistoryItem, ...quizHistory]));

    // Thiết lập active quiz
    localStorage.setItem("activeQuiz", JSON.stringify({
      title: quiz.title,
      questions: quiz.questions,
      historyId: newHistoryId,
      difficulty: quiz.difficulty || "basic"
    }));
    navigate("/quiz");
  };

  const handleViewResult = (quiz: RecentQuiz) => {
    if (!quiz.questions || quiz.questions.length === 0) return;

    const scoreVal = parseInt(quiz.score) || 0;
    const correctCount = Math.round((scoreVal / 100) * quiz.questions.length);

    const quizResult = {
      score: scoreVal,
      time: quiz.date || "Vừa xong",
      correct: correctCount,
      total: quiz.questions.length,
      aiRecommendations: quiz.aiRecommendations || [],
      questions: quiz.questions.map((q) => {
        // If already structured from a previous result view
        if (q.q && q.yourAnswer) {
          return q;
        }
        // Fallback structures
        return {
          id: q.id,
          q: q.question || q.q,
          yourAnswer: q.yourAnswer || "Không trả lời",
          correctAnswer: q.correctAnswer || (q.options ? q.options[q.correctAnswerIdx] : ""),
          isCorrect: q.isCorrect !== undefined ? q.isCorrect : (q.yourAnswer === q.correctAnswer),
          explanation: q.explanation || "Giải thích cho câu hỏi này."
        };
      }),
      historyId: quiz.id,
      quizTitle: quiz.title
    };

    localStorage.setItem("activeQuizResult", JSON.stringify(quizResult));
    navigate("/quiz-result");
  };

  return (
    <div className="lg:col-span-1 ">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          Các Quiz gần đây
        </h2>
        <div className="space-y-4 max-h-[580px] overflow-y-auto ">
          {quizzes.map((quiz) => {
            const hasQuestions = quiz.questions && quiz.questions.length > 0;
            return (
              <div
                key={quiz.id}
                className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all group"
              >
                <h3
                  onClick={() => hasQuestions && handleRetakeQuiz(quiz)}
                  className={`font-bold text-slate-900 dark:text-white transition-colors line-clamp-2 ${hasQuestions ? 'cursor-pointer group-hover:text-slate-600 dark:group-hover:text-slate-300' : ''}`}
                >
                  {quiz.title}
                </h3>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatTimeAgo(quiz.date)}
                    </span>
                  </div>
                  <span className={`text-sm font-black px-2 py-1 rounded-md shadow-sm ${quiz.score === "--"
                    ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                    : "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                    }`}>
                    {quiz.score}
                  </span>
                </div>
                {hasQuestions && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleRetakeQuiz(quiz)}
                      className="text-center py-2 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Làm lại
                    </button>
                    <button
                      onClick={() => handleViewResult(quiz)}
                      className="text-center py-2 bg-slate-900 dark:bg-white border-2 border-slate-900 dark:border-white rounded-lg text-xs font-bold text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
                    >
                      Kết quả
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryQuiz;

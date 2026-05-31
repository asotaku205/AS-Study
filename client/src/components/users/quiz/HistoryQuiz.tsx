import { CheckCircle2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type RecentQuiz = {
  id: number;
  title: string;
  date: string;
  score: string;
  questions: any[];
};

const HistoryQuiz = () => {
  const [quizzes, setQuizzes] = useState<RecentQuiz[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const quizHistoryStr = localStorage.getItem("quizHistory");
    if (quizHistoryStr) {
      try {
        const parsed = JSON.parse(quizHistoryStr);
        setQuizzes(parsed);
        return;
      } catch (err) {
        console.error("Lỗi khi load quizHistory:", err);
      }
    }

    // Fallback to mock history
    setQuizzes([
      {
        id: 1,
        title: "Quiz về Lịch sử Việt Nam",
        date: "1 ngày trước",
        score: "85%",
        questions: []
      },
      {
        id: 2,
        title: "Quiz về Toán học cơ bản",
        date: "2 ngày trước",
        score: "92%",
        questions: []
      },
      {
        id: 3,
        title: "Quiz về Văn học thế giới",
        date: "Tuần trước",
        score: "78%",
        questions: []
      },
    ]);
  }, []);

  const handleRetakeQuiz = (quiz: RecentQuiz) => {
    if (!quiz.questions || quiz.questions.length === 0) return;
    localStorage.setItem("activeQuiz", JSON.stringify({
      title: quiz.title,
      questions: quiz.questions
    }));
    navigate("/quiz");
  };

  const handleViewResult = (quiz: RecentQuiz) => {
    if (!quiz.questions || quiz.questions.length === 0) return;
    
    // Tạo cấu trúc kết quả giả định hoặc thật để hiển thị
    const scoreVal = parseInt(quiz.score) || 0;
    const correctCount = Math.round((scoreVal / 100) * quiz.questions.length);

    const quizResult = {
      score: scoreVal,
      time: "Lưu lịch sử",
      correct: correctCount,
      total: quiz.questions.length,
      aiRecommendations: [
        {
          id: 1,
          title: `Chủ đề: ${quiz.title}`,
          description: `Xem lại chi tiết bài làm cũ của bạn.`,
          actionText: "Vào chế độ học tập",
          actionLink: "/study"
        }
      ],
      questions: quiz.questions.map((q) => ({
        id: q.id,
        q: q.question,
        yourAnswer: q.options[q.correctAnswer], // Giả định là chọn đúng để review
        correctAnswer: q.options[q.correctAnswer],
        isCorrect: true,
        explanation: q.explanation || "Giải thích cho câu hỏi này."
      }))
    };

    localStorage.setItem("activeQuizResult", JSON.stringify(quizResult));
    navigate("/quiz-result");
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          Các Quiz gần đây
        </h2>
        <div className="space-y-4">
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
                      <Clock className="w-3 h-3" /> {quiz.date}
                    </span>
                  </div>
                  <span className="text-sm font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2 py-1 rounded-md shadow-sm">
                    {quiz.score}
                  </span>
                </div>
                {hasQuestions && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleRetakeQuiz(quiz)}
                      className="text-center py-2 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      Làm lại
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

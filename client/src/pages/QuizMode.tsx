import { CheckCircle } from "lucide-react";
import Question from "../components/users/quiz/Question";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/users/ChatBox";

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

  const navigate = useNavigate();

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

  const handleSubmitQuiz = () => {
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

    const quizResult = {
      score,
      time: new Date().toLocaleTimeString("vi-VN", { minute: "2-digit", second: "2-digit" }),
      correct: correctCount,
      total: mockQuiz.length,
      aiRecommendations: [
        {
          id: 1,
          title: `Chủ đề: ${quizTitle}`,
          description: score >= 80 
            ? `Tuyệt vời! Bạn đã nắm vững kiến thức với tỷ lệ trả lời đúng đạt ${score}%.` 
            : `Bạn trả lời đúng ${correctCount}/${mockQuiz.length} câu hỏi. Hãy xem lại các câu trả lời sai bên dưới để ôn tập tốt hơn.`,
          actionText: "Vào chế độ học tập",
          actionLink: "/study"
        }
      ],
      questions: questionsResult
    };

    localStorage.setItem("activeQuizResult", JSON.stringify(quizResult));

    // Cập nhật điểm số trong lịch sử của quiz này
    const quizHistory = JSON.parse(localStorage.getItem("quizHistory") || "[]");
    if (quizHistory.length > 0) {
      // Giả sử quiz vừa làm là phần tử đầu tiên
      quizHistory[0].score = `${score}%`;
      localStorage.setItem("quizHistory", JSON.stringify(quizHistory));
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
      {isChatOpen && <ChatBox setIsChatOpen={setIsChatOpen} />}
    </div>
  );
};

export default QuizMode;
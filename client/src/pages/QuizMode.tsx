import { CheckCircle} from "lucide-react";
import Question from "../components/users/quiz/Question";
import ChatQuiz from "../components/users/quiz/ChatQuiz";
import { useState } from "react";

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
};

const QuizMode = () => {
    const [currentQuestionIdx, setCurrrentQuestionIdx] = useState(0);
    const mockQuiz: QuizQuestion[] = [
        {
          id: 1,
          question:
            "Ngôn ngữ lập trình nào được sử dụng chủ yếu để xây dựng giao diện web?",
          options: ["Python", "Java", "JavaScript", "C++"],
          correctAnswer: 2,
          hint: "Đây là ngôn ngữ duy nhất chạy mặc định trên trình duyệt web.",
        },
        {
          id: 2,
          question: "ReactJS là một thư viện của ngôn ngữ nào?",
          options: ["TypeScript", "PHP", "JavaScript", "Ruby"],
          correctAnswer: 2,
          hint: "Hãy nghĩ về ngôn ngữ mà bạn vừa chọn ở câu hỏi trước.",
        },
        {
          id: 3,
          question: "NodeJS cho phép chạy JavaScript ở đâu?",
          options: ["Trình duyệt", "Mobile", "Máy chủ (Server-side)", "Desktop"],
          correctAnswer: 2,
          hint: "Nó giúp JavaScript thoát khỏi môi trường trình duyệt để xử lý backend.",
        },
      ];

  const handlePrev = () => {
    setCurrrentQuestionIdx((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrrentQuestionIdx((prev) => Math.min(prev + 1, mockQuiz.length - 1));
  };

  const handleSubmitQuiz = () => {
    console.log("Submit quiz");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Quiz Area  */}
      <div className="flex-1 lg:flex-[2] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
        
        <Question currentQuestionIdx={currentQuestionIdx}  mockQuiz={mockQuiz}/>     

   

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
      <ChatQuiz/>
    </div>
  )
}

export default QuizMode
import { Sparkles, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";

type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
};

type QuestionProps = {
  currentQuestionIdx: number;
  mockQuiz: QuizQuestion[];
};

const Question = ({
  currentQuestionIdx,
  mockQuiz,
  isChatOpen,
  setIsChatOpen,
}: QuestionProps & {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
}) => {
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const currentQ = mockQuiz[currentQuestionIdx];
  const handleToggleHint = () => {
    setShowHint((prev) => ({ ...prev, [currentQ.id]: !prev[currentQ.id] }));
  };

  const handleSelectOption = (optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: optionIdx }));
  };

  return (
    <>
      <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
        <div>
          <h2 className="font-bold text-slate-800 dark:text-slate-200">
            Quiz: Cơ bản về Web Development
          </h2>
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Câu {currentQuestionIdx + 1} / {mockQuiz.length}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-lg font-mono font-bold shadow-sm">
            <Clock className="w-4 h-4" />
            <span>00:00</span>
          </div>
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Mở Trợ lý AI</span>
            </button>
          )}
        </div>
      </div>
      <div className="p-8 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.question}
            </h3>
            {!showHint[currentQ.id] && (
              <button
                onClick={handleToggleHint}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 border border-slate-200 dark:border-slate-700"
              >
                <Sparkles className="w-4 h-4" />
                Gợi ý
              </button>
            )}
          </div>

          {showHint[currentQ.id] && (
            <div className="overflow-hidden">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl flex gap-3 text-slate-800 dark:text-slate-200">
                <Sparkles className="w-5 h-5 shrink-0 mt-0.5 text-slate-500 dark:text-slate-400" />
                <div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                    AI Gợi ý
                  </span>
                  <p className="text-sm font-medium leading-relaxed">
                    {currentQ.hint}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {currentQ.options.map((opt, idx) => {
            const isSelected = answers[currentQ.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  isSelected
                    ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white"
                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected
                        ? "border-slate-900 dark:border-white"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {isSelected && (
                      <div className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white" />
                    )}
                  </div>
                  {opt}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Question;

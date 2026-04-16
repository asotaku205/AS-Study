import { FileText, Settings2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
const SettingQuiz = () => {
    const [difficulty, setDifficulty] = useState<"basic" | "advanced" | "expert">(
    "basic",
  );
  const [questionCount, setQuestionCount] = useState(5);
  return (
    <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                Cấu hình Quiz
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-4">
                    Số lượng câu hỏi
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="1"
                      value={questionCount}
                      onChange={(e) =>
                        setQuestionCount(parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-900 dark:accent-white"
                    />
                    <span className="font-bold text-slate-900 dark:text-white min-w-[3rem] text-center bg-slate-100 dark:bg-slate-800 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                      {questionCount}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 dark:text-white mb-4">
                    Độ khó
                  </label>
                  <div className="flex gap-2">
                    {["Cơ bản", "Nâng cao", "Chuyên gia"].map((level, idx) => {
                      const val = ["basic", "advanced", "expert"][idx];
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() =>
                            setDifficulty(
                              val as "basic" | "advanced" | "expert",
                            )
                          }
                          className={`flex-1 py-2.5 px-3 text-sm rounded-lg font-bold transition-colors border-2 ${
                            difficulty === val
                              ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900 shadow-sm"
                              : "border-transparent bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                          }`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>
  )
}

export default SettingQuiz
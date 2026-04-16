import { FileText, Settings2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import TextInput from "../components/users/TextInput";
import UploadZone from "../components/users/UploadZone";
const CreateQuiz = () => {
  const [difficulty, setDifficulty] = useState<"basic" | "advanced" | "expert">(
    "basic",
  );
  const [questionCount, setQuestionCount] = useState(5);

  const [inputType, setInputType] = useState<"text" | "file">("text");
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Tạo Trắc Nghiệm Mới
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Tạo trắc nghiệm mới từ tài liệu của bạn hoặc ôn tập lại các bài đã
          làm.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form Creation */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={() => {}}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8"
          >
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                Nguồn tài liệu
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setInputType("text")}
                  className={`p-4 rounded-xl border-2 text-center transition-all font-bold ${
                    inputType === "text"
                      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900 shadow-sm"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Văn bản / Từ khóa
                </button>
                <button
                  type="button"
                  onClick={() => setInputType("file")}
                  className={`p-4 rounded-xl border-2 text-center transition-all font-bold ${
                    inputType === "file"
                      ? "border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900 shadow-sm"
                      : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Tải file lên
                </button>
              </div>

              {inputType === "text" ? (
                <TextInput />
              ) : (
                <UploadZone file={null} setFile={() => {}} />
              )}
            </section>

            <hr className="border-slate-200 dark:border-slate-800" />

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

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg w-full md:w-auto justify-center"
              >
                <Sparkles className="w-5 h-5" />
                Tạo Quiz bằng AI
              </button>
            </div>
          </form>
        </div>

        {/* History  */}
      </div>
    </div>
  );
};

export default CreateQuiz;

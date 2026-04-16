import { Settings2, BrainCircuit, Target, Lightbulb } from "lucide-react";
import { useState } from "react";
const SettingLecture = () => {
  const [studyMode, setStudyMode] = useState<
    "comprehensive" | "summary" | "practical"
  >("comprehensive");

  return (
    <section className="relative z-10">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Settings2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        Chế độ biên soạn bài giảng
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          type="button"
          onClick={() => setStudyMode("comprehensive")}
          className={`p-5 rounded-xl border-2 text-left transition-all ${
            studyMode === "comprehensive"
              ? "border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800 shadow-sm"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
          }`}
        >
          <BrainCircuit
            className={`w-6 h-6 mb-3 ${studyMode === "comprehensive" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
          />
          <h3
            className={`font-bold mb-2 ${studyMode === "comprehensive" ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}
          >
            Chi tiết & Chuyên sâu
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Đầy đủ lý thuyết, phân tích cặn kẽ từng khái niệm nhỏ.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStudyMode("summary")}
          className={`p-5 rounded-xl border-2 text-left transition-all ${
            studyMode === "summary"
              ? "border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800 shadow-sm"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
          }`}
        >
          <Target
            className={`w-6 h-6 mb-3 ${studyMode === "summary" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
          />
          <h3
            className={`font-bold mb-2 ${studyMode === "summary" ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}
          >
            Tóm tắt Nhanh
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Chỉ tập trung vào các ý chính, bullet point dễ nhớ.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStudyMode("practical")}
          className={`p-5 rounded-xl border-2 text-left transition-all ${
            studyMode === "practical"
              ? "border-slate-900 bg-slate-50 dark:border-white dark:bg-slate-800 shadow-sm"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
          }`}
        >
          <Lightbulb
            className={`w-6 h-6 mb-3 ${studyMode === "practical" ? "text-slate-900 dark:text-white" : "text-slate-500 dark:text-slate-400"}`}
          />
          <h3
            className={`font-bold mb-2 ${studyMode === "practical" ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}
          >
            Thiên về Ứng dụng
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            Nhiều ví dụ thực tế, case study và bài tập tình huống.
          </p>
        </button>
      </div>
    </section>
  );
};

export default SettingLecture;

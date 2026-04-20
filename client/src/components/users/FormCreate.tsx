import { FileText, Sparkles, BookOpen } from "lucide-react";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UploadZone from "./UploadZone";
import SettingLecture from "./lecture/SettingLecture";
import SettingQuiz from "./quiz/SettingQuiz";

const FormCreate = ({ typeMode }: { typeMode: string }) => {
  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-2 space-y-6">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 pointer-events-none text-slate-900 dark:text-white">
          <BookOpen className="w-48 h-48" />
        </div>

        <section className="relative z-10">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            {typeMode === "quiz" ? "Nguồn trắc nghiệm" : "Nguồn kiến thức"}
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
            <textarea
              className="w-full p-5 border border-slate-300 dark:border-slate-700 rounded-xl min-h-[160px] focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-slate-900 dark:focus:border-white outline-none resize-y bg-slate-50 dark:bg-slate-950 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white font-medium"
              placeholder="Nhập nội dung cần học, dán văn bản hoặc gõ từ khóa chủ đề vào đây..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          ) : (
            <UploadZone file={null} setFile={() => {}} />
          )}
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Setting */}
        {typeMode === "lecture" ? <SettingLecture /> : <SettingQuiz />}

        <div className="pt-4 flex justify-end relative z-10">
          <button
            type="submit"
            onClick={() => {
              typeMode === "lecture"
                ? navigate("/create-lecture")
                : navigate("/quiz");
            }}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg w-full md:w-auto justify-center"
          >
            <Sparkles className="w-5 h-5" />
            {typeMode === "lecture" ? "Tạo bài giảng AI" : "Tạo trắc nghiệm AI"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormCreate;

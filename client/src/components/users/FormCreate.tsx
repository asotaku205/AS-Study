import { FileText, Sparkles, BookOpen } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import UploadZone from "./UploadZone";
import SettingLecture from "./lecture/SettingLecture";
import SettingQuiz from "./quiz/SettingQuiz";
import { getUserProfile } from "../../services/userService";
import { uploadDocument, runOcrForDocument } from "../../services/documentService";
import { generateAIQuiz, generateAILecture } from "../../services/chatService";

const FormCreate = ({ typeMode }: { typeMode: string }) => {
  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [topic, setTopic] = useState("");
  
  // States lifted for settings & uploading
  const [file, setFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<"basic" | "advanced" | "expert">("basic");
  const [questionCount, setQuestionCount] = useState(5);
  const [studyMode, setStudyMode] = useState<"comprehensive" | "summary" | "practical">("comprehensive");
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    let sourceText = topic;

    setIsGenerating(true);
    try {
      if (inputType === "file") {
        if (!file) {
          toast.error("Vui lòng tải lên một tài liệu.");
          setIsGenerating(false);
          return;
        }

        toast.info("Đang tải tài liệu lên hệ thống...");
        // 1. Lấy user profile
        const profile = await getUserProfile();
        const ownerUserId = profile.id;

        // 2. Tạo FormData và upload document
        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name);
        formData.append("description", `Tài liệu tự động tạo ${typeMode === 'quiz' ? 'quiz' : 'bài giảng'}`);
        formData.append("ownerUserId", String(ownerUserId));
        formData.append("categoryId", "1"); // Mặc định categoryId là 1
        formData.append("visibility", "private"); // Luôn luôn là private

        const uploadedDoc = await uploadDocument(formData);
        
        toast.info("Đang trích xuất chữ (OCR) từ tài liệu...");
        // 3. Chạy OCR
        const ocrResult = await runOcrForDocument(uploadedDoc.id);
        sourceText = ocrResult.ocrText || "";

        if (!sourceText.trim()) {
          throw new Error("Không thể trích xuất chữ từ tài liệu này. Vui lòng thử tài liệu khác hoặc nhập văn bản trực tiếp.");
        }
      } else {
        if (!sourceText.trim()) {
          toast.error("Vui lòng nhập văn bản hoặc từ khóa chủ đề.");
          setIsGenerating(false);
          return;
        }
      }

      if (typeMode === "quiz") {
        toast.info("AI Scholarly đang biên soạn bộ câu hỏi trắc nghiệm...");
        const quizData = await generateAIQuiz(sourceText, difficulty, questionCount);
        
        // Lưu quiz vào localStorage để QuizMode load lên
        localStorage.setItem("activeQuiz", JSON.stringify({
          title: inputType === 'file' ? file?.name : `Quiz về ${topic.slice(0, 30)}...`,
          questions: quizData.questions
        }));

        // Lưu vào lịch sử để HistoryQuiz hiển thị
        const quizHistory = JSON.parse(localStorage.getItem("quizHistory") || "[]");
        const newHistoryItem = {
          id: Date.now(),
          title: inputType === 'file' ? file?.name : `Quiz về ${topic.slice(0, 30)}...`,
          date: "Vừa xong",
          score: "--",
          questions: quizData.questions
        };
        localStorage.setItem("quizHistory", JSON.stringify([newHistoryItem, ...quizHistory]));

        toast.success("Tạo Quiz thành công!");
        navigate("/quiz");
      } else {
        toast.info("AI Scholarly đang soạn giáo án bài học cho bạn...");
        const lectureData = await generateAILecture(sourceText, studyMode);

        // Lưu lecture vào localStorage để StudyMode load lên
        localStorage.setItem("activeLecture", JSON.stringify({
          title: lectureData.title || (inputType === 'file' ? file?.name : `Bài học về ${topic.slice(0, 30)}...`),
          content: lectureData.content
        }));

        // Lưu vào lịch sử để HistoryLecture hiển thị
        const lectureHistory = JSON.parse(localStorage.getItem("lectureHistory") || "[]");
        const newHistoryItem = {
          id: Date.now(),
          title: lectureData.title || (inputType === 'file' ? file?.name : `Bài học về ${topic.slice(0, 30)}...`),
          date: "Vừa xong",
          progress: "0%",
          content: lectureData.content
        };
        localStorage.setItem("lectureHistory", JSON.stringify([newHistoryItem, ...lectureHistory]));

        toast.success("Biên soạn bài giảng thành công!");
        navigate("/study");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Đã xảy ra lỗi khi tạo dữ liệu AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      <form
        onSubmit={handleSubmit}
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
              disabled={isGenerating}
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
              disabled={isGenerating}
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
              disabled={isGenerating}
              required
            />
          ) : (
            <UploadZone file={file} setFile={setFile} />
          )}
        </section>

        <hr className="border-slate-200 dark:border-slate-800" />

        {/* Setting */}
        {typeMode === "lecture" ? (
          <SettingLecture studyMode={studyMode} setStudyMode={setStudyMode} />
        ) : (
          <SettingQuiz
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
          />
        )}

        <div className="pt-4 flex justify-end relative z-10">
          <button
            type="submit"
            disabled={isGenerating || (inputType === "text" && !topic.trim()) || (inputType === "file" && !file)}
            className="flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg w-full md:w-auto justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <CircularProgress aria-label="Loading…" size={20} color="inherit" />
                <span>AI Scholarly đang soạn bài...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{typeMode === "lecture" ? "Tạo bài giảng AI" : "Tạo trắc nghiệm AI"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormCreate;

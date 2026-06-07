import { FileText, Sparkles, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import UploadZone from "./UploadZone";
import SettingLecture from "./lecture/SettingLecture";
import SettingQuiz from "./quiz/SettingQuiz";
import { getUserProfile } from "../../services/userService";
import { uploadDocument, runOcrForDocument, getDocumentById } from "../../services/documentService";
import { generateAIQuiz, generateAILecture } from "../../services/chatService";
import { getCurrentUserId } from "../../services/authService";
import { saveLecture } from "../../services/lectureService";
import { saveQuizResult } from "../../services/quizzService";
import type { Document } from "../../types/documentTypes";

// Kiểu dữ liệu cho context bài học
interface LectureContext {
  title: string;
  content: string | null;
  documentId?: number;
}

const FormCreate = ({ typeMode }: { typeMode: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const docIdParam = queryParams.get("docId");
  const topicParam = queryParams.get("topic");
  // ?continue=1 → học tiếp từ bài học cũ
  const continueParam = queryParams.get("continue");
  // ?fromLecture=1 → tạo quiz từ nội dung bài học
  const fromLectureParam = queryParams.get("fromLecture");

  const [inputType, setInputType] = useState<"text" | "file">("text");
  const [topic, setTopic] = useState(topicParam || "");
  
  // States lifted for settings & uploading
  const [file, setFile] = useState<File | null>(null);
  const [difficulty, setDifficulty] = useState<"basic" | "advanced" | "expert">("basic");
  const [questionCount, setQuestionCount] = useState(5);
  const [studyMode, setStudyMode] = useState<"comprehensive" | "summary" | "practical">("comprehensive");
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isLoadingDoc, setIsLoadingDoc] = useState(false);

  // Context bài học cũ khi học tiếp
  const [continueLectureData, setContinueLectureData] = useState<LectureContext | null>(null);
  // Nguồn bài học dùng để tạo quiz
  const [lectureSourceData, setLectureSourceData] = useState<LectureContext | null>(null);

  useEffect(() => {
    if (docIdParam) {
      const loadDoc = async () => {
        setIsLoadingDoc(true);
        try {
          const doc = await getDocumentById(Number(docIdParam));
          setSelectedDoc(doc);
          setTopic(doc.title);
        } catch (error) {
          console.error("Lỗi khi tải tài liệu:", error);
          toast.error("Không thể tải tài liệu được yêu cầu.");
        } finally {
          setIsLoadingDoc(false);
        }
      };
      loadDoc();
    }
  }, [docIdParam]);

  // Đọc continueLecture từ localStorage (khi học tiếp chủ đề)
  useEffect(() => {
    if (continueParam === "1") {
      try {
        const raw = localStorage.getItem("continueLecture");
        if (raw) {
          const data: LectureContext = JSON.parse(raw);
          setContinueLectureData(data);
          // Xóa sau khi đọc để tránh stale data
          localStorage.removeItem("continueLecture");
        }
      } catch (e) {
        console.error("Lỗi khi đọc continueLecture:", e);
      }
    }
  }, [continueParam]);

  // Đọc lectureSourceForQuiz từ localStorage (khi tạo quiz từ bài học)
  useEffect(() => {
    if (fromLectureParam === "1") {
      try {
        const raw = localStorage.getItem("lectureSourceForQuiz");
        if (raw) {
          const data: LectureContext = JSON.parse(raw);
          setLectureSourceData(data);
          // Xóa sau khi đọc để tránh stale data
          localStorage.removeItem("lectureSourceForQuiz");
        }
      } catch (e) {
        console.error("Lỗi khi đọc lectureSourceForQuiz:", e);
      }
    }
  }, [fromLectureParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;

    const userId = getCurrentUserId();
    let sourceText = topic;
    let docTitle = topic;
    let finalDocId: number | undefined = undefined;

    setIsGenerating(true);
    try {
      // --- Luồng 1: Tạo quiz từ nội dung bài học (fromLecture=1) ---
      if (fromLectureParam === "1" && lectureSourceData) {
        if (!lectureSourceData.content?.trim()) {
          throw new Error("Bài học không có nội dung. Vui lòng thử lại.");
        }
        sourceText = lectureSourceData.content;
        docTitle = lectureSourceData.title;
        finalDocId = lectureSourceData.documentId;

      // --- Luồng 2: Học tiếp từ bài học cũ (continue=1) ---
      } else if (continueParam === "1" && continueLectureData) {
        if (!continueLectureData.content?.trim()) {
          throw new Error("Không có nội dung bài học cũ. Vui lòng thử lại.");
        }
        // Ghép nội dung bài cũ vào prompt để AI tạo bài tiếp theo liên tục
        sourceText = `Bài học trước đã dạy về chủ đề: "${continueLectureData.title}"

Nội dung bài học trước:
${continueLectureData.content}

Hãy tạo bài học TIẾP THEO mở rộng và nâng cao hơn từ chủ đề trên. Không lặp lại những gì đã học, mà tiếp tục khám phá các khía cạnh mới, chuyên sâu hơn và các ứng dụng thực tế liên quan.`;
        docTitle = `Tiếp theo: ${continueLectureData.title}`;
        finalDocId = continueLectureData.documentId;

      // --- Luồng 3: Từ tài liệu có docId ---
      } else if (docIdParam) {
        if (!selectedDoc) {
          toast.error("Tài liệu chưa được tải xong.");
          setIsGenerating(false);
          return;
        }
        finalDocId = selectedDoc.id;
        docTitle = selectedDoc.title;
        let text = selectedDoc.ocrText || "";
        if (!text.trim()) {
          toast.info("Tài liệu chưa được trích xuất chữ. Đang chạy OCR bằng AI...");
          const ocrResult = await runOcrForDocument(selectedDoc.id);
          text = ocrResult.ocrText || "";
        }
        sourceText = text;
        if (!sourceText.trim()) {
          throw new Error("Không thể trích xuất chữ từ tài liệu này. Vui lòng chọn tài liệu khác.");
        }

      // --- Luồng 4: Upload file ---
      } else if (inputType === "file") {
        if (!file) {
          toast.error("Vui lòng tải lên một tài liệu.");
          setIsGenerating(false);
          return;
        }

        toast.info("Đang tải tài liệu lên hệ thống...");
        const profile = await getUserProfile();
        const ownerUserId = profile.id;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("title", file.name);
        formData.append("description", `Tài liệu tự động tạo ${typeMode === 'quiz' ? 'quiz' : 'bài giảng'}`);
        formData.append("ownerUserId", String(ownerUserId));
        formData.append("categoryId", "1");
        formData.append("visibility", "private");

        const uploadedDoc = await uploadDocument(formData);
        finalDocId = uploadedDoc.id;
        docTitle = file.name;
        
        toast.info("Đang trích xuất nội dung từ tài liệu...");
        const ocrResult = await runOcrForDocument(uploadedDoc.id);
        sourceText = ocrResult.ocrText || "";

        if (!sourceText.trim()) {
          throw new Error("Không thể trích xuất chữ từ tài liệu này. Vui lòng thử tài liệu khác hoặc nhập văn bản trực tiếp.");
        }

      // --- Luồng 5: Nhập văn bản / từ khóa thủ công ---
      } else {
        if (!sourceText.trim()) {
          toast.error("Vui lòng nhập văn bản hoặc từ khóa chủ đề.");
          setIsGenerating(false);
          return;
        }
        docTitle = typeMode === "quiz" ? `Quiz về ${topic.slice(0, 30)}` : topic;
      }

      if (typeMode === "quiz") {
        toast.info("AI Scholarly đang biên soạn bộ câu hỏi trắc nghiệm...");
        const quizData = await generateAIQuiz(sourceText, difficulty, questionCount);

        const newHistoryId = Date.now();
        let serverQuizId: number | undefined;

        try {
          const saved = await saveQuizResult(
            docTitle,
            difficulty,
            questionCount,
            null,
            quizData.questions,
            finalDocId,
          );
          serverQuizId = saved.id;
        } catch (dbErr) {
          console.error("Lỗi khi lưu quiz vào database:", dbErr);
        }

        localStorage.setItem("activeQuiz", JSON.stringify({
          title: docTitle,
          questions: quizData.questions,
          documentId: finalDocId,
          serverQuizId,
          historyId: newHistoryId,
          difficulty: difficulty
        }));

        // Lưu vào lịch sử để HistoryQuiz hiển thị
        const historyKey = userId ? `quizHistory_${userId}` : "quizHistory";
        const quizHistory = JSON.parse(localStorage.getItem(historyKey) || "[]");
        const newHistoryItem = {
          id: newHistoryId,
          title: docTitle,
          date: new Date().toISOString(),
          score: "--",
          questions: quizData.questions,
          difficulty: difficulty
        };
        localStorage.setItem(historyKey, JSON.stringify([newHistoryItem, ...quizHistory]));

        toast.success("Tạo Quiz thành công!");
        navigate("/quiz");
      } else {
        toast.info("AI Scholarly đang soạn giáo án bài học cho bạn...");
        const lectureData = await generateAILecture(sourceText, studyMode);

        // Lưu lecture vào localStorage để StudyMode load lên
        localStorage.setItem("activeLecture", JSON.stringify({
          title: lectureData.title || docTitle,
          content: lectureData.content,
          documentId: finalDocId
        }));

        // Lưu vào lịch sử để HistoryLecture hiển thị
        const lectureKey = userId ? `lectureHistory_${userId}` : "lectureHistory";
        const lectureHistory = JSON.parse(localStorage.getItem(lectureKey) || "[]");
        const newHistoryItem = {
          id: Date.now(),
          title: lectureData.title || docTitle,
          date: new Date().toISOString(),
          progress: "0%",
          content: lectureData.content
        };
        localStorage.setItem(lectureKey, JSON.stringify([newHistoryItem, ...lectureHistory]));

        // Lưu lên database
        try {
          await saveLecture(lectureData.title || docTitle, lectureData.content);
        } catch (dbErr) {
          console.error("Lỗi khi lưu bài giảng vào database:", dbErr);
        }

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

          {/* Banner: Tạo quiz từ bài học (fromLecture=1) */}
          {fromLectureParam === "1" ? (
            <div className="p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {lectureSourceData ? lectureSourceData.title : "Đang tải nội dung bài học..."}
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 font-semibold">
                    Nguồn: Bài học AI vừa tạo · Quiz sẽ bám sát nội dung này
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/create-quiz")}
                className="text-xs font-bold text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
              >
                Huỷ
              </button>
            </div>

          ) : continueParam === "1" ? (
            /* Banner: Học tiếp từ bài học cũ (continue=1) */
            <div className="p-5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {continueLectureData ? continueLectureData.title : "Đang tải bài học trước..."}
                  </h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-semibold">
                    Tiếp nối · AI sẽ tạo bài học mở rộng từ nội dung này
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/create-lecture")}
                className="text-xs font-bold text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
              >
                Huỷ
              </button>
            </div>

          ) : docIdParam ? (
            /* Banner: Từ tài liệu thư viện (docId) */
            <div className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate max-w-[250px] md:max-w-md">
                    {selectedDoc?.title || "Đang tải tài liệu..."}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {selectedDoc?.owner?.name ? `Tác giả: ${selectedDoc.owner.name}` : "Tài liệu hệ thống"}
                  </p>
                </div>
              </div>
              {!isLoadingDoc && (
                <button
                  type="button"
                  onClick={() => {
                    navigate(typeMode === "quiz" ? "/create-quiz" : "/create-lecture");
                    setSelectedDoc(null);
                    setTopic("");
                  }}
                  className="text-xs font-bold text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                >
                  Huỷ chọn
                </button>
              )}
            </div>

          ) : (
            /* Nhập thủ công: văn bản hoặc file */
            <>
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
            </>
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
            disabled={
              isGenerating ||
              // Chỉ disable khi nhập thủ công mà chưa có gì
              (!docIdParam && !continueParam && !fromLectureParam &&
                ((inputType === "text" && !topic.trim()) || (inputType === "file" && !file)))
            }
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

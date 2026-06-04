import {
  ArrowLeft,
  BookOpen,
  Calendar,
  User,
  FileText,
  Sparkles,
  BookmarkPlus,
  Share2,
  Zap,
  Download,
  Copy,
  Check,
  RotateCw,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Document } from "../types/documentTypes";
import { downloadDocument, getDocumentById, runOcrForDocument } from "../services/documentService";
import { useParams, useNavigate } from "react-router-dom";
import useGetFileBadge from "../hooks/useGetFileBadge";
const DocsDetail = () => {
  const navigate = useNavigate();
  const [doc, setDoc] = useState<Document>();
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRunOcr = async () => {
    if (!doc) return;
    setIsOcrLoading(true);
    setOcrError("");
    try {
      const updatedDoc = await runOcrForDocument(doc.id);
      setDoc(updatedDoc);
    } catch (err: any) {
      console.error(err);
      setOcrError(err.response?.data?.message || "Không thể thực hiện trích xuất chữ. Vui lòng thử lại.");
    } finally {
      setIsOcrLoading(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  useEffect(() => {
    const loadDoc = async () => {
      try {
        const data = await getDocumentById(numericId);
        setDoc(data);
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };
    loadDoc();
  }, [numericId]);
  const getFileBadge = useGetFileBadge();
  const handleDownload = async (id: number, filename: string) => {
    try {
      const blob = await downloadDocument(id);

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = filename;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Back Button */}
      <button
        onClick={() => history.back()}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại thư viện
      </button>

      {/* Main Content */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm mb-8 relative overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <BookOpen className="w-64 h-64 text-slate-900 dark:text-white transform rotate-12" />
        </div>

        <div className="relative z-10 space-y-8">
          {/* Header info */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
                {doc ? getFileBadge(doc.fileUrl) : "DOC"}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />{" "}
                {doc
                  ? new Date(doc.createdAt).toLocaleDateString("vi-VN")
                  : "1 ngày trước"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {doc && (
                <button
                  onClick={() => handleDownload(doc.id, doc.originalName || "document")}
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Tải xuống tài liệu"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => { }}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Lưu tài liệu"
              >
                <BookmarkPlus className="w-5 h-5" />
              </button>
              <button
                onClick={() => { }}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Chia sẻ"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Title and Description */}
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
              {doc
                ? doc.title
                : "Tài liệu mẫu: 'Học tập hiệu quả với AI - Hướng dẫn chi tiết cho sinh viên'"}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
              {doc
                ? doc.description
                : "Đây là một tài liệu mẫu được tạo ra để minh họa cho giao diện chi tiết của một tài liệu trong thư viện. Tài liệu này cung cấp hướng dẫn chi tiết về cách sử dụng AI để hỗ trợ học tập hiệu quả, bao gồm các chiến lược học tập, công cụ AI hữu ích, và cách tích hợp AI vào quá trình học tập hàng ngày của sinh viên."}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
              #AI
            </span>
            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
              #Học tập
            </span>
            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
              #Tài liệu
            </span>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Tác giả
                </p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {doc?.owner?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Độ dài
                </p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {doc?.pageCount || "1 trang"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Lượt xem
                </p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {doc?.viewCount}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Quiz tạo từ TL
                </p>
                <p className="font-bold text-slate-900 dark:text-white">5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OCR & Text Extraction Section */}
      {doc && (doc.mimeType?.startsWith("image/") || doc.mimeType === "application/pdf" || doc.fileUrl?.endsWith(".pdf") || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(doc.fileUrl)) && (
        <div className="bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Trích xuất văn bản bằng AI
              </h2>
            </div>
            {doc.ocrText && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopyText(doc.ocrText || "")}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-500" /> Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Sao chép chữ
                    </>
                  )}
                </button>
                <button
                  onClick={handleRunOcr}
                  disabled={isOcrLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded-xl text-xs font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 cursor-pointer"
                  title="Nhận diện lại"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isOcrLoading ? "animate-spin" : ""}`} /> Quét lại
                </button>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {doc.mimeType === "application/pdf" || doc.fileUrl?.endsWith(".pdf")
              ? "Tự động phân tích và trích xuất toàn bộ văn bản từ tệp tài liệu PDF phục vụ việc đọc và học tập trực quan."
              : "Sử dụng công nghệ AI OCR nhận dạng ký tự tiếng Việt & tiếng Anh để trích xuất văn bản từ hình ảnh."}
          </p>

          {ocrError && (
            <div className="p-4 mb-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm font-semibold rounded-2xl border border-red-100 dark:border-red-900/50">
              {ocrError}
            </div>
          )}

          {isOcrLoading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="font-bold text-slate-800 dark:text-white">Đang phân tích & trích xuất văn bản...</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Quá trình này có thể mất từ 10-30 giây tùy vào dung lượng tệp.</p>
              </div>
            </div>
          ) : doc.ocrText ? (
            <div className="relative">
              <pre className="max-h-60 overflow-y-auto whitespace-pre-wrap break-words font-mono text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-inner leading-relaxed">
                {doc.ocrText}
              </pre>
              <div className="absolute bottom-2 right-2 pointer-events-none opacity-40">
                <FileText className="w-6 h-6 text-slate-400" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-700 dark:text-slate-300">Tài liệu chưa được trích xuất văn bản</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-sm mx-auto">
                  Trích xuất văn bản giúp bạn dễ dàng đọc tài liệu, sao chép nội dung và trò chuyện học tập cùng AI.
                </p>
              </div>
              <button
                onClick={handleRunOcr}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 duration-150"
              >
                <Sparkles className="w-4 h-4" /> Bắt đầu trích xuất chữ
              </button>
            </div>
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => doc && navigate(`/create-lecture?docId=${doc.id}`)}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg text-lg group"
        >
          <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
          Bắt đầu Học với AI
        </button>
        <button
          onClick={() => doc && navigate(`/create-quiz?docId=${doc.id}`)}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-lg group"
        >
          <Zap className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
          Tạo Quiz tự động
        </button>
      </div>
    </div>

  );
};

export default DocsDetail;

import {
  ArrowLeft,
  BookOpen,
  Calendar,
  User,
  FileText,
  BookmarkPlus,
  Share2,
  Zap,
  Download,
  Eye,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Document } from "../types/documentTypes";
import { downloadDocument, getDocumentById } from "../services/documentService";
import { useParams, useNavigate } from "react-router-dom";
import useGetFileBadge from "../hooks/useGetFileBadge";

const DocsDetail = () => {
  const navigate = useNavigate();
  const [doc, setDoc] = useState<Document>();
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

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
      <button
        onClick={() => history.back()}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại thư viện
      </button>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <BookOpen className="w-64 h-64 text-slate-900 dark:text-white transform rotate-12" />
        </div>

        <div className="relative z-10 space-y-8">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold border bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800">
                {doc ? getFileBadge(doc.fileUrl) : "DOC"}
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />{" "}
                {doc
                  ? new Date(doc.createdAt).toLocaleDateString("vi-VN")
                  : "—"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {doc && (
                <button
                  onClick={() =>
                    handleDownload(doc.id, doc.originalName || "document")
                  }
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Tải xuống tài liệu"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => {}}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Lưu tài liệu"
              >
                <BookmarkPlus className="w-5 h-5" />
              </button>
              <button
                onClick={() => {}}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Chia sẻ"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
              {doc?.title || "Đang tải..."}
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
              {doc?.description || ""}
            </p>
          </div>

          <hr className="border-slate-200 dark:border-slate-800" />

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
                  {doc?.owner?.name || "—"}
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
                  {doc?.pageCount || "—"}
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
                  {doc?.viewCount ?? 0}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Quiz đã tạo
                </p>
                <p className="font-bold text-slate-900 dark:text-white">
                  {doc?.quizCount ?? 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

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

      <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
        Nội dung tài liệu sẽ được trích xuất tự động khi bạn tạo bài giảng hoặc quiz.
      </p>
    </div>
  );
};

export default DocsDetail;

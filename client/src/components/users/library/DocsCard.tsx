import { Link } from "react-router-dom";
import { BookOpen, Eye, FileText, Sparkles, Star, Zap } from "lucide-react";
const DocsCard = ({ title, desc, avatar, author, views, quizzes, pages }: { title: string; desc: string; avatar: string; author: string; views: number; quizzes: number; pages: number }) => {
  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden">
      {/* Card Header */}
      <div className="p-5 flex-1 space-y-3">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border`}
            >
              DOCX
            </span>
            {/* {doc.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 border border-slate-900 dark:border-white">
                <Star className="w-3 h-3 fill-current" /> Nổi bật
              </span>
            )} */}
          </div>
          <span className="text-xs font-medium text-slate-400 dark:text-slate-500 shrink-0">
            1 ngày trước
          </span>
        </div>

        {/* Title */}
        <Link to={`/library/1`}>
          <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
           {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">
          {desc}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            AI
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            Trắc nghiệm
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
            Tài liệu
          </span>
        </div>
      </div>

      {/* Divider + Stats */}
      <div className="px-5 pb-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        {/* Author */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">
              {avatar}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate max-w-[100px]">
            {author}
          </span>
        </div>
        {/* Stats */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Eye className="w-3 h-3" />
            <span>{views}</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <Sparkles className="w-3 h-3" />
            <span>{quizzes} Quiz</span>
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <FileText className="w-3 h-3" />
            <span>{pages} Trang</span>
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-2">
        <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold hover:bg-slate-700 dark:hover:bg-slate-200 transition-colors">
          <BookOpen className="w-4 h-4" />
          Học với AI
        </button>
        <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
          <Zap className="w-4 h-4" />
          Tạo Quiz
        </button>
      </div>
    </article>
  );
};

export default DocsCard;

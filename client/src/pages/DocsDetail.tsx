import { ArrowLeft, BookOpen, Calendar, User, FileText, Eye, Sparkles, BookmarkPlus, Share2, Zap, Download } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const DocsDetail = () => {
  return (
   <div className="max-w-4xl mx-auto pb-16">
      {/* Back Button */}
      <button 
        onClick={() =>  history.back()}
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
                DOCX
              </span>
              <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> "1 ngày trước"
              </span>
            </div>
            
            <div className="flex items-center gap-2">
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

          {/* Title and Description */}
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4 leading-tight">
                Tài liệu mẫu: "Học tập hiệu quả với AI - Hướng dẫn chi tiết cho sinh viên"
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-3xl">
                Đây là một tài liệu mẫu được tạo ra để minh họa cho giao diện chi tiết của một tài liệu trong thư viện. Tài liệu này cung cấp hướng dẫn chi tiết về cách sử dụng AI để hỗ trợ học tập hiệu quả, bao gồm các chiến lược học tập, công cụ AI hữu ích, và cách tích hợp AI vào quá trình học tập hàng ngày của sinh viên.
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            
              <span  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                #AI
              </span>
              <span  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
                #Học tập
              </span>
              <span  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
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
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Tác giả</p>
                <p className="font-bold text-slate-900 dark:text-white">Nguyễn Văn A</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Độ dài</p>
                <p className="font-bold text-slate-900 dark:text-white">1 trang</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Eye className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Lượt xem</p>
                <p className="font-bold text-slate-900 dark:text-white">1,234</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Quiz tạo từ TL</p>
                <p className="font-bold text-slate-900 dark:text-white">5</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={() => {}}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg text-lg group"
        >
          <BookOpen className="w-6 h-6 group-hover:scale-110 transition-transform" />
          Bắt đầu Học với AI
        </button>
        <button 
          onClick={() => {}}
          className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm text-lg group"
        >
          <Zap className="w-6 h-6 text-amber-500 group-hover:scale-110 transition-transform" />
          Tạo Quiz tự động
        </button>
      </div>

      {/* Preview Section */}
      <div className="mt-12 pt-12 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
          <Eye className="w-5 h-5 text-slate-500" />
          Xem trước nội dung
        </h2>
        <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-center relative overflow-hidden">
          {/* Mock Preview Content */}
          <div className="text-center p-8 max-w-sm">
            <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-lg mx-auto mb-6">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Chưa tải được bản xem trước</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium">Bạn có thể học với AI hoặc tạo Quiz để AI phân tích và tóm tắt nội dung chi tiết cho bạn.</p>
            <button 
              onClick={() => {}}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Download className="w-4 h-4" /> Tải xuống tệp gốc
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default DocsDetail
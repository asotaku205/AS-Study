import { ArrowLeft, House, SearchX } from "lucide-react";
const NotFound = () => {
  return (
    
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8 mx-auto shadow-inner">
            <SearchX size={96} color="#717182" />
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
            404
          </h1>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Trang không tồn tại
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 font-medium leading-relaxed">
            Có vẻ như bạn đã đi lạc. Nội dung bạn đang tìm kiếm không tồn tại,
            đã bị di chuyển hoặc thay đổi đường dẫn.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-sm">
            <button className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-2 border-slate-200 dark:border-slate-800 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <ArrowLeft />
              Quay lại
            </button>
            <a
              className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
              href="/"
            >
              <House />
              Trang chủ
            </a>
          </div>
        </div>
      </div>
    
  );
};

export default NotFound;

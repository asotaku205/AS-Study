import { Brain } from "lucide-react";
const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 py-12 mt-auto border-t border-slate-200 dark:border-slate-800 transition-colors shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-slate-900 dark:bg-slate-100 rounded-xl flex items-center justify-center">
              <Brain color="#ffffff" />
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
              AI Scholarly
            </span>
          </div>
          <p className="text-sm max-w-sm font-medium leading-relaxed">
            Nền tảng học tập thông minh sử dụng Trí Tuệ Nhân Tạo, giúp tối ưu
            hóa quá trình học tập và ghi nhớ qua các bài giảng và trắc nghiệm
            tương tác.
          </p>
        </div>
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold mb-4 tracking-tight">
            Liên kết
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            <li>
              <a className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Trang chủ
              </a>
            </li>
            <li>
              <a className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Tạo Quiz
              </a>
            </li>
            <li>
              <a className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Học tập
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-slate-900 dark:text-white font-bold mb-4 tracking-tight">
            Hỗ trợ
          </h3>
          <ul className="space-y-3 text-sm font-medium">
            <li className="flex items-center gap-2 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
              Liên hệ
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
              Điều khoản
            </li>
            <li className="flex items-center gap-2 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
              Bảo mật
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-100 dark:border-slate-800/50 text-sm text-center font-medium">
        © 2026 AI Scholarly.
      </div>
    </footer>
  );
};
export default Footer;

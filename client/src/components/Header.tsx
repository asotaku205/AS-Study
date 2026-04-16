import { Brain, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const isLoggedIn = false;
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  return (
    <header className="fixed top-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-50 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <Link
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        to="/"
      >
        <div className="w-9 h-9 bg-slate-900 dark:bg-slate-100 rounded-xl flex items-center justify-center shadow-md">
          <Brain color="#ffffff" />
        </div>
        <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
          AI Scholarly
        </span>
      </Link>
      {!isAuthPage && (
        <nav className="hidden md:flex items-center gap-8">
          <Link
            className="font-semibold flex items-center gap-2 transition-colors text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            to="/"
          >
            Trang chủ
          </Link>
          <Link
            className="font-semibold flex items-center gap-2 transition-colors text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            to="/library"
          >
            Thư viện
          </Link>
          <Link
            className="font-semibold flex items-center gap-2 transition-colors text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            to="/create-quiz"
          >
            Trắc nghiệm
          </Link>
          <Link
            className="font-semibold flex items-center gap-2 transition-colors text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            to="/study"
          >
            Học tập
          </Link>
          <Link
            className="font-semibold flex items-center gap-2 transition-colors text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            to="/chat"
          >
            Chat AI
          </Link>
        </nav>
      )}
      {!isAuthPage ? (
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <button className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 outline-none">
              <User />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-3 text-sm font-semibold">
              <Link
                className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                to="/login"
              >
                Đăng nhập
              </Link>
              <Link
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm font-bold"
                to="/register"
              >
                Bắt đầu miễn phí
              </Link>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/"
          className="text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          Về trang chủ
        </Link>
      )}
    </div>
  </header>
  );
};
export default Header;

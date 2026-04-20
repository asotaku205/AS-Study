import { BookOpen, Brain, LogOut, Settings, Shield, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [settingOpen, setSettingOpen] = useState(false);
  const isLoggedIn = true;
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
              to="/create-lecture"
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
              <div className="relative">
                <button
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 outline-none"
                  onClick={() => setSettingOpen(!settingOpen)}
                >
                  <User />
                </button>
                {settingOpen && (
                  <div className="absolute right-0 min-w-[220px] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-[100] animate-in fade-in zoom-in-95 mt-2">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Tài khoản của tôi
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        user@example.com
                      </p>
                    </div>
                    <Link
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer outline-none"
                      to="/profile"
                    >
                      <User /> Hồ sơ cá nhân
                    </Link>
                    <Link
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer outline-none"
                      to="/personal-library"
                    >
                      <BookOpen /> Thư viện cá nhân
                    </Link>
                    <Link
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer outline-none"
                      to="/settings"
                    >
                      <Settings /> Cài đặt hệ thống
                    </Link>
                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-2"></div>
                    <Link
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white cursor-pointer outline-none"
                      to="/admin"
                    >
                      <Shield /> Quản trị viên
                    </Link>
                    <Link
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer outline-none"
                      to="/login"
                    >
                      <LogOut /> Đăng xuất
                    </Link>
                  </div>
                )}
              </div>
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

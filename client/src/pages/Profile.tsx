import {
  Settings,
  Activity,
  Clock,
  Target,
  FolderOpen,
  BookOpen,
  Upload,
  Zap,
  
} from "lucide-react";
import ProfileCard from "../components/users/profile/ProfileCard";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 relative">
      {/* Background  */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-slate-300/20 dark:bg-slate-700/10 rounded-full blur-[150px] opacity-60"></div>
        <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-slate-400/20 dark:bg-slate-600/10 rounded-full blur-[120px] opacity-60"></div>
      </div>

      <header className="relative z-10 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Hồ sơ & Thống kê
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Theo dõi dữ liệu thư viện cá nhân và kết quả học tập.
          </p>
        </div>
        <Link to="/settings">
          <button className="p-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/50 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl shadow-sm transition-all hover:bg-white dark:hover:bg-slate-800">
            <Settings className="w-5 h-5" />
          </button>
        </Link>
      </header>

      {/* Main Content Layout  */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        {/* Left Column */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Profile Card */}
          <ProfileCard
            avatar="AS"
            name="Anh Son"
            gmail="sonotaku555@gmail.com "
            docs={24}
            quizzes={45}
          />

          {/* Recent Activity Card */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-slate-800 p-6 shadow-lg flex flex-col flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              Hoạt động gần đây
            </h3>
            <ul className="space-y-5 flex-1">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 mt-0.5 shrink-0">
                  <Upload className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    Tải lên tài liệu
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    Giải tích 2 - HD chi tiết
                  </p>
                  <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mt-1.5">
                    2 giờ trước
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 mt-0.5 shrink-0">
                  <Zap className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    Hoàn thành Quiz
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    Machine Learning Cơ Bản
                  </p>
                  <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mt-1.5">
                    Hôm qua
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 mt-0.5 shrink-0">
                  <FolderOpen className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    Lưu vào Thư viện
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                    ReactJS Handbook 2024
                  </p>
                  <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mt-1.5">
                    3 ngày trước
                  </p>
                </div>
              </li>
            </ul>
            <button className="mt-4 w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Xem tất cả
            </button>
          </div>
        </div>

        {/* Right Column*/}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-slate-800 shadow-lg flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-md">
                  <FolderOpen className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                  24
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Thư viện cá nhân
                </p>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-slate-800 shadow-lg flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <Target className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                  45
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Quiz đã tạo
                </p>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-slate-800 shadow-lg flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                  128
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Tài liệu đã đọc
                </p>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-slate-800 shadow-lg flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                  42h
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Thời gian học
                </p>
              </div>
            </div>
          </div>

          {/* Chart Section*/}
        </div>
      </div>
    </div>
  );
};

export default Profile;

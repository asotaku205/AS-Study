import {
  Settings,
  Activity,
  Clock,
  Target,
  FolderOpen,
  BookOpen,
  Upload,
  Zap,
  BarChart3,
  Trophy,
  CheckCircle2,
} from "lucide-react";
import ProfileCard from "../components/users/profile/ProfileCard";
import { Link } from "react-router-dom";
import { getDashboardChart, getUserProfile } from "../services/userService";
import {
  getMyQuizStats,
  getMyRecentActivity,
} from "../services/quizzService";
import {  getMyDocumentCount } from "../services/documentService";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
type UserProfile = {
  id: number;
  name: string;
  username: string;
  email: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
};

type RecentActivityItem = {
  type: string;
  title: string;
  detail: string;
  date: string;
};

const formatTimeAgo = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} giờ trước`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};

const Profile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [quizStats, setQuizStats] = useState({ 
    totalQuizzes: 0, 
    avgScore: 0,
    highScore: 0,
    totalQuestions: 0,
    totalCorrectAnswers: 0
  });
  const [docCount, setDocCount] = useState(0);
  const [recentActivity, setRecentActivity] = useState<RecentActivityItem[]>(
    [],
  );
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
  getDashboardChart().then(setChartData);
}, []);

  const isDark =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const [profileData, statsData, docCountData, activityData] =
          await Promise.all([
            getUserProfile(),
            getMyQuizStats(),
            getMyDocumentCount(),
            getMyRecentActivity(),
          ]);
        if (isMounted) {
          setUserProfile(profileData);
          setQuizStats(statsData);
          setDocCount(docCountData);
          setRecentActivity(activityData);
        }
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

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
            avatar={(userProfile?.name ?? "U").slice(0, 2).toUpperCase()}
            name={userProfile?.name ?? "Người dùng"}
            username={userProfile?.username ?? ""}
            gmail={userProfile?.email ?? ""}
            docs={docCount}
          />

          {/* Recent Activity Card */}
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-slate-800 p-6 shadow-lg flex flex-col flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              Hoạt động gần đây
            </h3>
            <ul className="space-y-5 flex-1">
              {recentActivity.length > 0 ? (
                recentActivity.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 mt-0.5 shrink-0">
                      {item.type === "quiz" ? (
                        <Zap className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      ) : item.type === "upload" ? (
                        <Upload className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      ) : (
                        <FolderOpen className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-slate-900 dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                        {item.detail}
                      </p>
                      <p className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 mt-1.5">
                        {formatTimeAgo(item.date)}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-400 dark:text-slate-500 italic">
                  Chưa có hoạt động nào gần đây.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Right Column*/}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-slate-800 shadow-lg flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-md">
                  <FolderOpen className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                  {docCount}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Thư viện cá nhân
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
                  {quizStats.avgScore > 0
                    ? `${Math.round(quizStats.avgScore)}%`
                    : "—"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Điểm trung bình
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
                <p className="text-2xl font-black text-slate-900 dark:text-white mb-1">
                  {userProfile?.createdAt
                    ? new Date(userProfile.createdAt).toLocaleDateString(
                        "vi-VN",
                        { day: "2-digit", month: "2-digit", year: "numeric" },
                      )
                    : "—"}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                  Ngày tham gia
                </p>
              </div>
            </div>
          </div>

          {/* Chart Section*/}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8  rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl flex flex-col flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                Tổng quan Học tập (Tuần này)
              </h3>
              
            </div>

            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 15, right: 15, left: -20, bottom: 15 }}
                >
                  <defs>
                    <linearGradient
                      id="colorStudyTime"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={isDark ? "#F8FAFC" : "#0F172A"}
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor={isDark ? "#F8FAFC" : "#0F172A"}
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorQuizzes"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={isDark ? "#94A3B8" : "#64748B"}
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor={isDark ? "#94A3B8" : "#64748B"}
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDark ? "#1E293B" : "#E2E8F0"}
                  />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: isDark ? "#64748B" : "#94A3B8",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                    dy={15}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: isDark ? "#64748B" : "#94A3B8",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: isDark
                        ? "1px solid #334155"
                        : "1px solid #E2E8F0",
                      backgroundColor: isDark
                        ? "rgba(15, 23, 42, 0.9)"
                        : "rgba(255, 255, 255, 0.9)",
                      backdropFilter: "blur(8px)",
                      color: isDark ? "#F8FAFC" : "#0F172A",
                      boxShadow:
                        "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                      fontWeight: 600,
                    }}
                    itemStyle={{
                      color: isDark ? "#F8FAFC" : "#0F172A",
                      fontWeight: "bold",
                    }}
                    labelStyle={{
                      color: isDark ? "#94A3B8" : "#64748B",
                      paddingBottom: "4px",
                    }}
                  />
                  <Area
                    type="monotone"
                    name="Tài liệu đã lưu"
                    dataKey="docs"
                    stroke={isDark ? "#F8FAFC" : "#0F172A"}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorStudyTime)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

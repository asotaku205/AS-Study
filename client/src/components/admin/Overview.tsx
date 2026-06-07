import {
  Database,
  Users,
  BookOpen,
  AlertTriangle,
  ArrowUpRight,
  FileText,
  BrainCircuit,
  GraduationCap,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import type { User } from "../../types/userTypes";
import type { Document } from "../../types/documentTypes";
import { useState, useEffect } from "react";
import { getUserRegistrationGrowth } from "../../services/userService";
import { getDocsByCategory } from "../../services/documentService";
import {
  getAdminOverview,
  getAdminActivity,
  type AdminOverviewStats,
  type AdminActivityItem,
} from "../../services/adminService";

const MONOCHROME_COLORS = [
  "#0f172a",
  "#334155",
  "#64748b",
  "#94a3b8",
  "#cbd5e1",
  "#1e293b",
  "#475569",
];

const STATUS_LABELS: Record<string, string> = {
  Published: "Đã xuất bản",
  Pending: "Chờ duyệt",
  Reported: "Bị báo cáo",
  Rejected: "Từ chối",
  Draft: "Nháp",
};

const Overview = ({
  user,
  docs,
}: {
  user: User[];
  docs: Document[];
}) => {
  const [overview, setOverview] = useState<AdminOverviewStats | null>(null);
  const [userGrowthData, setUserGrowthData] = useState<
    { name: string; users: number }[]
  >([]);
  const [categoryData, setCategoryData] = useState<
    { name: string; value: number }[]
  >([]);
  const [recentActivity, setRecentActivity] = useState<AdminActivityItem[]>([]);
  const [isDark, setIsDark] = useState(
    () =>
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadStats = async () => {
      try {
        const [overviewData, growthData, catData, activityData] =
          await Promise.all([
            getAdminOverview(),
            getUserRegistrationGrowth(),
            getDocsByCategory(),
            getAdminActivity({ page: 1, limit: 8 }),
          ]);
        if (isMounted) {
          setOverview(overviewData);
          setUserGrowthData(growthData);
          setCategoryData(catData);
          setRecentActivity(activityData.items);
        }
      } catch (err) {
        console.error("Lỗi khi load admin stats", err);
      }
    };

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const statusCounts = docs.reduce<Record<string, number>>((acc, d) => {
    acc[d.status] = (acc[d.status] || 0) + 1;
    return acc;
  }, {});
  const docStatusData = Object.entries(statusCounts).map(([name, val]) => ({
    name: STATUS_LABELS[name] || name,
    val,
  }));

  const kpiCards = overview
    ? [
        {
          label: "Tổng người dùng",
          value: overview.users.total,
          change: `+${overview.users.newThisWeek} tuần này`,
          icon: Users,
          isPositive: true,
        },
        {
          label: "Tài liệu hệ thống",
          value: overview.documents.total,
          change: `+${overview.documents.newThisWeek} tuần này`,
          icon: BookOpen,
          isPositive: true,
        },
        {
          label: "Quiz đã tạo",
          value: overview.quizzes.total,
          change: `+${overview.quizzes.weeklyCount} tuần này`,
          icon: BrainCircuit,
          isPositive: overview.quizzes.growth >= 0,
        },
        {
          label: "Bài giảng AI",
          value: overview.lectures.total,
          change: `+${overview.lectures.weeklyCount} tuần này`,
          icon: GraduationCap,
          isPositive: true,
        },
        {
          label: "Chờ duyệt",
          value: overview.documents.pending,
          change:
            overview.documents.pending > 0
              ? "Cần xử lý"
              : "Không có",
          icon: Clock,
          isPositive: overview.documents.pending === 0,
        },
        {
          label: "Cảnh báo",
          value: overview.alerts,
          change:
            overview.documents.reported > 0
              ? `${overview.documents.reported} báo cáo`
              : overview.users.banned > 0
                ? `${overview.users.banned} bị khóa`
                : "",
          icon: AlertTriangle,
          isPositive: overview.alerts === 0,
        },
      ]
    : [];

  const activityIcon = (category: AdminActivityItem["category"]) => {
    switch (category) {
      case "user":
        return Users;
      case "quiz":
        return BrainCircuit;
      case "lecture":
        return GraduationCap;
      default:
        return FileText;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Tổng quan hiệu suất
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Dữ liệu thống kê thời gian thực từ hệ thống.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-md">
          <Database className="w-4 h-4" /> Xuất báo cáo
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {overview
          ? kpiCards.map((metric, idx) => (
              <div
                key={idx}
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-slate-800 shadow-lg flex flex-col justify-between hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 w-fit bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <metric.icon className="w-5 h-5" />
                  </div>
                  {metric.change && (
                    <span
                      className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${metric.isPositive ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                    >
                      {metric.change}{" "}
                      {metric.isPositive && (
                        <ArrowUpRight className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">
                    {metric.value}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    {metric.label}
                  </p>
                </div>
              </div>
            ))
          : Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-slate-800 shadow-lg h-36 animate-pulse"
              />
            ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Tăng trưởng đăng ký
            </h3>
            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              7 ngày qua
            </span>
          </div>
          <div className="flex-1 min-h-[260px] w-full">
            {userGrowthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={userGrowthData}
                  margin={{ top: 15, right: 15, left: -20, bottom: 15 }}
                >
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={isDark ? "#F8FAFC" : "#0F172A"}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor={isDark ? "#F8FAFC" : "#0F172A"}
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
                    dataKey="name"
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
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: isDark
                        ? "1px solid #334155"
                        : "1px solid #E2E8F0",
                      backgroundColor: isDark
                        ? "rgba(15,23,42,0.9)"
                        : "rgba(255,255,255,0.9)",
                      backdropFilter: "blur(8px)",
                      color: isDark ? "#F8FAFC" : "#0F172A",
                      fontWeight: 600,
                    }}
                    itemStyle={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
                  />
                  <Area
                    type="monotone"
                    name="Đăng ký mới"
                    dataKey="users"
                    stroke={isDark ? "#F8FAFC" : "#0F172A"}
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-sm font-medium">
                Đang tải dữ liệu...
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl flex flex-col">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6">
            Tài liệu theo danh mục
          </h3>
          <div className="flex-1 min-h-[260px] w-full">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.map((_, idx) => (
                      <Cell
                        key={idx}
                        fill={MONOCHROME_COLORS[idx % MONOCHROME_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      border: "none",
                      backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                      fontWeight: 600,
                      color: isDark ? "#F8FAFC" : "#0F172A",
                    }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", fontWeight: "700" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-sm font-medium">
                Đang tải dữ liệu...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Doc status + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-5">
            Phân bổ trạng thái tài liệu
          </h3>
          <div className="min-h-[200px]">
            {docStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={docStatusData}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDark ? "#1E293B" : "#E2E8F0"}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: isDark ? "#64748B" : "#94A3B8",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: isDark ? "#64748B" : "#94A3B8",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                    allowDecimals={false}
                  />
                  <Tooltip
                    cursor={{ fill: isDark ? "#1E293B" : "#F1F5F9" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                      fontWeight: 600,
                      color: isDark ? "#F8FAFC" : "#0F172A",
                    }}
                  />
                  <Bar
                    dataKey="val"
                    name="Số tài liệu"
                    fill={isDark ? "#F8FAFC" : "#0F172A"}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-slate-400 dark:text-slate-500 text-sm font-medium">
                Chưa có dữ liệu
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-5">
            Hoạt động gần đây
          </h3>
          <div className="space-y-3">
            {recentActivity.length > 0 ? (
              recentActivity.map((item) => {
                const Icon = activityIcon(item.category);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        item.level === "ERROR"
                          ? "bg-red-50 dark:bg-red-900/20"
                          : item.level === "WARN"
                            ? "bg-yellow-50 dark:bg-yellow-900/20"
                            : "bg-slate-100 dark:bg-slate-800"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          item.level === "ERROR"
                            ? "text-red-600 dark:text-red-400"
                            : item.level === "WARN"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-slate-700 dark:text-slate-300"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {item.message}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {formatTimeAgo(item.createdAt)} · {item.source}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">
                {overview ? "Chưa có hoạt động nào." : "Đang tải..."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;

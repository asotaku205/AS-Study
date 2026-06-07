import { useState, useEffect, useCallback } from "react";
import {
  RefreshCw,
  Download,
  Activity,
  Users,
  AlertCircle,
  BookOpen,
  BrainCircuit,
  GraduationCap,
} from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { toast } from "react-toastify";
import AppPagination from "../Pagination";
import {
  getAdminOverview,
  getAdminActivity,
  getAdminActivityChart,
  type AdminOverviewStats,
  type AdminActivityItem,
  type AdminActivityChartItem,
  type ActivityLogLevel,
} from "../../services/adminService";

const LOGS_PER_PAGE = 10;

const ReportTab = () => {
  const [logFilter, setLogFilter] = useState<ActivityLogLevel>("all");
  const [logPage, setLogPage] = useState(1);
  const [overview, setOverview] = useState<AdminOverviewStats | null>(null);
  const [activityLogs, setActivityLogs] = useState<AdminActivityItem[]>([]);
  const [activityTotal, setActivityTotal] = useState(0);
  const [activityTotalPages, setActivityTotalPages] = useState(1);
  const [chartData, setChartData] = useState<AdminActivityChartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLogsLoading, setIsLogsLoading] = useState(true);
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

  const loadOverview = useCallback(async () => {
    setIsLoading(true);
    try {
      const [overviewData, chart] = await Promise.all([
        getAdminOverview(),
        getAdminActivityChart(),
      ]);
      setOverview(overviewData);
      setChartData(chart);
    } catch (err) {
      console.error("Lỗi khi tải báo cáo admin", err);
      toast.error("Không thể tải dữ liệu báo cáo");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadActivityLogs = useCallback(async () => {
    setIsLogsLoading(true);
    try {
      const activityData = await getAdminActivity({
        page: logPage,
        limit: LOGS_PER_PAGE,
        level: logFilter,
      });
      setActivityLogs(activityData.items);
      setActivityTotal(activityData.total);
      setActivityTotalPages(activityData.totalPages);
    } catch (err) {
      console.error("Lỗi khi tải nhật ký", err);
      toast.error("Không thể tải nhật ký hoạt động");
    } finally {
      setIsLogsLoading(false);
    }
  }, [logPage, logFilter]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  useEffect(() => {
    loadActivityLogs();
  }, [loadActivityLogs]);

  const handleRefresh = () => {
    loadOverview();
    loadActivityLogs();
    toast.success("Đã làm mới dữ liệu");
  };

  const statusCards = overview
    ? [
        {
          label: "Người dùng",
          val: overview.users.total.toLocaleString("vi-VN"),
          desc: `+${overview.users.newThisWeek} tuần này`,
          icon: Users,
          ok: true,
        },
        {
          label: "Tài liệu",
          val: overview.documents.total.toLocaleString("vi-VN"),
          desc: `${overview.documents.published} đã xuất bản`,
          icon: BookOpen,
          ok: true,
        },
        {
          label: "Quiz hoàn thành",
          val: overview.quizzes.total.toLocaleString("vi-VN"),
          desc: `+${overview.quizzes.weeklyCount} tuần này`,
          icon: BrainCircuit,
          ok: true,
        },
        {
          label: "Cần xử lý",
          val: overview.alerts.toLocaleString("vi-VN"),
          desc:
            overview.documents.pending > 0
              ? `${overview.documents.pending} chờ duyệt`
              : "Không có việc chờ",
          icon: AlertCircle,
          ok: overview.alerts === 0,
        },
      ]
    : [];

  const handleExportLogs = async () => {
    try {
      const exportData = await getAdminActivity({
        page: 1,
        limit: 50,
        level: logFilter,
      });
      if (exportData.items.length === 0) {
        toast.info("Không có dữ liệu để xuất");
        return;
      }
    const header = "Thời gian,Mức độ,Nguồn,Nội dung\n";
    const rows = exportData.items
      .map(
        (log) =>
          `"${log.time}","${log.level}","${log.source}","${log.message.replace(/"/g, '""')}"`,
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `admin-activity-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất file log");
    } catch {
      toast.error("Không thể xuất log");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Báo cáo hệ thống
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Thống kê hoạt động người dùng, tài liệu và quiz.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading || isLogsLoading}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading || isLogsLoading ? "animate-spin" : ""}`}
            />{" "}
            Làm mới
          </button>
          <button
            onClick={handleExportLogs}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-md"
          >
            <Download className="w-4 h-4" /> Xuất Log
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isLoading && !overview
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 rounded-2xl border border-white/40 dark:border-slate-800 shadow-sm h-28 animate-pulse"
              />
            ))
          : statusCards.map((sys, index) => (
              <div
                key={index}
                className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 rounded-2xl border border-white/40 dark:border-slate-800 shadow-sm flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                    <sys.icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </div>
                  <div
                    className={`w-2 h-2 rounded-full ${sys.ok ? "bg-emerald-500" : "bg-red-500"}`}
                  />
                </div>
                <div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {sys.val}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5">
                    {sys.label}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1">
                    {sys.desc}
                  </p>
                </div>
              </div>
            ))}
      </div>

      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Bài giảng AI",
              value: overview.lectures.total,
              sub: `+${overview.lectures.weeklyCount} tuần này`,
              icon: GraduationCap,
            },
            {
              label: "Chờ duyệt",
              value: overview.documents.pending,
              sub: "Tài liệu cần duyệt",
              icon: BookOpen,
            },
            {
              label: "Bị báo cáo",
              value: overview.documents.reported,
              sub: "Cần kiểm tra",
              icon: AlertCircle,
            },
            {
              label: "Tài khoản khóa",
              value: overview.users.banned,
              sub: "Người dùng bị ban",
              icon: Users,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white/60 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
                <item.icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-xl font-black text-slate-900 dark:text-white">
                  {item.value}
                </p>
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  {item.label}
                </p>
                <p className="text-[10px] text-slate-400">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-700 dark:text-slate-300" />{" "}
            Hoạt động hệ thống (7 ngày qua)
          </h3>
        </div>
        <div className="min-h-70 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: -20, bottom: 0 }}
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
                  contentStyle={{
                    borderRadius: "12px",
                    border: isDark
                      ? "1px solid #334155"
                      : "1px solid #E2E8F0",
                    backgroundColor: isDark ? "#0F172A" : "#FFFFFF",
                    fontWeight: 600,
                  }}
                  itemStyle={{ color: isDark ? "#F8FAFC" : "#0F172A" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="documents"
                  name="Tài liệu"
                  stroke={isDark ? "#F8FAFC" : "#0F172A"}
                  strokeWidth={3}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="quizzes"
                  name="Quiz"
                  stroke="#64748B"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Người dùng mới"
                  stroke="#94A3B8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-slate-400 text-sm font-medium">
              {isLoading ? "Đang tải biểu đồ..." : "Chưa có dữ liệu"}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">
              Nhật ký hoạt động gần đây
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {activityTotal > 0
                ? `${activityTotal} bản ghi · Trang ${logPage}/${activityTotalPages}`
                : "Chưa có bản ghi"}
            </p>
          </div>
          <div className="flex gap-2">
            {(["all", "ERROR", "WARN", "INFO"] as const).map((level) => (
              <button
                key={level}
                onClick={() => {
                  setLogFilter(level);
                  setLogPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  logFilter === level
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {level === "all" ? "Tất cả" : level}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {isLogsLoading && activityLogs.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400 font-medium text-sm">
              Đang tải nhật ký...
            </div>
          ) : (
            activityLogs.map((log) => (
              <div
                key={log.id}
                className="px-6 py-3.5 flex items-start gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
              >
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500 shrink-0 mt-0.5 w-16">
                  {log.time}
                </span>
                <span
                  className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border mt-0.5 ${
                    log.level === "ERROR"
                      ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400"
                      : log.level === "WARN"
                        ? "border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400"
                        : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1">
                  {log.message}
                </span>
                <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block">
                  {log.source}
                </span>
              </div>
            ))
          )}
          {!isLogsLoading && activityLogs.length === 0 && (
            <div className="px-6 py-10 text-center text-slate-400 font-medium text-sm">
              Không có log nào phù hợp.
            </div>
          )}
        </div>
        <AppPagination
          page={logPage}
          totalPages={activityTotalPages}
          onChange={setLogPage}
        />
      </div>
    </div>
  );
};

export default ReportTab;

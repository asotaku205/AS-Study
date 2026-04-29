import React from 'react'
import { Database, Users, BookOpen, Activity, AlertTriangle, ArrowUpRight, UserCheck, FileText, CheckCircle2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from "recharts";
import initialUsers from "./mockData/Users";
import initialDocs from "./mockData/Docs";
import mockLogs from "./mockData/Logs";

const users = initialUsers;
const docs = initialDocs;

const userGrowthData = [
  { name: 'Mon', users: 120 },
  { name: 'Tue', users: 210 },
  { name: 'Wed', users: 350 },
  { name: 'Thu', users: 420 },
  { name: 'Fri', users: 540 },
  { name: 'Sat', users: 480 },
  { name: 'Sun', users: 600 },
];

const categoryData = [
  { name: 'Toán', value: 240 },
  { name: 'Văn', value: 120 },
  { name: 'Lý', value: 80 },
  { name: 'Hoá', value: 60 },
];

const MONOCHROME_COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8'];

const trafficSourceData = [
  { name: 'Direct', val: 400 },
  { name: 'Search', val: 300 },
  { name: 'Referral', val: 200 },
  { name: 'Social', val: 150 },
];

const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
const Overview = () => {
  return (
     <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Tổng quan hiệu suất</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Dữ liệu cập nhật tự động mỗi 5 phút.</p>
        </div>
        <button
        //   onClick={() => toast.success("Đang tạo báo cáo PDF...")}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-md"
        >
          <Database className="w-4 h-4" /> Xuất báo cáo
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Tổng người dùng", value: `${users.length + 12440}`, change: "+12%", icon: Users, isPositive: true },
          { label: "Tài liệu hệ thống", value: `${docs.length + 45813}`, change: "+8.5%", icon: BookOpen, isPositive: true },
          { label: "Lượt Quiz / Tuần", value: "142.5k", change: "+24%", icon: Activity, isPositive: true },
          { label: "Cảnh báo hệ thống", value: `${mockLogs.filter(l => l.level === "ERROR" || l.level === "WARN").length}`, change: "-2%", icon: AlertTriangle, isPositive: false },
        ].map((metric, idx) => (
          <div key={idx} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-6 rounded-2xl border border-white/40 dark:border-slate-800 shadow-lg flex flex-col justify-between hover:scale-[1.02] transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 w-fit bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <metric.icon className="w-5 h-5" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${metric.isPositive ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                {metric.change} <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
            <div>
              <p className="text-4xl font-black text-slate-900 dark:text-white mb-1">{metric.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">{metric.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">Tăng trưởng đăng ký</h3>
            <select className="text-sm font-semibold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2 outline-none shadow-sm">
              <option>7 ngày qua</option><option>30 ngày qua</option><option>90 ngày qua</option>
            </select>
          </div>
          <div className="flex-1 min-h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDark ? "#F8FAFC" : "#0F172A"} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={isDark ? "#F8FAFC" : "#0F172A"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1E293B" : "#E2E8F0"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? "#64748B" : "#94A3B8", fontSize: 13, fontWeight: 600 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? "#64748B" : "#94A3B8", fontSize: 13, fontWeight: 600 }} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: isDark ? "1px solid #334155" : "1px solid #E2E8F0", backgroundColor: isDark ? "rgba(15,23,42,0.9)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", color: isDark ? "#F8FAFC" : "#0F172A", fontWeight: 600 }} itemStyle={{ color: isDark ? "#F8FAFC" : "#0F172A" }} />
                <Area type="monotone" name="Đăng ký mới" dataKey="users" stroke={isDark ? "#F8FAFC" : "#0F172A"} strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl flex flex-col">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6">Tài liệu theo danh mục</h3>
          <div className="flex-1 min-h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {categoryData.map((_, idx) => (
                    <Cell key={idx} fill={MONOCHROME_COLORS[idx % MONOCHROME_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "10px", border: "none", backgroundColor: isDark ? "#0F172A" : "#FFFFFF", fontWeight: 600, color: isDark ? "#F8FAFC" : "#0F172A" }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", fontWeight: "700" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent activity + Source */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-5">Nguồn truy cập</h3>
          <div className="min-h-[200px]">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trafficSourceData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1E293B" : "#E2E8F0"} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? "#64748B" : "#94A3B8", fontSize: 12, fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? "#64748B" : "#94A3B8", fontSize: 12, fontWeight: 600 }} />
                <Tooltip cursor={{ fill: isDark ? "#1E293B" : "#F1F5F9" }} contentStyle={{ borderRadius: "12px", border: "none", backgroundColor: isDark ? "#0F172A" : "#FFFFFF", fontWeight: 600, color: isDark ? "#F8FAFC" : "#0F172A" }} />
                <Bar dataKey="val" name="Lượt truy cập" fill={isDark ? "#F8FAFC" : "#0F172A"} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-5">Hoạt động gần đây</h3>
          <div className="space-y-3">
            {[
              { icon: UserCheck, text: "Nguyễn Văn A đăng ký Premium", time: "2 phút trước", type: "success" },
              { icon: FileText, text: "Tài liệu 'Giải tích 2' chờ duyệt", time: "15 phút trước", type: "warn" },
              { icon: AlertTriangle, text: "Báo cáo vi phạm tài liệu ID d4", time: "32 phút trước", type: "error" },
              { icon: Users, text: "10 người dùng mới trong 1 giờ qua", time: "1 giờ trước", type: "info" },
              { icon: CheckCircle2, text: "Sao lưu tự động hoàn tất", time: "2 giờ trước", type: "success" },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.type === "success" ? "bg-slate-100 dark:bg-slate-800" : item.type === "warn" ? "bg-yellow-50 dark:bg-yellow-900/20" : item.type === "error" ? "bg-red-50 dark:bg-red-900/20" : "bg-slate-100 dark:bg-slate-800"}`}>
                  <item.icon className={`w-4 h-4 ${item.type === "success" ? "text-slate-700 dark:text-slate-300" : item.type === "warn" ? "text-yellow-600 dark:text-yellow-400" : item.type === "error" ? "text-red-600 dark:text-red-400" : "text-slate-600 dark:text-slate-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{item.text}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Overview
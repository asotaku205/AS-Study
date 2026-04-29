import { useMemo, useState } from 'react';
import { RefreshCw, Download, Wifi, Activity, Users, AlertCircle, Server, Cpu, HardDrive, Database } from 'lucide-react';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import mockLogs from './mockData/Logs';
import ResourceBar from './ResourceBar';

type LogLevel = 'all' | 'ERROR' | 'WARN' | 'INFO';

const apiUsageData = [
  { time: '00:00', requests: 120, errors: 2 },
  { time: '01:00', requests: 98, errors: 1 },
  { time: '02:00', requests: 75, errors: 0 },
  { time: '03:00', requests: 60, errors: 0 },
  { time: '04:00', requests: 45, errors: 1 },
  { time: '05:00', requests: 52, errors: 0 },
  { time: '06:00', requests: 88, errors: 1 },
];

const statusCards = [
  { label: 'Uptime', val: '99.9%', desc: '30 ngày qua', icon: Wifi, ok: true },
  { label: 'API Latency', val: '120ms', desc: 'Ổn định', icon: Activity, ok: true },
  { label: 'Active Sessions', val: '1,284', desc: 'Hiện tại', icon: Users, ok: true },
  { label: 'Error Rate', val: '1.8%', desc: '24h qua', icon: AlertCircle, ok: false },
] as const;

const toast = {
  success: (message: string) => console.log(message),
};

const ReportTab = () => {
  const [logFilter, setLogFilter] = useState<LogLevel>('all');
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

  const filteredLogs = useMemo(
    () => mockLogs.filter((log) => logFilter === 'all' || log.level === logFilter),
    [logFilter],
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Báo cáo hệ thống</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Giám sát API, tài nguyên máy chủ và log lỗi.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => toast.success('Đang làm mới dữ liệu...')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
          <button
            onClick={() => toast.success('Đang xuất file log...')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-md"
          >
            <Download className="w-4 h-4" /> Xuất Log
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusCards.map((sys, index) => (
          <div key={index} className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 rounded-2xl border border-white/40 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <sys.icon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </div>
              <div className={`w-2 h-2 rounded-full ${sys.ok ? 'bg-emerald-500' : 'bg-red-500'}`} />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{sys.val}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5">{sys.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-6 flex items-center gap-2">
          <Server className="w-5 h-5 text-slate-600 dark:text-slate-400" /> Tài nguyên máy chủ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ResourceBar label="CPU Usage" value={45} icon={Cpu} />
          <ResourceBar label="Memory (RAM)" value={72} icon={HardDrive} />
          <ResourceBar label="Disk Usage" value={58} icon={Database} />
          <ResourceBar label="Network I/O" value={33} icon={Wifi} />
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-slate-700 dark:text-slate-300" /> Lưu lượng API (24h qua)
          </h3>
          <div className="flex items-center gap-4 text-xs font-bold">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-slate-900 dark:bg-white inline-block rounded" /> Requests</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 inline-block rounded" /> Errors</span>
          </div>
        </div>
        <div className="min-h-70 w-full">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={apiUsageData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1E293B' : '#E2E8F0'} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 12, fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#64748B' : '#94A3B8', fontSize: 12, fontWeight: 600 }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: isDark ? '1px solid #334155' : '1px solid #E2E8F0', backgroundColor: isDark ? '#0F172A' : '#FFFFFF', fontWeight: 600 }} itemStyle={{ color: isDark ? '#F8FAFC' : '#0F172A' }} />
              <Line type="monotone" dataKey="requests" name="Requests" stroke={isDark ? '#F8FAFC' : '#0F172A'} strokeWidth={3} dot={false} />
              <Line type="monotone" dataKey="errors" name="Errors" stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 dark:text-white text-lg">System Logs gần đây</h3>
          <div className="flex gap-2">
            {(['all', 'ERROR', 'WARN', 'INFO'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setLogFilter(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  logFilter === level
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {level === 'all' ? 'Tất cả' : level}
              </button>
            ))}
          </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredLogs.map((log) => (
            <div key={log.id} className="px-6 py-3.5 flex items-start gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
              <span className="text-xs font-mono text-slate-400 dark:text-slate-500 shrink-0 mt-0.5 w-16">{log.time}</span>
              <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase border mt-0.5 ${
                log.level === 'ERROR'
                  ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400'
                  : log.level === 'WARN'
                    ? 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-400'
                    : 'border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {log.level}
              </span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1">{log.message}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block">{log.source}</span>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="px-6 py-10 text-center text-slate-400 font-medium text-sm">Không có log nào phù hợp.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportTab;
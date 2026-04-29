import type { DocStatus } from "./mockData/Docs";
import { AlertTriangle, CheckCircle2, Clock, X } from "lucide-react";
function DocStatusBadge({ status }: { status: DocStatus }) {
  switch (status) {
    case "Published": return <span className="inline-flex items-center gap-1.5 text-slate-900 dark:text-white font-bold text-xs"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Đã duyệt</span>;
    case "Pending": return <span className="inline-flex items-center gap-1.5 text-yellow-700 dark:text-yellow-400 font-bold text-xs"><Clock className="w-3.5 h-3.5" /> Chờ duyệt</span>;
    case "Reported": return <span className="inline-flex items-center gap-1.5 text-red-600 dark:text-red-400 font-bold text-xs"><AlertTriangle className="w-3.5 h-3.5" /> Bị báo cáo</span>;
    case "Rejected": return <span className="inline-flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-bold text-xs"><X className="w-3.5 h-3.5" /> Đã từ chối</span>;
  }
}
export default DocStatusBadge
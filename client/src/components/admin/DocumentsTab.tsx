import React, { useState } from 'react'
import { Search, AlertTriangle, FileCheck, FileX, Trash2, Eye, ChevronLeft, ChevronRight, FileText, Clock } from "lucide-react";
import initialDocs from './mockData/Docs';
import type { Doc } from './mockData/Docs';
import DocStatusBadge from './DocStatusBadge';

const DocumentsTab = ({ onViewDoc }: { onViewDoc: (doc: Doc | null) => void }) => {
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [docSearch, setDocSearch] = useState("");
  const [docStatusFilter, setDocStatusFilter] = useState<"all" | "Published" | "Pending" | "Reported" | "Rejected">("all");
  const [docPage, setDocPage] = useState(1);

  const DOCS_PER_PAGE = 8;

  const filteredDocs = docs.filter(doc => {
    if (docStatusFilter !== "all" && doc.status !== docStatusFilter) return false;
    if (docSearch.trim() === "") return true;
    return doc.title.toLowerCase().includes(docSearch.toLowerCase()) || doc.author.toLowerCase().includes(docSearch.toLowerCase());
  });

  const totalDocPages = Math.ceil(filteredDocs.length / DOCS_PER_PAGE);
  const pagedDocs = filteredDocs.slice((docPage - 1) * DOCS_PER_PAGE, docPage * DOCS_PER_PAGE);
   

  return (
     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Tài liệu & Học liệu</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Quản lý kho tài liệu cộng đồng và báo cáo vi phạm.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {([
          { label: "Tổng tài liệu", val: docs.length + 45813, icon: FileText, filter: "all" },
          { label: "Chờ duyệt", val: docs.filter(d => d.status === "Pending").length, icon: Clock, filter: "Pending" },
          { label: "Bị báo cáo", val: docs.filter(d => d.status === "Reported").length, icon: AlertTriangle, filter: "Reported" },
          { label: "Đã từ chối", val: docs.filter(d => d.status === "Rejected").length, icon: FileX, filter: "Rejected" },
        ] as const).map((stat, i) => (
          <button
            key={i}
            onClick={() => { setDocStatusFilter(stat.filter as typeof docStatusFilter); setDocPage(1); }}
            className={`bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 rounded-2xl border shadow-sm flex items-center gap-3 text-left hover:scale-[1.02] transition-transform ${docStatusFilter === stat.filter ? "border-slate-900 dark:border-white ring-2 ring-slate-900 dark:ring-white ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950" : "border-white/40 dark:border-slate-800"}`}
          >
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
              <stat.icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{typeof stat.val === "number" && stat.val > 1000 ? stat.val.toLocaleString() : stat.val}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mt-1">{stat.label}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text" value={docSearch} onChange={(e) => { setDocSearch(e.target.value); setDocPage(1); }}
              placeholder="Tìm tên tài liệu, tác giả..."
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all w-full"
            />
          </div>
          <select
            value={docStatusFilter}
            onChange={(e) => { setDocStatusFilter(e.target.value as typeof docStatusFilter); setDocPage(1); }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Published">Đã duyệt</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Reported">Bị báo cáo</option>
            <option value="Rejected">Đã từ chối</option>
          </select>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-950/60">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tên tài liệu</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Danh mục</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">Người đăng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {pagedDocs.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">Không tìm thấy tài liệu nào.</td></tr>
              ) : pagedDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[200px]">{doc.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{doc.date} • {doc.views.toLocaleString()} lượt xem</p>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-bold">{doc.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 hidden lg:table-cell whitespace-nowrap">{doc.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><DocStatusBadge status={doc.status} /></td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onViewDoc(doc)}
                        className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Xem chi tiết"
                      ><Eye className="w-4 h-4" /></button>
                      {doc.status === "Pending" && (
                        <>
                          <button onClick={() =>{}} className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors" title="Duyệt"><FileCheck className="w-4 h-4" /></button>
                          <button onClick={() => {}} className="p-2 text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors" title="Từ chối"><FileX className="w-4 h-4" /></button>
                        </>
                      )}
                      <button
                        onClick={() => {}}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Xoá"
                      ><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {filteredDocs.length === 0 ? "0 kết quả" : `Hiển thị ${(docPage - 1) * DOCS_PER_PAGE + 1}–${Math.min(docPage * DOCS_PER_PAGE, filteredDocs.length)} / ${filteredDocs.length}`}
          </span>
          <div className="flex gap-2 items-center">
            <button onClick={() => setDocPage((p) => Math.max(1, p - 1))} disabled={docPage === 1} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-3 text-sm font-bold text-slate-700 dark:text-slate-300">{docPage} / {totalDocPages}</span>
            <button onClick={() => setDocPage((p) => Math.min(totalDocPages, p + 1))} disabled={docPage === totalDocPages} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentsTab
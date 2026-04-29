import React from 'react'
import { X, FileCheck, FileX } from "lucide-react";
import { type Doc } from "./mockData/Docs";
import DocStatusBadge from "./DocStatusBadge";

const DocViewModal = ({ doc, onClose}: {
  doc: Doc; onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-lg animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-slate-900 dark:text-white text-xl">Chi tiết tài liệu</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Tên tài liệu</p>
            <p className="font-bold text-slate-900 dark:text-white">{doc.title}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Danh mục</p>
              <p className="font-bold text-slate-900 dark:text-white">{doc.category}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Người đăng</p>
              <p className="font-bold text-slate-900 dark:text-white">{doc.author}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Ngày đăng</p>
              <p className="font-bold text-slate-900 dark:text-white">{doc.date}</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Lượt xem</p>
              <p className="font-bold text-slate-900 dark:text-white">{doc.views.toLocaleString()}</p>
            </div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Trạng thái hiện tại</p>
            <DocStatusBadge status={doc.status} />
          </div>
        </div>
        {(doc.status === "Pending" || doc.status === "Reported") && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => onClose()}
              className="flex-1 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <span className="flex items-center justify-center gap-2"><FileX className="w-4 h-4" /> Từ chối</span>
            </button>
            <button
              onClick={() => onClose()}
              className="flex-1 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-md"
            >
              <span className="flex items-center justify-center gap-2"><FileCheck className="w-4 h-4" /> Duyệt tài liệu</span>
            </button>
          </div>
        )}
        {doc.status === "Published" && (
          <button onClick={onClose} className="w-full mt-6 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            Đóng
          </button>
        )}
      </div>
    </div>
  );
}

export default DocViewModal
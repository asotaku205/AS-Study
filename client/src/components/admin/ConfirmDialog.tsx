import React from 'react'
import { AlertCircle } from "lucide-react";

const ConfirmDialog = ({ open, title, description, confirmLabel = "Xác nhận", variant = "danger", onCancel }: {
  open: boolean; title: string; description: string;
  confirmLabel?: string; variant?: "danger" | "warning";
  onCancel: () => void;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${variant === "danger" ? "bg-red-50 dark:bg-red-900/20" : "bg-yellow-50 dark:bg-yellow-900/20"}`}>
          <AlertCircle className={`w-6 h-6 ${variant === "danger" ? "text-red-600 dark:text-red-400" : "text-yellow-600 dark:text-yellow-400"}`} />
        </div>
        <h3 className="font-black text-slate-900 dark:text-white text-lg mb-2">{title}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">{description}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            Huỷ
          </button>
          <button
            onClick={onCancel}
            className={`flex-1 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors text-white ${variant === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-yellow-600 hover:bg-yellow-700"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


export default ConfirmDialog
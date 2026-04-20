import React from 'react'
import { Plus, Search, Trash2 } from "lucide-react";

const HistoryChat = () => {
    const sessions: any[] = [
            {
                title: "Hôm nay ăn gì"
            },
            {
                title: "Cách trở thành người đẹp trai nhất Việt Nam"
            },
            {
                title: "Cách trở thành người giàu nhất thế giới"
            }
    
        ];
  return (
    <div className="hidden md:flex w-72 flex-col bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800">
        <div className="p-4">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 transition-colors shadow-sm">
            <Plus className="w-5 h-5" />
            Đoạn chat mới
          </button>
        </div>
        
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm lịch sử..." 
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">Gần đây</h3>
            <ul className="space-y-1">
              {sessions.map(s => (
                <li key={s.id}>
                  <button className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors flex items-center justify-between group truncate">
                    <span className="truncate pr-2">{s.title}</span>
                    <Trash2 className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 shrink-0" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-center text-slate-500 dark:text-slate-400">
          Lịch sử chat được lưu trữ cục bộ.
        </div>
      </div>
  )
}

export default HistoryChat
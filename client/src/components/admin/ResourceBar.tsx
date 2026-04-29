import React from 'react'

const  ResourceBar = ({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) => {
  const getColor = (v: number) => v >= 80 ? "bg-red-500" : v >= 60 ? "bg-yellow-500" : "bg-slate-900 dark:bg-white";
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{label}</span>
          <span className={`text-xs font-black ${value >= 80 ? "text-red-600 dark:text-red-400" : value >= 60 ? "text-yellow-600 dark:text-yellow-400" : "text-slate-900 dark:text-white"}`}>{value}%</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${getColor(value)}`} style={{ width: `${value}%` }} />
        </div>
      </div>
    </div>
  );
}

export default ResourceBar
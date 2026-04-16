import React from "react";

const StatsCard = ({
  icon,
  title,
  value,
}: {
  icon?: React.ReactNode;
  title: string;
  value: string;
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
        {icon}
      </div>
      <div>
        <p className="font-black text-xl text-slate-900 dark:text-white">
          {value}
        </p>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </p>
      </div>
    </div>
  );
};

export default StatsCard;

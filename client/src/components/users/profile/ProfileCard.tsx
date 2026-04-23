import React from "react";

const ProfileCard = ({ avatar, name, gmail, docs, quizzes }: { avatar: string; name: string; gmail: string; docs: number; quizzes: number }) => {
  return (
    <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-slate-800 p-8 text-center shadow-lg">
      <div className="w-24 h-24 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-5 shadow-inner">
        {avatar}
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
        {name}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">
        {gmail}
      </p>

      <div className="pt-6 border-t border-slate-200/50 dark:border-slate-700/50 grid grid-cols-2 gap-4">
        <div>
          <span className="block text-3xl font-black text-slate-900 dark:text-white">
            {docs}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
            Tài liệu lưu
          </span>
        </div>
        <div>
          <span className="block text-3xl font-black text-slate-900 dark:text-white">
            {quizzes }
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
            Quiz đã tạo
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

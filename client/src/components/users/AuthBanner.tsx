import React from "react";
import { Brain } from "lucide-react";

const AuthBanner = ({typeAuth, desc}: {typeAuth: string, desc: string}) => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center shadow-lg">
          <Brain className="w-8 h-8 text-white dark:text-slate-900" />
        </div>
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        {typeAuth}
      </h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {desc}
      </p>
    </div>
  );
};

export default AuthBanner;

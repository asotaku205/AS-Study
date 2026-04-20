import { Bot, User } from "lucide-react";
import {useState} from "react";
const Message = () => {
    const [messages,setMessage] = useState<{role:"ai" | "user", content: string}[]>([
        { role: "ai", content: "Xin chào! Tôi có thể giúp gì cho bạn?" }
    ]);
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === "ai"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-400"
                  : "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
              }`}
            >
              {msg.role === "ai" ? (
                <Bot className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>

            <div
              className={`flex flex-col gap-1.5 max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 px-1">
                {msg.role === "ai" ? "AI Scholarly" : "Bạn"}
              </span>
              <div
                className={`px-5 py-3.5 text-[15px] md:text-base leading-relaxed ${
                  msg.role === "user"
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl rounded-tr-sm shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div className="h-2" />
      </div>
    </div>
  );
};

export default Message;

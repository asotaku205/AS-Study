import React from "react";
import { Bot, User, Send } from "lucide-react";
import { useState } from "react";

const ChatQuiz = () => {
  const [messages, setMessage] = useState<
    { role: "ai" | "user"; content: string }[]
  >([{ role: "ai", content: "Xin chào! Tôi có thể giúp gì cho bạn?" }]);
  const [chatInput, setChatInput] = useState("");
  const handleSendChat = () => {
    // Logic to send chat message
    setChatInput("");
  };
  return (
    <div className="flex-1 lg:max-w-sm flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden h-[500px] lg:h-auto">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Bot className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </div>
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white leading-none">
            Trợ lý AI
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Hỗ trợ giải đáp
          </p>
        </div>
      </div>

      <div className="flex-1 p-5 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 space-y-6">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                msg.role === "ai"
                  ? "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm"
                  : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
              }`}
            >
              {msg.role === "ai" ? (
                <Bot className="w-4 h-4" />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div
              className={`flex flex-col gap-1 max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}
            >
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-1">
                {msg.role === "ai" ? "Trợ lý AI" : "Bạn"}
              </span>
              <div
                className={`px-4 py-3 text-[14px] font-medium leading-relaxed shadow-sm ${
                  msg.role === "user"
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl rounded-tr-sm"
                    : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        <div />
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form
          onSubmit={handleSendChat}
          className="relative flex items-center gap-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Nhờ AI gợi ý..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-shadow"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="absolute right-2 w-8 h-8 flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatQuiz;

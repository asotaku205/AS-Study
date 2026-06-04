import { Bot, User } from "lucide-react";
import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "../../../services/chatService";

interface MessageProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

const Message: React.FC<MessageProps> = ({ messages, isLoading }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}`}
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
                    ? "whitespace-pre-wrap bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl rounded-tr-sm shadow-sm"
                    : `bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm border border-slate-100 dark:border-slate-700 shadow-sm prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-50 dark:prose-code:bg-blue-950/40 prose-code:px-1 prose-code:rounded prose-pre:bg-slate-900 dark:prose-pre:bg-slate-950 prose-pre:rounded-xl ${
                        isLoading && i === messages.length - 1 && msg.content ? "typing" : ""
                      }`
                }`}
              >
                {msg.role === "user" ? (
                  msg.content
                ) : msg.content ? (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                ) : (
                  <div className="flex items-center gap-1.5 py-1">
                    <span className="w-1.5 h-1.5 bg-blue-900 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-900 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-blue-900 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}


      </div>
    </div>
  );
};

export default Message;


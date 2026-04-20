import  { Send } from "lucide-react";
import { useState } from "react";
const Input = () => {
    const [chatInput, setChatInput] = useState("");
    const handleSendChat = () => {
        // Logic to send chat message
        setChatInput("");
    };
  return (
    <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-3xl mx-auto relative">
        <form
          onSubmit={handleSendChat}
          className="relative flex items-end shadow-sm"
        >
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendChat();
              }
            }}
            placeholder="Nhắn tin cho AI..."
            className="w-full pl-5 pr-14 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-[15px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 transition-shadow resize-none max-h-40 min-h-[56px] placeholder-slate-400 dark:placeholder-slate-500"
            rows={1}
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="absolute right-2 bottom-2 w-10 h-10 flex items-center justify-center bg-slate-900 dark:bg-blue-900 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-blue-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
        <p className="text-center text-[11px] text-slate-400 mt-3 hidden md:block">
          AI có thể cung cấp thông tin không chính xác. Hãy kiểm chứng các thông
          tin quan trọng.
        </p>
      </div>
    </div>
  );
};

export default Input;

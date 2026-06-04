import { Send, Paperclip, X, FileText } from "lucide-react";
import React, { useState, useRef } from "react";

interface InputProps {
  onSendMessage: (text: string, files: File[]) => void;
  isLoading: boolean;
}

const Input: React.FC<InputProps> = ({ onSendMessage, isLoading }) => {
  const [chatInput, setChatInput] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!chatInput.trim() && attachedFiles.length === 0) || isLoading) return;
    onSendMessage(chatInput, attachedFiles);
    setChatInput("");
    setAttachedFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachedFiles((prev) => [...prev, ...filesArray]);
    }
    // Reset value to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    setAttachedFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="p-4 md:p-6 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-3xl mx-auto relative">
        
        {/* Attached Files Chips */}
        {attachedFiles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
            {attachedFiles.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm"
              >
                <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="max-w-[150px] truncate">{file.name}</span>
                <span className="text-[10px] text-slate-400 shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <form
          onSubmit={handleSendChat}
          className="relative flex items-end shadow-sm"
        >
          {/* File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.txt,.md,.csv,.xls,.xlsx,image/*"
          />

          {/* Attach File Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="absolute left-2 bottom-2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Input Text Area */}
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendChat();
              }
            }}
            placeholder={isLoading ? "AI đang suy nghĩ..." : "Nhắn tin cho AI (Đính kèm tài liệu bằng biểu tượng đính kèm)..."}
            className="w-full pl-12 pr-14 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-2xl text-[15px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 transition-shadow resize-none max-h-40 min-h-[56px] placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-75"
            rows={1}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={(!chatInput.trim() && attachedFiles.length === 0) || isLoading}
            className="absolute right-2 bottom-2 w-10 h-10 flex items-center justify-center bg-slate-900 dark:bg-blue-900 text-white rounded-xl hover:bg-slate-800 dark:hover:bg-blue-800 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </button>
        </form>
        <p className="text-center text-[11px] text-slate-400 mt-3 hidden md:block">
          AI có thể cung cấp thông tin không chính xác. Hãy kiểm chứng các thông tin quan trọng.
        </p>
      </div>
    </div>
  );
};

export default Input;


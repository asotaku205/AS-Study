import React from 'react';
import { Sparkles, FileText } from "lucide-react";
import type { Document } from "../../../types/documentTypes";

interface HistoryChatProps {
  documents: Document[];
  selectedDocId: number | undefined;
  onSelectDocument: (docId: number | undefined, docTitle: string | null) => void;
}

const HistoryChat: React.FC<HistoryChatProps> = ({
  documents,
  selectedDocId,
  onSelectDocument,
}) => {
  return (
    <div className="hidden md:flex w-72 flex-col bg-slate-50 dark:bg-slate-900/50 border-r border-slate-200 dark:border-slate-800">
      <div className="p-4">
        <button
          onClick={() => onSelectDocument(undefined, null)}
          className={`w-full flex items-center justify-center gap-2 py-3 border rounded-xl font-semibold transition-colors shadow-sm ${
            selectedDocId === undefined
              ? "bg-blue-900 text-white border-blue-950 dark:bg-blue-700 dark:border-blue-800"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          Trò chuyện tự do
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div>
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-2">
            Hỏi đáp theo tài liệu
          </h3>
          <ul className="space-y-1">
            {documents && documents.length > 0 ? (
              documents.map((doc) => (
                <li key={doc.id}>
                  <button
                    onClick={() => onSelectDocument(doc.id, doc.title)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 group truncate ${
                      selectedDocId === doc.id
                        ? "bg-slate-200 dark:bg-slate-800 text-blue-900 dark:text-blue-400 font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
                    }`}
                  >
                    <FileText className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-500" />
                    <span className="truncate flex-1">{doc.title}</span>
                    {!doc.ocrText && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 rounded">
                        Chưa OCR
                      </span>
                    )}
                  </button>
                </li>
              ))
            ) : (
              <li className="text-xs text-slate-400 dark:text-slate-500 text-center py-4">
                Chưa có tài liệu nào. Hãy tải lên tài liệu để bắt đầu hỏi đáp.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-center text-slate-500 dark:text-slate-400">
        Tính năng hỗ trợ bởi Google Gemini.
      </div>
    </div>
  );
};

export default HistoryChat;
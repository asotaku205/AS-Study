import { Bot, User, Send, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { chatWithAIStream } from "../../services/chatService";

type ChatBoxProps = {
  setIsChatOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  documentId?: number;
};

const ChatBox = ({ setIsChatOpen, documentId }: ChatBoxProps) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Chào bạn! Tôi là trợ lý AI của bạn. Hãy hỏi tôi bất cứ điều gì về bài học này.' },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    const chatInputText = chatInput.trim();
    if (!chatInputText || isThinking) return;

    // 1. Thêm tin nhắn người dùng vào danh sách
    const updatedMessages = [...messages, { role: 'user' as const, content: chatInputText }];
    setMessages(updatedMessages);
    setChatInput("");
    setIsThinking(true);

    try {
      let hasStartedResponse = false;

      // Gọi stream API
      await chatWithAIStream(
        chatInputText,
        undefined, // sessionId (auto-create on backend if needed)
        (chunk) => {
          setIsThinking(false);
          if (!hasStartedResponse) {
            hasStartedResponse = true;
            setMessages((prev) => [...prev, { role: 'ai', content: chunk }]);
          } else {
            setMessages((prev) => {
              const updated = [...prev];
              const lastIdx = updated.length - 1;
              updated[lastIdx] = {
                ...updated[lastIdx],
                content: updated[lastIdx].content + chunk,
              };
              return updated;
            });
          }
        },
        () => {
          // Stream hoàn thành
          setIsThinking(false);
        },
        (err: any) => {
          setIsThinking(false);
          console.error("Lỗi AI stream:", err);
          setMessages((prev) => [
            ...prev,
            { role: 'ai', content: ` Đã xảy ra lỗi: ${err.message || "Không thể kết nối với AI."}` }
          ]);
        },
        undefined, // onSessionCreated
        undefined, // documentIds
        documentId // documentId
      );
    } catch (error: any) {
      setIsThinking(false);
      console.error("Lỗi khi kết nối chat AI:", error);
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: ` Đã xảy ra lỗi: ${error.message || "Không thể kết nối với AI."}` }
      ]);
    }
  };

  return (
    <div className="w-full lg:w-[35%] flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm lg:shadow-[-10px_0_30px_rgba(0,0,0,0.03)] h-[70dvh] lg:h-full rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Bot className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white leading-none">Trợ lý AI</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Đang trực tuyến</p>
          </div>
        </div>
        <button
          onClick={() => setIsChatOpen?.(false)}
          className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          aria-label="Đóng chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        <div className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 mb-6">Hôm nay</div>

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${msg.role === 'ai'
                ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm'
                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
              }`}>
              {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-1">
                {msg.role === 'ai' ? 'Trợ lý AI' : 'Bạn'}
              </span>
              <div className={`px-4 py-3 text-[15px] font-medium leading-relaxed shadow-sm prose prose-sm dark:prose-invert max-w-none ${msg.role === 'user'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl rounded-tr-sm'
                  : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm'
                }`}>
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Thinking State */}
        {isThinking && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex flex-col gap-1 items-start">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-1">
                Trợ lý AI đang nghĩ...
              </span>
              <div className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSendChat} className="relative flex items-end gap-2">
          <textarea
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendChat(e);
              }
            }}
            placeholder="Hỏi AI về bài học này..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-shadow resize-none min-h-12 max-h-32"
            rows={1}
            disabled={isThinking}
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isThinking}
            className="absolute right-2 bottom-2 w-8 h-8 flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-200 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
        <div className="text-[10px] font-medium text-center text-slate-400 dark:text-slate-500 mt-3">
          AI có thể mắc sai lầm. Hãy kiểm tra lại thông tin quan trọng.
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

import { Bot, User, Send,X } from "lucide-react";
import { useState } from "react";

type ChatBoxProps = {
  setIsChatOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChatBox = ({ setIsChatOpen }: ChatBoxProps) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([
    { role: 'ai', content: 'Chào bạn! Tôi là trợ lý AI của bạn. Hãy hỏi tôi bất cứ điều gì về bài học này.' },
  ]);
  const [chatInput, setChatInput] = useState("");
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Thêm tin nhắn người dùng vào danh sách
    setMessages((prev) => [...prev, { role: 'user', content: chatInput }]);
    
    // Xử lý phản hồi từ AI (giả lập với timeout)
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', content: 'Đây là câu trả lời giả lập từ AI cho câu hỏi của bạn.' }]);
    }, 1000);

    // Xóa input sau khi gửi
    setChatInput("");
  }
  return (
    <div className="w-full lg:w-[35%] flex flex-col bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm lg:shadow-[-10px_0_30px_rgba(0,0,0,0.03)] h-[70dvh] lg:h-full rounded-2xl">
          
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between sticky top-0">
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
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === 'ai' ? 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 shadow-sm' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                }`}>
                  {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>
                
                <div className={`flex flex-col gap-1 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 px-1">
                    {msg.role === 'ai' ? 'Trợ lý AI' : 'Bạn'}
                  </span>
                  <div className={`px-4 py-3 text-[15px] font-medium leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl rounded-tr-sm' 
                      : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            <div  />
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
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
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

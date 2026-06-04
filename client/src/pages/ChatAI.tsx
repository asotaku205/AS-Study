import { useState, useEffect } from "react";
import { Bot, Plus, Trash2, Menu, X, MessageSquare } from "lucide-react";
import Message from "../components/users/chatbox/Message";
import Input from "../components/users/chatbox/Input";
import {
  chatWithAIStream,
  getChatSessions,
  getChatSessionMessages,
  deleteChatSession,
} from "../services/chatService";
import type { ChatMessage, ChatSession } from "../services/chatService";
import { getUserProfile } from "../services/userService";
import { uploadDocument, runOcrForDocument } from "../services/documentService";
import { toast } from "react-toastify";

const INITIAL_GREETING: ChatMessage = {
  role: "ai",
  content:
    "Xin chào! Tôi là Trợ lý AI Scholarly. Bạn có thể hỏi tôi bất kỳ câu hỏi nào, hoặc đính kèm các tài liệu học tập vào khung chat để tôi hỗ trợ học tập dựa trên nội dung tài liệu đó nhé!",
};

const ChatAI = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch list of past conversations
  const loadSessions = async () => {
    try {
      const data = await getChatSessions();
      setSessions(data);
    } catch (err: any) {
      console.error("Lỗi khi tải lịch sử chat:", err);
      toast.error("Không thể tải lịch sử cuộc trò chuyện.");
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // Handle selecting a session from sidebar
  const handleSelectSession = async (sessionId: number) => {
    setIsSidebarOpen(false); // Close sidebar on mobile
    setCurrentSessionId(sessionId);
    setIsLoading(true);
    try {
      const dbMessages = await getChatSessionMessages(sessionId);
      if (dbMessages.length === 0) {
        setMessages([INITIAL_GREETING]);
      } else {
        setMessages(dbMessages);
      }
    } catch (err: any) {
      console.error("Lỗi khi tải tin nhắn:", err);
      toast.error("Không thể tải cuộc trò chuyện này.");
      setMessages([INITIAL_GREETING]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle starting a new chat session
  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([INITIAL_GREETING]);
    setIsSidebarOpen(false);
  };

  // Handle deleting a session
  const handleDeleteSession = async (e: React.MouseEvent, sessionId: number) => {
    e.stopPropagation(); // Avoid selecting the session when clicking delete
    if (!window.confirm("Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?")) return;

    try {
      await deleteChatSession(sessionId);
      toast.success("Xóa hội thoại thành công!");
      
      // Update session list
      setSessions(prev => prev.filter(s => s.id !== sessionId));

      // Reset to new chat if deleted session was active
      if (currentSessionId === sessionId) {
        handleNewChat();
      }
    } catch (err: any) {
      console.error("Lỗi khi xóa hội thoại:", err);
      toast.error("Không thể xóa cuộc trò chuyện.");
    }
  };

  const handleSendMessage = async (text: string, files: File[]) => {
    if (!text.trim() && files.length === 0) return;

    setIsLoading(true);
    let documentIds: number[] = [];

    if (files.length > 0) {
      try {
        toast.info("Đang xử lý tài liệu đính kèm...");
        const profile = await getUserProfile();
        const ownerUserId = profile.id;

        for (const file of files) {
          toast.info(`Đang tải lên tệp: ${file.name}...`);
          const formData = new FormData();
          formData.append("file", file);
          formData.append("title", file.name);
          formData.append("description", "Tài liệu tải lên trực tiếp trong hội thoại chat");
          formData.append("ownerUserId", String(ownerUserId));
          formData.append("categoryId", "1"); // Mặc định categoryId là 1
          formData.append("visibility", "private"); // Luôn là private

          const uploadedDoc = await uploadDocument(formData);

          toast.info(`Đang trích xuất chữ (OCR) cho tệp: ${file.name}...`);
          const ocrResult = await runOcrForDocument(uploadedDoc.id);
          
          if (ocrResult && ocrResult.id) {
            documentIds.push(ocrResult.id);
          }
        }
        toast.success("Xử lý tài liệu thành công!");
      } catch (error: any) {
        console.error("Lỗi khi tải lên/xử lý tài liệu:", error);
        toast.error("Không thể xử lý một hoặc nhiều tài liệu đính kèm.");
        setIsLoading(false);
        return;
      }
    }

    // Tạo hiển thị tin nhắn user
    let displayContent = text;
    if (files.length > 0) {
      const fileListStr = files.map(f => `📄 ${f.name}`).join(", ");
      displayContent = `${text}\n\n*(Đã đính kèm tài liệu: ${fileListStr})*`;
    }

    const userMsg: ChatMessage = { role: "user", content: displayContent };
    const updatedMessages = messages[0]?.role === "ai" && messages.length === 1 && messages[0].content === INITIAL_GREETING.content
      ? [userMsg] 
      : [...messages, userMsg];

    setMessages([...updatedMessages, { role: "ai", content: "" }]);

    try {
      let aiResponse = "";
      
      await chatWithAIStream(
        text,
        currentSessionId || undefined,
        (chunk) => {
          setIsLoading(false); // Khi có chunk đầu tiên, tắt trạng thái loading dots
          aiResponse += chunk;
          setMessages((prev) => {
            const next = [...prev];
            if (next.length > 0 && next[next.length - 1].role === "ai") {
              next[next.length - 1] = {
                ...next[next.length - 1],
                content: aiResponse,
              };
            }
            return next;
          });
        },
        () => {
          setIsLoading(false);
          loadSessions(); // Reload sessions to show updated titles or active session
        },
        (error) => {
          setIsLoading(false);
          console.error(error);
          const errMsg = error.message || "Đã xảy ra lỗi khi kết nối với AI.";
          setMessages((prev) => {
            const next = [...prev];
            if (next.length > 0 && next[next.length - 1].role === "ai" && !next[next.length - 1].content) {
              next[next.length - 1] = { role: "ai", content: `Lỗi: ${errMsg}` };
            } else {
              next.push({ role: "ai", content: `Lỗi: ${errMsg}` });
            }
            return next;
          });
        },
        (newSessionId) => {
          setCurrentSessionId(newSessionId);
        },
        documentIds
      );
    } catch (error: any) {
      console.error(error);
      setIsLoading(false);
      const errMsg = error.message || "Đã xảy ra lỗi khi kết nối với AI.";
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: `Lỗi: ${errMsg}` },
      ]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
      
      {/* Sidebar - Lịch sử chat */}
      <div className={`
        absolute inset-y-0 left-0 z-20 w-72 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 md:static md:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
            <MessageSquare className="w-5 h-5 text-blue-800 dark:text-blue-400" />
            <span>Lịch sử trò chuyện</span>
          </div>
          {/* Close button on mobile */}
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="p-1 md:hidden hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Cuộc trò chuyện mới</span>
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
          {sessions.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 dark:text-slate-600">
              Không có hội thoại cũ
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => handleSelectSession(session.id)}
                className={`
                  group w-full flex items-center justify-between p-3 rounded-xl cursor-pointer text-sm transition-all
                  ${currentSessionId === session.id 
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 font-medium" 
                    : "hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300"}
                `}
              >
                <div className="flex items-center gap-2.5 overflow-hidden w-full pr-2">
                  <MessageSquare className={`w-4 h-4 flex-shrink-0 ${currentSessionId === session.id ? "text-blue-700 dark:text-blue-400" : "text-slate-400 dark:text-slate-600"}`} />
                  <span className="truncate w-full text-left">{session.title}</span>
                </div>
                
                {/* Delete button (hidden by default, shown on group-hover) */}
                <button
                  onClick={(e) => handleDeleteSession(e, session.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-red-600 dark:text-slate-600 dark:hover:text-red-400 transition-all"
                  title="Xóa cuộc hội thoại"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)} 
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs z-10 md:hidden"
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-slate-900 min-w-0">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 z-10 bg-slate-50/50 dark:bg-slate-900/50">
          {/* Menu button on mobile */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1.5 md:hidden hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 flex-shrink-0"
          >
            <Menu className="w-5.5 h-5.5" />
          </button>

          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white truncate">
            <Bot className="w-5 h-5 text-blue-900 dark:text-blue-400 flex-shrink-0" />
            <div className="truncate">
              <span>Trợ lý AI</span>
              {currentSessionId && sessions.length > 0 && (
                <span className="ml-2 font-normal text-xs text-slate-500 dark:text-slate-400 truncate hidden sm:inline">
                  — {sessions.find(s => s.id === currentSessionId)?.title}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Messages */}
        <Message messages={messages} isLoading={isLoading} />

        {/* Input Area */}
        <Input onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatAI;
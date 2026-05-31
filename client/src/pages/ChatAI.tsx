import { useState, useEffect } from "react";
import { Bot } from "lucide-react";
import Message from "../components/users/chatbox/Message";
import Input from "../components/users/chatbox/Input";
import HistoryChat from "../components/users/chatbox/HistoryChat";
import { chatWithAIStream } from "../services/chatService";
import type { ChatMessage } from "../services/chatService";
import { getMyDocuments } from "../services/documentService";
import type { Document } from "../types/documentTypes";

const ChatAI = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content:
        "Xin chào! Tôi là Trợ lý AI Scholarly. Bạn có thể hỏi tôi bất kỳ câu hỏi nào, hoặc chọn một tài liệu ở cột bên trái để tôi hỗ trợ học tập dựa trên nội dung tài liệu đó nhé!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<number | undefined>(undefined);
  const [selectedDocTitle, setSelectedDocTitle] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await getMyDocuments();
        setDocuments(data);
      } catch (error) {
        console.error("Lỗi khi tải tài liệu:", error);
      }
    };
    fetchDocs();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    
    // Thêm tin nhắn user và một khung tin nhắn AI rỗng để hứng dữ liệu stream
    setMessages([...updatedMessages, { role: "ai", content: "" }]);
    setIsLoading(true);

    try {
      const limitedHistory = updatedMessages.slice(-20);
      let aiResponse = "";
      
      await chatWithAIStream(
        text,
        selectedDocId,
        limitedHistory,
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
        }
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

  const handleSelectDocument = (docId: number | undefined, docTitle: string | null) => {
    setSelectedDocId(docId);
    setSelectedDocTitle(docTitle);

    if (docId) {
      setMessages([
        {
          role: "ai",
          content: `Tôi đã sẵn sàng hỗ trợ bạn học tập với tài liệu: "${docTitle}". Bạn có thể yêu cầu tôi tóm tắt tài liệu, giải thích các khái niệm hoặc đặt câu hỏi ôn tập dựa trên tài liệu này!`,
        },
      ]);
    } else {
      setMessages([
        {
          role: "ai",
          content: "Tôi đã chuyển sang chế độ trò chuyện tự do. Bạn có thể đặt bất kỳ câu hỏi kiến thức chung nào!",
        },
      ]);
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Sidebar - History / Document selection */}
      <HistoryChat
        documents={documents}
        selectedDocId={selectedDocId}
        onSelectDocument={handleSelectDocument}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-slate-900">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Bot className="w-5 h-5 text-blue-900 dark:text-blue-400" />
            <div>
              <span>Trợ lý AI</span>
              {selectedDocTitle && (
                <span className="ml-2 px-2.5 py-0.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full inline-block max-w-[150px] md:max-w-[300px] truncate align-middle">
                  📚 {selectedDocTitle}
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
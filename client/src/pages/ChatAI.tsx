import { useState } from "react";
import { Bot } from "lucide-react";
import Message from "../components/users/chatbox/Message";
import Input from "../components/users/chatbox/Input";
import { chatWithAIStream } from "../services/chatService";
import type { ChatMessage } from "../services/chatService";
import { getUserProfile } from "../services/userService";
import { uploadDocument, runOcrForDocument } from "../services/documentService";
import { toast } from "react-toastify";

const ChatAI = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content:
        "Xin chào! Tôi là Trợ lý AI Scholarly. Bạn có thể hỏi tôi bất kỳ câu hỏi nào, hoặc đính kèm các tài liệu học tập vào khung chat để tôi hỗ trợ học tập dựa trên nội dung tài liệu đó nhé!",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

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
    const updatedMessages = [...messages, userMsg];

    setMessages([...updatedMessages, { role: "ai", content: "" }]);

    try {
      const limitedHistory = updatedMessages.slice(-20);
      let aiResponse = "";

      await chatWithAIStream(
        text,
        undefined, // documentId
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
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-slate-900">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Bot className="w-5 h-5 text-blue-900 dark:text-blue-400" />
            <div>
              <span>Trợ lý AI</span>
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
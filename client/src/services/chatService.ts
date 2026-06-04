import api, { getAccessToken } from "./api";

export interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

export const chatWithAI = async (
  message: string,
  documentId?: number,
  history?: ChatMessage[]
): Promise<string> => {
  const response = await api.post("/chat", {
    message,
    documentId,
    history,
  });
  return response.data.reply;
};

export const chatWithAIStream = async (
  message: string,
  documentId: number | undefined,
  history: ChatMessage[] | undefined,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: any) => void,
  documentIds?: number[]
): Promise<void> => {
  try {
    const token = getAccessToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let response = await fetch(`${import.meta.env.VITE_API_URL}/chat/stream`, {
      method: "POST",
      headers,
      body: JSON.stringify({ message, documentId, history, documentIds }),
    });

    if (response.status === 401) {
      try {
        const refreshRes = await api.post("/auth/refresh");
        const newToken = refreshRes.data.access_token;
        if (newToken) {
          headers["Authorization"] = `Bearer ${newToken}`;
          response = await fetch(`${import.meta.env.VITE_API_URL}/chat/stream`, {
            method: "POST",
            headers,
            body: JSON.stringify({ message, documentId, history, documentIds }),
          });
        }
      } catch (refreshErr) {
        console.error("Lỗi refresh token khi stream:", refreshErr);
      }
    }

    if (!response.ok) {
      const errText = await response.text();
      let errMsg = "Đã xảy ra lỗi khi kết nối với AI.";
      try {
        const parsed = JSON.parse(errText);
        errMsg = parsed.message || parsed.error || errMsg;
      } catch {
        // Keep default
      }
      throw new Error(errMsg);
    }

    if (!response.body) {
      throw new Error("Không thể khởi tạo luồng dữ liệu (ReadableStream is null).");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");

      // Giữ lại phần chưa kết thúc của dòng cuối cùng
      buffer = lines.pop() || "";

      for (const line of lines) {
        const cleanedLine = line.trim();
        if (!cleanedLine) continue;

        if (cleanedLine.startsWith("data: ")) {
          const dataStr = cleanedLine.slice(6).trim();
          if (dataStr === "[DONE]") {
            onDone();
            return;
          }

          try {
            const dataObj = JSON.parse(dataStr);
            if (dataObj.error) {
              onError(new Error(dataObj.error));
              return;
            }
            if (dataObj.text) {
              onChunk(dataObj.text);
            }
          } catch (e) {
            console.error("Lỗi parse chunk JSON:", e);
          }
        }
      }
    }
  } catch (error: any) {
    onError(error);
  }
};

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  hint: string;
  explanation: string;
}

export const generateAIQuiz = async (
  text: string,
  difficulty: "basic" | "advanced" | "expert",
  questionCount: number
): Promise<{ questions: QuizQuestion[] }> => {
  const response = await api.post("/chat/generate-quiz", {
    text,
    difficulty,
    questionCount,
  });
  return response.data;
};

export const generateAILecture = async (
  text: string,
  studyMode: "comprehensive" | "summary" | "practical"
): Promise<{ title: string; content: string }> => {
  const response = await api.post("/chat/generate-lecture", {
    text,
    studyMode,
  });
  return response.data;
};


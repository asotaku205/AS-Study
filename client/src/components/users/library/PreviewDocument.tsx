import {
  getPreviewDocument,
  getPreviewUrl,
} from "../../../services/documentService";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Document } from "../../../types/documentTypes";

type Props = {
  doc: Document;
};

const PreviewDocument = ({ doc }: Props) => {
  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    const loadTextContent = async () => {
      try {
        if (
          doc.mimeType.includes("markdown") ||
          doc.mimeType === "text/plain"
        ) {
          const blob = await getPreviewDocument(doc.id);

          const text = await blob.text();

          setTextContent(text);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadTextContent();
  }, [doc]);

  // IMAGE
  if (doc.mimeType.startsWith("image/")) {
    return (
      <img
        src={getPreviewUrl(doc.id)}
        alt={doc.title}
        className="
w-full
max-h-[800px]
object-contain
bg-black/5
dark:bg-white/5
"
      />
    );
  }

  // PDF
  if (doc.mimeType.includes("pdf")) {
    return (
      <iframe
        src={getPreviewUrl(doc.id)}
        className="
w-full
h-[85vh]
min-h-[700px]
bg-white
"
      />
    );
  }

  // VIDEO
  if (doc.mimeType.startsWith("video/")) {
    return (
      <video
        controls
        className="
w-full
max-h-[80vh]
bg-black
"
      >
        <source src={getPreviewUrl(doc.id)} type={doc.mimeType} />
      </video>
    );
  }

  // AUDIO
  if (doc.mimeType.startsWith("audio/")) {
    return (
      <div className="flex items-center justify-center min-h-[300px] p-10">
        <audio controls className="w-full max-w-2xl">
          <source src={getPreviewUrl(doc.id)} type={doc.mimeType} />
        </audio>
      </div>
    );
  }

  // MARKDOWN
  if (doc.mimeType.includes("markdown")) {
    return (
      <div
        className="
  prose
  prose-slate
  dark:prose-invert
  max-w-none
  p-10
  overflow-auto
  h-[85vh]

  prose-headings:font-black
  prose-headings:text-slate-900
  dark:prose-headings:text-white

  prose-p:text-slate-700
  dark:prose-p:text-slate-300

  prose-code:bg-slate-100
  dark:prose-code:bg-slate-800
  prose-code:px-1
  prose-code:py-0.5
  prose-code:rounded

  prose-pre:bg-slate-900
  prose-pre:text-slate-100

  prose-a:text-blue-600
  dark:prose-a:text-blue-400
"
      >
        {" "}
        <ReactMarkdown>{textContent}</ReactMarkdown>
      </div>
    );
  }

  // TXT
  if (doc.mimeType === "text/plain") {
    return (
      <pre
        className="
  h-[85vh]
  overflow-auto
  p-10
  text-sm
  leading-7
  whitespace-pre-wrap
  font-mono
  text-slate-700
  dark:text-slate-300
"
      >
        {" "}
        {textContent}
      </pre>
    );
  }

  // FILE KHÔNG HỖ TRỢ
  return (
    <div className="flex items-center justify-center min-h-[500px] p-10 text-center">
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white mb-2">
          Chưa tải được bản xem trước
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium">
          Bạn có thể học với AI hoặc tạo Quiz để AI phân tích và tóm tắt nội
          dung chi tiết cho bạn.
        </p>
      </div>
    </div>
  );
};

export default PreviewDocument;

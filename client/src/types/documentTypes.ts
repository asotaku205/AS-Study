export type DocumentStatus = "Published" | "Pending" | "Reported" | "Rejected" |"Draft";
export type DocumentVisibility = "public" | "private";

export interface Document {
  id: number;

  title: string;

  description: string;

  fileUrl: string;

  status: DocumentStatus;

  visibility: DocumentVisibility;

  createdAt: string;
  mimeType: string;
  ownerUserId: number;
  originalName: string;
  categoryId: number;
  pageCount: number | null;
  viewCount: number;
  quizCount?: number;
  ocrText?: string | null;
  owner?: {
    id: number;
    name: string;
    email: string;
  };
  category?: {
    id: number;
    name: string;
  };
}

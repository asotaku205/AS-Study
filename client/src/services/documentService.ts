import type { DocumentStatus, DocumentVisibility } from "../types/documentTypes";
import api from "./api";

export const uploadDocument = async (formdata: FormData) => {
  const response = await api.post("/documents/upload", formdata, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return response.data;
};
export const getAllDocuments = async () => {
  const response = await api.get("/documents");
  return response.data;
}
export const getDocumentById = async (id: number) => {
  const response = await api.get(`/documents/${id}`);
  return response.data;
}
export const updateDocumentStatus = async (id: number, status: DocumentStatus) => {
  const response = await api.patch(`/documents/${id}/status`, { status });
  return response.data;
}
export const getMyDocuments = async () => {
  const response = await api.get("/documents/my-documents");
  return response.data;
}
export const getPublicDocuments = async () => {
  const response = await api.get("/documents/public");
  return response.data;
}
export const changeDocumentVisibility = async (
  id: number,
  visibility: DocumentVisibility,
) => {
  const res = await api.patch(`/documents/${id}/visibility`, {
    visibility,
  });
  return res.data;
};
export const deleteDocument = async (id: number) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
}
export const getFeaturedDocuments = async () => {
  const response = await api.get("/documents/featured");
  return response.data;
}
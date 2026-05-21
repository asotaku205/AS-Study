import { useEffect, useState } from "react";
import { getAllDocuments } from "../services/documentService";
import type { Document } from "../types/documentTypes";
const useGetDocument = () => {
  const [docs, setDocs] = useState<Document[]>([]);

  useEffect(() => {
    const loadDocs = async () => {
      const res = (await getAllDocuments()) as Document[];
      setDocs(res);
    };
    loadDocs();
  }, []);
  return { docs, setDocs };
};
export default useGetDocument;
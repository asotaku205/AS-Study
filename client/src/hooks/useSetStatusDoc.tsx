import { useState } from "react";
import { updateDocumentStatus } from "../services/documentService";
import type { DocumentStatus } from "../types/documentTypes";

const useSetStatusDoc = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const updateStatus = async (id: number, status: DocumentStatus) => {
        setIsLoading(true);
        setError(null);

        try {
            await updateDocumentStatus(id, status);
            return true;
        } catch (err) {
            console.error("Error updating document status:", err);
            setError(err);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { updateStatus, isLoading, error };
};

export default useSetStatusDoc;
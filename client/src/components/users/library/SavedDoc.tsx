import { Link } from "react-router-dom";
import {
  Clock,
  Eye,
  FileText,
  FolderOpen,
  Share2,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  changeDocumentVisibility,
  getMyDocuments,
  incrementDocumentViewCount,
  updateDocumentStatus,
} from "../../../services/documentService";
import type {
  Document,
  DocumentStatus,
  DocumentVisibility,
} from "../../../types/documentTypes";
import useGetFileBadge from "../../../hooks/useGetFileBadge";
import { toast } from "react-toastify/unstyled";
import AppPagination from "../../Pagination";

interface SavedDocProps {
  activeTab: "all" | "published" | "private";
  searchQuery: string;
}
const SavedDoc = ({ activeTab, searchQuery }: SavedDocProps) => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocs = async () => {
      try {
        setIsLoading(true);
        const data = await getMyDocuments();
        setDocs(data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocs();
  }, [activeTab, searchQuery]);

  const getFileBadge = useGetFileBadge();
  const filteredDocs = useMemo(() => {
  return docs.filter((doc) => {
    if (activeTab === "private" && doc.visibility !== "private")
      return false;

    if (activeTab === "published" && doc.visibility !== "public")
      return false;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();

      const matchTitle = doc.title?.toLowerCase().includes(query);

      const matchDesc = doc.description
        ?.toLowerCase()
        .includes(query);

      return matchTitle || matchDesc;
    }

    return true;
  });
}, [docs, activeTab, searchQuery]);

  const handlePublic = async (id: number, visibility: DocumentVisibility) => {
    const ok = await changeDocumentVisibility(id, visibility);
    if (ok) {
      setDocs((prev) =>
        prev.map((doc) => (doc.id === id ? { ...doc, visibility } : doc)),
      );
      toast.success("Công khai tài liệu thành công!");
    }
    if (!ok) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái tài liệu.");
    }
  };
  const ITEMS_PER_PAGE = 6;
  const [page, setPage] = useState(1);

  
  const totalPages = Math.max(
    1,
    Math.ceil(filteredDocs.length / ITEMS_PER_PAGE),
  );
  const pagedDocs = filteredDocs.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const handleViewCountIncrement = async (id: number) => {
    try {
      await incrementDocumentViewCount(id); 
    } catch (error) {
      console.error("Error incrementing view count:", error);
    }
  };
  return (
    <>
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pagedDocs.map((doc) => (
            <div
              key={doc.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-5 flex flex-col relative"
            >
              <div className="flex justify-between items-start mb-3">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border `}
                >
                  {getFileBadge(doc.fileUrl)}
                </span>

                <div className="flex gap-2">
                  {doc.status === "Published" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-md text-xs font-bold">
                      <Share2 className="w-3 h-3" />
                      Đã Publish
                    </span>
                  )}
                  {doc.status === "Draft" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-md text-xs font-bold">
                      <Eye className="w-3 h-3" />
                      Riêng tư
                    </span>
                  )}
                  {doc.status === "Pending" && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 rounded-md text-xs font-bold">
                      <Clock className="w-3 h-3" /> Đang chờ duyệt
                    </span>
                  )}
                </div>
              </div>
              <Link to={`/library/${doc.id}`} className="block flex-1" onClick={() => handleViewCountIncrement(doc.id)}>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 font-medium">
                  {doc.description}
                </p>
              </Link>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3" /> {doc.viewCount} lượt xem
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />{" "}
                    {new Date(doc.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {doc.visibility === "private" && (
                    <button
                      onClick={() => {
                        handlePublic(doc.id, "public");
                      }}
                      className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                      title="Publish lên cộng đồng"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {}}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Xóa tài liệu"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            Chưa có tài liệu nào
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Bạn chưa lưu hoặc tải lên tài liệu nào trong mục này.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Tải lên ngay
          </Link>
        </div>
      )}
      <AppPagination page={page} totalPages={totalPages} onChange={setPage} />
    </>
  );
};

export default SavedDoc;

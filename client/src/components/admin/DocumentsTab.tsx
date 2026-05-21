import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  AlertTriangle,
  FileCheck,
  FileX,
  Trash2,
  Eye,
  FileText,
  Clock,
} from "lucide-react";

import DocStatusBadge from "./DocStatusBadge";
import type { Document, DocumentStatus } from "../../types/documentTypes";
import useSetStatusDoc from "../../hooks/useSetStatusDoc";
import { toast } from "react-toastify";
import AppPagination from "../Pagination";
import { deleteDocument } from "../../services/documentService";


const DocumentsTab = ({
  docs,
  onViewDoc,
  onStatusUpdated,
  onDeleteDoc,
}: {
  docs: Document[];
  onViewDoc: (doc: Document | null) => void;
  onStatusUpdated?: (id: number, status: DocumentStatus) => void;
  onDeleteDoc: (id: number) => void;
}) => {
  const [docSearch, setDocSearch] = useState("");
  const [docStatusFilter, setDocStatusFilter] = useState<
    "all" | "Published" | "Pending" | "Reported" | "Rejected" | "Draft"
  >("all");
  const [docPage, setDocPage] = useState(1);
  const { updateStatus, isLoading } = useSetStatusDoc();

  const DOCS_PER_PAGE = 5;

  const filteredDocs = useMemo(() => {
    return docs.filter((doc) => {
      const matchStatus =
        docStatusFilter === "all" || doc.status === docStatusFilter;

      const matchSearch =
        docSearch.trim() === "" ||
        doc.title.toLowerCase().includes(docSearch.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [docs, docSearch, docStatusFilter]);

  const totalDocPages = Math.max(
    1,
    Math.ceil(filteredDocs.length / DOCS_PER_PAGE),
  );
  const pagedDocs = filteredDocs.slice(
    (docPage - 1) * DOCS_PER_PAGE,
    docPage * DOCS_PER_PAGE,
  );

  const handleStatusChange = async (id: number, status: DocumentStatus) => {
    const ok = await updateStatus(id, status);
    if (ok) {
      onStatusUpdated?.(id, status);
      switch (status) {
        case "Published":
          toast.success("Tài liệu đã được duyệt thành công.");
          break;
        case "Rejected":
          toast.success("Tài liệu đã bị từ chối.");
          break;
        case "Reported":
          toast.success("Tài liệu đã được đánh dấu là bị báo cáo.");
          break;
      }
    }
    if (!ok) {
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái tài liệu.");
    }
  };
const handleDeleteDoc = async (id: number) => {
  try {
    await deleteDocument(id);

    onDeleteDoc(id);
      if (pagedDocs.length === 1 && docPage > 1) {
      setDocPage((prev) => prev - 1);
    }

    toast.success("Tài liệu đã được xóa.");
  } catch (err) {
    toast.error("Có lỗi xảy ra khi xóa tài liệu.");
  }
};

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Tài liệu & Học liệu
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Quản lý kho tài liệu cộng đồng và báo cáo vi phạm.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(
          [
            {
              label: "Tổng tài liệu",
              val: docs.length,
              icon: FileText,
              filter: "all",
            },
            {
              label: "Chờ duyệt",
              val: docs.filter((d) => d.status === "Pending").length,
              icon: Clock,
              filter: "Pending",
            },
            {
              label: "Bị báo cáo",
              val: docs.filter((d) => d.status === "Reported").length,
              icon: AlertTriangle,
              filter: "Reported",
            },
            {
              label: "Đã từ chối",
              val: docs.filter((d) => d.status === "Rejected").length,
              icon: FileX,
              filter: "Rejected",
            },
          ] as const
        ).map((stat, i) => (
          <button
            key={i}
            onClick={() => {
              setDocStatusFilter(stat.filter as typeof docStatusFilter);
              setDocPage(1);
            }}
            className={`bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl p-5 rounded-2xl border shadow-sm flex items-center gap-3 text-left hover:scale-[1.02] transition-transform ${docStatusFilter === stat.filter ? "border-slate-900 dark:border-white ring-2 ring-slate-900 dark:ring-white ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950" : "border-white/40 dark:border-slate-800"}`}
          >
            <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
              <stat.icon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div>
              <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
                {typeof stat.val === "number" && stat.val > 1000
                  ? stat.val.toLocaleString()
                  : stat.val}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase mt-1">
                {stat.label}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={docSearch}
              onChange={(e) => {
                setDocSearch(e.target.value);
                setDocPage(1);
              }}
              placeholder="Tìm tên tài liệu, tác giả..."
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all w-full"
            />
          </div>
          <select
            value={docStatusFilter}
            onChange={(e) => {
              setDocStatusFilter(e.target.value as typeof docStatusFilter);
              setDocPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Published">Đã duyệt</option>
            <option value="Pending">Chờ duyệt</option>
            <option value="Reported">Bị báo cáo</option>
            <option value="Rejected">Đã từ chối</option>
            <option value="Draft">Không công khai</option>
          </select>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-950/60">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Tên tài liệu
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:table-cell">
                  Người đăng
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {pagedDocs.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400 font-medium"
                  >
                    Không tìm thấy tài liệu nào.
                  </td>
                </tr>
              ) : (
                pagedDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[200px]">
                        {doc.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {new Date(doc.createdAt).toLocaleDateString()} •{" "}
                        {doc.viewCount.toLocaleString()} lượt xem
                      </p>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-bold">
                        {doc.category?.name || "Không có danh mục"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300 hidden lg:table-cell whitespace-nowrap">
                      {doc.owner?.name || "Người dùng không xác định"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DocStatusBadge status={doc.status} />
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onViewDoc(doc)}
                          className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {doc.status === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusChange(doc.id, "Published")
                              }
                              disabled={isLoading}
                              className="p-2 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors disabled:opacity-60"
                              title="Duyệt"
                            >
                              <FileCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(doc.id, "Rejected")
                              }
                              disabled={isLoading}
                              className="p-2 text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors disabled:opacity-60"
                              title="Từ chối"
                            >
                              <FileX className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            handleDeleteDoc(doc.id);
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Xoá"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AppPagination
          page={docPage}
          totalPages={totalDocPages}
          onChange={setDocPage}
        />
      </div>
    </div>
  );
};

export default DocumentsTab;

import { Link } from "react-router-dom";
import { Clock, Eye, FileText, FolderOpen, Share2, Trash2, Upload } from "lucide-react";
const SavedDoc = () => {
    const paginatedDocs = [
  {
    id: "s1",
    title: "Ghi chú Machine Learning",
    description: "Các khái niệm cơ bản về Supervised và Unsupervised Learning.",
    fileType: "PDF",
    pages: 12,
    savedAt: "Hôm nay",
    isPublished: true,
    size: "2.4 MB"
  },
  {
    id: "s2",
    title: "Bài tập lớn ReactJS",
    description: "Source code và báo cáo về dự án thực tế dùng React và Tailwind.",
    fileType: "DOCX",
    pages: 45,
    savedAt: "Hôm qua",
    isPublished: false,
    size: "5.1 MB"
  },
  {
    id: "s3",
    title: "Tài liệu Thiết kế UX/UI",
    description: "Tổng hợp các nguyên tắc thiết kế cho ứng dụng di động.",
    fileType: "PDF",
    pages: 34,
    savedAt: "3 ngày trước",
    isPublished: false,
    size: "8.7 MB"
  }
];

  return (
    <>
    {paginatedDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedDocs.map((doc) => (
            <div key={doc.id} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-5 flex flex-col relative">
              <div className="flex justify-between items-start mb-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border `}>
                  {doc.fileType}
                </span>
                
                <div className="flex gap-2">
                  {doc.isPublished ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-md text-xs font-bold">
                      <Share2 className="w-3 h-3" />
                      Đã Publish
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded-md text-xs font-bold">
                      <Eye className="w-3 h-3" />
                      Riêng tư
                    </span>
                  )}
                </div>
              </div>

              <Link to={`/library/${doc.id}`} className="block flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 font-medium">
                  {doc.description}
                </p>
              </Link>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {doc.pages} tr</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {doc.savedAt}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {!doc.isPublished && (
                    <button 
                      onClick={() => {}}
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
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Chưa có tài liệu nào</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Bạn chưa lưu hoặc tải lên tài liệu nào trong mục này.</p>
          <Link
            to="/upload"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            <Upload className="w-4 h-4" />
            Tải lên ngay
          </Link>
        </div>

      )}
      </>
  )
}

export default SavedDoc
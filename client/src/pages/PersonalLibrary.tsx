
import { Link } from "react-router-dom";
import { Clock, Eye, FileText, FolderOpen, Share2, Trash2, Upload, Search } from "lucide-react";
import { useState } from "react";
import SavedDoc from "../components/users/library/SavedDoc";
import SearchBar from "../components/users/library/Search";

const PersonalLibrary = () => {
    const [activeTab, setActiveTab] = useState<"all" | "published" | "private">("all");
    const [searchQuery, setSearchQuery] = useState("");


  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/*Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Quản lý tài liệu
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Thư viện Cá nhân
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg max-w-2xl">
            Lưu trữ, quản lý các tài liệu học tập của bạn và chia sẻ chúng với cộng đồng.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/upload"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Tải lên tài liệu mới
          </Link>
        </div>
      </div>

      {/*Filters  */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === "all" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setActiveTab("private")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === "private" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Chỉ mình tôi
          </button>
          <button
            onClick={() => setActiveTab("published")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              activeTab === "published" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Đã Publish
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
      </div>

      {/* Document List  */}
        <SavedDoc />

      {/*Pagination  */}
      
    </div>
  )
}

export default PersonalLibrary
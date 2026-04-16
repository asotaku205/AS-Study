import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  FileText,
  FolderOpen,
  Search,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  User,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import DocsCard from "../components/users/library/DocsCard";
import StatsCard from "../components/users/library/StatsCard";
import CategoryCard from "../components/users/library/CategoryCard";
import SearchBar from "../components/users/library/Search";


const Library = () => {
  const [activeSort, setActiveSort] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocs: any[] = [
    {
      id: 1,
      title: "Giới thiệu Machine Learning với Python",
      desc: "Tự động phân tích tài liệu DOCX và sinh bài trắc nghiệm thông minh, giúp bạn ôn tập hiệu quả hơn.",
      avatar: "AS",
      author: "Anh Sơn",
      views: 1234,
      quizzes: 567,
      pages: 10,
    },
    {
      id: 2,
      title: "Học sâu cơ bản với TensorFlow",
      desc: "Tự động phân tích tài liệu DOCX và sinh bài trắc nghiệm thông minh, giúp bạn ôn tập hiệu quả hơn.",
      avatar: "AS",
      author: "Anh Sơn",
      views: 1234,
      quizzes: 567,
      pages: 10,
    },
    {
      id: 3,
      title: "Xử lý ngôn ngữ tự nhiên với spaCy",
      desc: "Tự động phân tích tài liệu DOCX và sinh bài trắc nghiệm thông minh, giúp bạn ôn tập hiệu quả hơn.",
      avatar: "AS",
      author: "Anh Sơn",
      views: 1234,
      quizzes: 567,
      pages: 10,
    },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
      <div className="max-w-7xl mx-auto space-y-10 pb-16">
        {/* Page Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-slate-700 dark:text-slate-300" />
            Thư viện Tài liệu
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Tài liệu cộng đồng — Học với AI hoặc tạo trắc nghiệm chỉ bằng một
            lần nhấn.
          </p>
        </header>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <StatsCard
            icon={<FileText className="w-5 h-5" />}
            title="Tài liệu"
            value="1,234"
          />
          <StatsCard
            icon={<Sparkles className="w-5 h-5" />}
            title="Quiz đã tạo"
            value="2.225"
          />
          <StatsCard
            icon={<User className="w-5 h-5" />}
            title="Người dùng"
            value="5,678"
          />
        </div>
        {/* Publish Banner */}
        <div className="relative bg-slate-900/90 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 overflow-hidden border border-slate-700 shadow-lg">
         
          <div className="absolute right-0 top-0 bottom-0 w-48 opacity-5 flex items-center justify-center pointer-events-none">
            <Upload className="w-40 h-40 text-white" />
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 z-10">
            <p className="font-bold text-white text-lg">
              Chia sẻ tài liệu của bạn với cộng đồng
            </p>
            <p className="text-slate-300 text-sm font-medium mt-1">
              Publish tài liệu từ thư viện cá nhân — giúp mọi người học tập và
              tạo Quiz từ nguồn kiến thức của bạn.
            </p>
          </div>
          <div className="flex items-center gap-3 z-10 shrink-0">
            <Link
              to="/personal-library"
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl font-bold text-sm hover:bg-white/20 transition-colors whitespace-nowrap"
            >
              <FolderOpen className="w-4 h-4" />
              Quản lý của tôi
            </Link>
            <Link
              to="/upload"
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              <Upload className="w-4 h-4" />
              Publish tài liệu
            </Link>
          </div>
        </div>
        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          {/* Sort Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
              onClick={() =>
                setActiveSort((prev) => (prev === false ? true : false))
              }
            >
              <TrendingUp className="w-4 h-4" />
              Phổ biến nhất
              <ChevronDown className={`w-4 h-4 transition-transform `} />
            </button>
            {/* Dropdown Menu */}
            {activeSort === true && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden">
                <button className="w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                  Phổ biến nhất
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  Mới nhất
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  Quiz nhiều nhất
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  Xem nhiều nhất
                </button>
              </div>
            )}
          </div>
        </div>
        {/*  Category Tabs*/}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <CategoryCard
            icon={<BookOpen className="w-4 h-4" />}
            category="Tất cả"
          />
        </div>
        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            {filteredDocs.length === 0
              ? "Không tìm thấy tài liệu nào"
              : `Hiển thị ${filteredDocs.length} tài liệu`}
            {searchQuery && (
              <span className="ml-1">
                cho "
                <span className="text-slate-900 dark:text-white">
                  {searchQuery}
                </span>
                "
              </span>
            )}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
              }}
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Xoá bộ lọc
            </button>
          )}
        </div>
        {/* Featured Section */}

        <section className="space-y-4">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-slate-900 dark:text-white fill-current" />
            Tài liệu nổi bật
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((doc) => (
                <DocsCard
                  key={doc.id}
                  title={doc.title}
                  desc={doc.desc}
                  avatar={doc.avatar}
                  author={doc.author}
                  views={doc.views}
                  quizzes={doc.quizzes}
                  pages={doc.pages}
                />
              ))}
          </div>
        </section>

        {/* All Documents  */}
        {filteredDocs.length < 0 ? (
          <section className="space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              Tất cả tài liệu
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredDocs.map((doc) => (
                <DocsCard
                  key={doc.id}
                  title={doc.title}
                  desc={doc.desc}
                  avatar={doc.avatar}
                  author={doc.author}
                  views={doc.views}
                  quizzes={doc.quizzes}
                  pages={doc.pages}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="text-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <p className="font-bold text-slate-900 dark:text-white text-lg">
              Không tìm thấy tài liệu
            </p>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto">
              Hãy thử tìm kiếm với từ khóa khác hoặc khám phá danh mục khác.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
            >
              <ArrowRight className="w-4 h-4" /> Xem tất cả tài liệu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;

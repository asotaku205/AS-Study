import {
  Search,
  Edit,
  UserX,
  UserCheck,
  Trash2,
  Ban,
  CheckCircle2,
} from "lucide-react";
import AppPagination from "../Pagination";
import type { Category } from "../../types/categoryTypes";
import { useMemo, useState } from "react";

const CategoriesTab = ({
  categories,
  onEditCategory,
}: {
  categories: Category[];
  onEditCategory: (category: Category | "new") => void;
}) => {
  const CATEGORY_PER_PAGE = 5;
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryStatusFilter, setCategoryStatusFilter] = useState<
    "all" | "Published" | "Hidden"
  >("all");
  const [categoryPage, setCategoryPage] = useState(1);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchStatus =
        categoryStatusFilter === "all" ||
        category.status === categoryStatusFilter;

      const matchSearch =
        categorySearch.trim() === "" ||
        category.name.toLowerCase().includes(categorySearch.toLowerCase());

      return matchStatus && matchSearch;
    });
  }, [categories, categorySearch, categoryStatusFilter]);

  const totalCategoryPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / CATEGORY_PER_PAGE),
  );
  const pagedCategories = filteredCategories.slice(
    (categoryPage - 1) * CATEGORY_PER_PAGE,
    categoryPage * CATEGORY_PER_PAGE,
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Quản lý danh mục
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Tổng cộng{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {pagedCategories.length}
            </span>{" "}
            Danh mục trên hệ thống.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={categorySearch}
              onChange={(e) => {
                setCategorySearch(e.target.value);
                setCategoryPage(1);
              }}
              placeholder="Tìm theo tên, email..."
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all w-full"
            />
          </div>
          <select
            value={categoryStatusFilter}
            onChange={(e) => {
              setCategoryStatusFilter(
                e.target.value as typeof categoryStatusFilter,
              );
              setCategoryPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Published">Hoạt động</option>
            <option value="Hidden">Bị ẩn</option>
          </select>
          <button
            onClick={() => onEditCategory("new")}
            className="ml-auto px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            Tạo danh mục
          </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-950/60">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {pagedCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400 font-medium"
                  >
                    Không tìm thấy danh mục nào.
                  </td>
                </tr>
              ) : (
                pagedCategories.map((category) => (
                  <tr
                    key={category.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-inner bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300`}
                        >
                          {category.name.charAt(0)}
                        </div>
                        <div>
                          <p
                            className={`font-bold text-sm ${category.status === "Hidden" ? "text-slate-400 line-through" : "text-slate-900 dark:text-white"}`}
                          >
                            {category.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {category.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold border `}
                      >
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {category.status === "Published" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{" "}
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-900">
                          <Ban className="w-3.5 h-3.5" /> Bị khoá
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap hidden md:table-cell">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditCategory(category)}
                          className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Xoá danh mục"
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
          page={categoryPage}
          totalPages={totalCategoryPages}
          onChange={setCategoryPage}
        />
      </div>
    </div>
  );
};
export default CategoriesTab;

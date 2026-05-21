import { X } from "lucide-react";
import { toast } from "react-toastify/unstyled";
import { createCategory,updateCategory } from "../../services/categoryService";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Category } from "../../types/categoryTypes";
const CategoryModal = ({
  onClose,
  category,
  onCategorySaved,
}: {
  onClose: () => void;
  category: Category | null;
  onCategorySaved: (category: Category) => void;
}) => {
  const STATUS = ["Published", "Hidden"] as const;

  const schema = z.object({
    name: z.string().min(1, "Vui lòng nhập tên của bạn"),
    slug: z.string().min(1, "Vui lòng nhập slug"),
    status: z.enum(STATUS),
  });
  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      status: category?.status ?? "Published",
    },
  });
  type CategoryForm = z.infer<typeof schema>;

 const handleSavedCategory = async (data: CategoryForm) => {
  try {
    let savedCategory 
    if(isNew){
        savedCategory = await createCategory(data.name, data.slug, data.status);
        toast.success("Danh mục đã được tạo thành công.");
    }else{
        savedCategory = await updateCategory(category!.id, data.name, data.slug, data.status);
        toast.success("Danh mục đã được cập nhật thành công.");
    }

    onCategorySaved(savedCategory);

    onClose();
  } catch (error) {
    toast.error("Có lỗi xảy ra khi lưu danh mục.");
  }
};
  const isNew = !category;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <form
        className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(handleSavedCategory)}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-black text-slate-900 dark:text-white text-xl">
            {isNew ? "Tạo mới" : "Chỉnh sửa"} danh mục
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Tên danh mục
            </label>
            <input
              type="text"
              placeholder="Nhập tên danh mục..."
              {...registerField("name")}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Slug
            </label>
            <input
              type="text"
              placeholder="Nhập slug..."
              {...registerField("slug")}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
            />
            {errors.slug && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.slug.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Trạng thái
            </label>
            <select
              {...registerField("status")}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
            >
              <option value="Published">Công khai</option>
              <option value="Hidden">Ẩn</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-md"
          >
            {isNew ? "Tạo mới" : "Lưu thay đổi"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryModal;

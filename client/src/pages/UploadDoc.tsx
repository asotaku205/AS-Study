import { Check, Globe, Shield, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import UploadZone from "../components/users/UploadZone";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { uploadDocument } from "../services/documentService";
import { getUserProfile } from "../services/userService";
import useGetCategories from "../hooks/useGetCategories";
const UploadDoc = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState<'public' | 'private'>('private');
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [ownerUserId, setOwnerUserId] = useState<number | null>(null);
  const { categories, setCategories } = useGetCategories();
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getUserProfile();
        setOwnerUserId(data.id);
      } catch (error) {
        console.error("Failed to load user profile:", error);
      }
    };
    loadProfile();
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Vui lòng chọn file");
      return;
    }
    if (!ownerUserId) {
      toast.error("Không xác định được người dùng");
      return;
    }
    try{
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("ownerUserId", String(ownerUserId));
      formData.append("categoryId", categoryId);
      formData.append("visibility", isPublic);
      await uploadDocument(formData);
      if (isPublic === 'public') {
        toast.success("Tải lên thành công! tài liệu sẽ được duyệt trong thời gian sớm nhất.");
      } else {
        toast.success("Tải lên thành công!");
      }
      // reset form
      setFile(null);
      setTitle("");
      setDescription("");
      setCategoryId("1");
      setIsPublic('private');
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tải lên tài liệu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <Upload className="w-8 h-8 text-slate-700 dark:text-slate-300" />
          Tải lên Tài liệu
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Thêm tài liệu mới vào thư viện cá nhân hoặc chia sẻ với cộng đồng.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Upload Zone */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <UploadZone file={file} setFile={setFile} />
        </div>

        {/* Details Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Thông tin chi tiết
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Tên tài liệu
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Nhập môn Machine Learning cơ bản..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-shadow"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Mô tả ngắn
              </label>
              <textarea
                placeholder="Tóm tắt nội dung chính của tài liệu..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-shadow resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Danh mục
              </label>
              {categories.length > 0 ? (
              <select
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-shadow"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              ) : (
                <p className="text-sm text-slate-500 dark:text-slate-400">Đang tải danh mục...</p>
              )}
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Quyền riêng tư
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div
              className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${isPublic === 'public' ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/50" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`}
              onClick={() => setIsPublic('public')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Globe className="w-5 h-5" />
                  Công khai
                </div>
                {isPublic === 'public' && (
                  <Check className="w-5 h-5 text-slate-900 dark:text-white" />
                )}
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Chia sẻ lên Thư viện chung. Mọi người có thể tìm kiếm, học với
                AI và tạo Quiz.
              </p>
            </div>

            <div
              className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${isPublic === 'private' ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/50" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`}
              onClick={() => setIsPublic('private')}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Shield className="w-5 h-5" />
                  Chỉ mình tôi
                </div>
                {isPublic === 'private' && (
                  <Check className="w-5 h-5 text-slate-900 dark:text-white" />
                )}
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Chỉ bạn mới có thể xem tài liệu này trong Thư viện cá nhân.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => history.back()}
            className="px-6 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!file || !title || isLoading}
            className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Upload className="w-5 h-5" />
            {isLoading ? (
              <CircularProgress aria-label="Loading…" size={20} />
            ) : (
              "Tải lên"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadDoc;

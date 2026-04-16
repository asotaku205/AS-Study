import { Check, Globe, Shield, Upload, X } from "lucide-react";
import { useState } from "react";
import UploadZone from "../components/users/UploadZone";
const UploadDoc = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isPublic, setIsPublic] = useState(true);

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

      <form onSubmit={() => {}} className="space-y-8">
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
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-shadow resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Danh mục
              </label>
              <select className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent transition-shadow">
                <option value="programming">Lập trình & CNTT</option>
                <option value="math">Toán học</option>
                <option value="science">Khoa học tự nhiên</option>
                <option value="language">Ngoại ngữ</option>
                <option value="history">Lịch sử & Xã hội</option>
                <option value="design">Thiết kế & Nghệ thuật</option>
                <option value="other">Khác</option>
              </select>
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
              className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${isPublic ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/50" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`}
              onClick={() => setIsPublic(true)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Globe className="w-5 h-5" />
                  Công khai
                </div>
                {isPublic && (
                  <Check className="w-5 h-5 text-slate-900 dark:text-white" />
                )}
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Chia sẻ lên Thư viện chung. Mọi người có thể tìm kiếm, học với
                AI và tạo Quiz.
              </p>
            </div>

            <div
              className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${!isPublic ? "border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/50" : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"}`}
              onClick={() => setIsPublic(false)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Shield className="w-5 h-5" />
                  Chỉ mình tôi
                </div>
                {!isPublic && (
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
            className="px-8 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Upload className="w-5 h-5" />
            Tải lên tài liệu
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadDoc;

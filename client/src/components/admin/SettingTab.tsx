import { useEffect, useState } from "react";
import {
  Globe,
  Lock,
  Bell,
  Info,
  AlertTriangle,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import Toggle from "./Toggle";
import ConfirmDialog from "./ConfirmDialog";
import {
  getAdminSettings,
  updateAdminSettings,
  resetAdminSettings,
  sendAdminTestEmail,
  type SystemSettings,
} from "../../services/adminService";

const SettingTab = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await getAdminSettings();
        setSettings(data);
      } catch {
        toast.error("Không thể tải cài đặt hệ thống");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const saved = await updateAdminSettings({
        siteName: settings.siteName,
        adminEmail: settings.adminEmail,
        seoDesc: settings.seoDesc,
        allowRegister: settings.allowRegister,
        maintenanceMode: settings.maintenanceMode,
        autoPublish: settings.autoPublish,
        emailNotify: settings.emailNotify,
        twoFactor: settings.twoFactor,
      });
      setSettings(saved);
      toast.success("Đã lưu cài đặt thành công!");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Không thể lưu cài đặt",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setIsSendingTest(true);
    try {
      const result = await sendAdminTestEmail();
      toast.success(result.message);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Gửi email thử nghiệm thất bại",
      );
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleReset = async () => {
    try {
      const data = await resetAdminSettings();
      setSettings(data);
      toast.success("Đã đặt lại cấu hình về mặc định");
    } catch {
      toast.error("Không thể đặt lại cấu hình");
    } finally {
      setShowResetConfirm(false);
    }
  };

  const updateField = <K extends keyof SystemSettings>(
    key: K,
    value: SystemSettings[K],
  ) => {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  if (isLoading || !settings) {
    return (
      <div className="flex items-center justify-center py-24 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Đang tải cài đặt...
      </div>
    );
  }

  const toggleItems = [
    {
      key: "allowRegister" as const,
      label: "Cho phép đăng ký mới",
      desc: "Mở đăng ký tài khoản cho người dùng tự do.",
    },
    {
      key: "maintenanceMode" as const,
      label: "Chế độ bảo trì",
      desc: "Chỉ quản trị viên có thể đăng nhập khi bật.",
    },
    {
      key: "autoPublish" as const,
      label: "Tự động duyệt tài liệu",
      desc: "Tài liệu công khai sẽ được xuất bản ngay, không cần duyệt.",
    },
    {
      key: "twoFactor" as const,
      label: "Bắt buộc xác thực 2 bước (2FA)",
      desc: "Yêu cầu 2FA cho tất cả tài khoản Admin (sắp ra mắt).",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Cài đặt chung
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Quản lý cấu hình hệ thống và bảo mật.
          </p>
          {settings.updatedAt && (
            <p className="text-xs text-slate-400 mt-1">
              Cập nhật lần cuối:{" "}
              {new Date(settings.updatedAt).toLocaleString("vi-VN")}
            </p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-md disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Check className="w-4 h-4" />
          )}
          Lưu thay đổi
        </button>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl space-y-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" />{" "}
          Thông tin Website
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Tên ứng dụng
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => updateField("siteName", e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Email quản trị
            </label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => updateField("adminEmail", e.target.value)}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
              Mô tả ngắn (SEO)
            </label>
            <textarea
              rows={3}
              value={settings.seoDesc}
              onChange={(e) => updateField("seoDesc", e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all shadow-sm resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl space-y-2">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" /> Quyền
          truy cập & Bảo mật
        </h3>
        {toggleItems.map((item, idx, arr) => (
          <div key={item.key}>
            <div className="flex items-center justify-between py-3">
              <div className="pr-4">
                <p className="font-bold text-slate-900 dark:text-white text-sm">
                  {item.label}
                </p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  {item.desc}
                </p>
              </div>
              <Toggle
                enabled={settings[item.key]}
                onChange={(v) => updateField(item.key, v)}
                disabled={item.key === "twoFactor"}
              />
            </div>
            {idx < arr.length - 1 && (
              <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl space-y-2">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" /> Thông
          báo hệ thống
        </h3>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              Thông báo email Admin
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Gửi email cảnh báo lỗi hệ thống đến email quản trị.
            </p>
          </div>
          <Toggle
            enabled={settings.emailNotify}
            onChange={(v) => updateField("emailNotify", v)}
          />
        </div>
        <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />
        <div className="pt-4">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
            Kiểm tra kết nối Email
          </p>
          <button
            onClick={handleTestEmail}
            disabled={isSendingTest}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 disabled:opacity-50"
          >
            {isSendingTest ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Info className="w-4 h-4" />
            )}
            Gửi email thử nghiệm
          </button>
        </div>
      </div>

      <div className="bg-red-50/60 dark:bg-red-950/20 backdrop-blur-2xl p-8 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-xl">
        <h3 className="font-bold text-red-700 dark:text-red-400 text-lg mb-5 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Vùng nguy hiểm
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              Xoá cache trình duyệt cục bộ
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Xóa dữ liệu tạm lưu trên trình duyệt admin.
            </p>
          </div>
          <button
            onClick={() => {
              const keys = Object.keys(localStorage).filter(
                (k) =>
                  k.startsWith("readNotif") ||
                  k === "theme" ||
                  k.startsWith("quizHistory") ||
                  k.startsWith("lectureHistory"),
              );
              keys.forEach((k) => localStorage.removeItem(k));
              toast.success("Đã xóa cache cục bộ");
            }}
            className="shrink-0 px-4 py-2.5 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            Xoá Cache
          </button>
        </div>
        <div className="w-full h-px bg-red-200 dark:bg-red-900/50 my-2" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">
              Đặt lại cấu hình về mặc định
            </p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
              Khôi phục tất cả cài đặt hệ thống về giá trị ban đầu.
            </p>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="shrink-0 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-md"
          >
            Reset cấu hình
          </button>
        </div>
      </div>

      {showResetConfirm && (
        <ConfirmDialog
          open={showResetConfirm}
          title="Đặt lại cấu hình?"
          description="Tất cả cài đặt hệ thống sẽ được khôi phục về mặc định. Hành động này không thể hoàn tác."
          confirmLabel="Đặt lại"
          variant="danger"
          onCancel={() => setShowResetConfirm(false)}
          onConfirm={handleReset}
        />
      )}
    </div>
  );
};

export default SettingTab;

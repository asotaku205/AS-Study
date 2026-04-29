import { useState } from 'react';
import { Globe, Lock, Bell, Info, AlertTriangle, Check } from "lucide-react";

const SettingTab = () => {
  const [settings, setSettings] = useState({
    siteName: "AS Scholarly",
    adminEmail: "admin@asscholarly.com",
    seoDesc: "Nền tảng học tập AI thế hệ mới giúp bạn tối ưu hoá quá trình tiếp thu kiến thức.",
    allowRegister: true,
    maintenanceMode: false,
    autoPublish: false,
    emailNotify: true,
    twoFactor: false,
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Cài đặt chung</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Quản lý cấu hình hệ thống và bảo mật.</p>
        </div>
        <button
          // onClick={() => toast.success("Đã lưu cài đặt thành công!")}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-md"
        >
          <Check className="w-4 h-4" /> Lưu thay đổi
        </button>
      </div>

      {/* Website Info */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl space-y-6">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-slate-600 dark:text-slate-400" /> Thông tin Website
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Tên ứng dụng</label>
            <input
              type="text" value={settings.siteName}
              onChange={(e) => setSettings(s => ({ ...s, siteName: e.target.value }))}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Email quản trị</label>
            <input
              type="email" value={settings.adminEmail}
              onChange={(e) => setSettings(s => ({ ...s, adminEmail: e.target.value }))}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all shadow-sm"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Mô tả ngắn (SEO)</label>
            <textarea
              rows={3} value={settings.seoDesc}
              onChange={(e) => setSettings(s => ({ ...s, seoDesc: e.target.value }))}
              className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all shadow-sm resize-none"
            />
          </div>
        </div>
      </div>

      {/* Access & Security */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl space-y-2">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" /> Quyền truy cập & Bảo mật
        </h3>
        {([
          { key: "allowRegister", label: "Cho phép đăng ký mới", desc: "Mở đăng ký tài khoản cho người dùng tự do." },
          { key: "maintenanceMode", label: "Chế độ bảo trì (Maintenance Mode)", desc: "Khoá toàn bộ truy cập frontend để bảo trì hệ thống." },
          { key: "autoPublish", label: "Tự động duyệt tài liệu (Auto-publish)", desc: "Tài liệu upload sẽ tự động xuất bản không cần kiểm duyệt." },
          { key: "twoFactor", label: "Bắt buộc xác thực 2 bước (2FA)", desc: "Yêu cầu 2FA cho tất cả tài khoản Admin." },
        ] as const).map((item, idx, arr) => (
          <div key={item.key}>
            <div className="flex items-center justify-between py-3">
              <div className="pr-4">
                <p className="font-bold text-slate-900 dark:text-white text-sm">{item.label}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
              </div>
              {/* <Toggle
                enabled={settings[item.key]}
                onChange={(v) => {
                  setSettings(s => ({ ...s, [item.key]: v }));
                  toast.success(`${item.label}: ${v ? "Đã bật" : "Đã tắt"}`);
                }}
              /> */}
            </div>
            {idx < arr.length - 1 && <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />}
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl space-y-2">
        <h3 className="font-bold text-slate-900 dark:text-white text-lg border-b border-slate-200 dark:border-slate-800 pb-4 mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" /> Thông báo hệ thống
        </h3>
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Thông báo email Admin</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Gửi email cảnh báo lỗi hệ thống đến email quản trị.</p>
          </div>
          {/* <Toggle
            enabled={settings.emailNotify}
            onChange={(v) => {
              setSettings(s => ({ ...s, emailNotify: v }));
              toast.success(`Thông báo email: ${v ? "Đã bật" : "Đã tắt"}`);
            }}
          /> */}
        </div>
        <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />
        <div className="pt-4">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">Kiểm tra kết nối Email</p>
          <button
            // onClick={() => toast.success("Email kiểm tra đã được gửi đến " + settings.adminEmail)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Info className="w-4 h-4" /> Gửi email thử nghiệm
          </button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/60 dark:bg-red-950/20 backdrop-blur-2xl p-8 rounded-2xl border border-red-200 dark:border-red-900/50 shadow-xl">
        <h3 className="font-bold text-red-700 dark:text-red-400 text-lg mb-5 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> Vùng nguy hiểm
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Xoá tất cả cache hệ thống</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Xóa cache có thể làm giảm hiệu suất tạm thời.</p>
          </div>
          <button
              // onClick={() => toast.warning("Đã xoá toàn bộ cache hệ thống.")}
            className="shrink-0 px-4 py-2.5 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
          >
            Xoá Cache
          </button>
        </div>
        <div className="w-full h-px bg-red-200 dark:bg-red-900/50 my-2" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-3">
          <div>
            <p className="font-bold text-slate-900 dark:text-white text-sm">Đặt lại cấu hình về mặc định</p>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">Hành động này không thể hoàn tác.</p>
          </div>
          <button
                // onClick={() => toast.error("Chức năng này yêu cầu xác nhận 2 bước.")}
            className="shrink-0 px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors shadow-md"
          >
            Reset cấu hình
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingTab
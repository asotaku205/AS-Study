import { Globe, Lock, Monitor, Moon, Palette, Save, Sun, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { getUserProfile } from "../services/userService";
import CircularProgress from "@mui/material/CircularProgress";

interface UserProfile {
  id: number;
  name: string;
  username: string;
  email: string | null;
  emailVerified: boolean | null;
  role: string;
  provider: string | null;
  providerId: string | null;
  hasPassword: boolean;
}

const Setting = () => {
  const [activeTab, setActiveTab] = useState<"account" | "appearance" | "language">("account");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);



  // Profile form state
  const [fullName, setFullName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Theme settings
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(() => {
    return (localStorage.getItem("theme") as "light" | "dark" | "system") || "system";
  });

  const setTheme = (newTheme: "light" | "dark" | "system") => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    const root = window.document.documentElement;
    if (
      newTheme === "dark" ||
      (newTheme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await getUserProfile();
      setUserProfile(data);
      setFullName(data.name || "");
    } catch (error) {
      console.error("Failed to load user profile:", error);
      toast.error("Không thể tải thông tin hồ sơ");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasPassword = userProfile?.hasPassword ?? true;
    if ((hasPassword && !currentPassword) || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ các trường mật khẩu");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không trùng khớp");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setIsSavingPassword(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: hasPassword ? currentPassword : undefined,
        newPassword,
      });
      toast.success(hasPassword ? "Cập nhật mật khẩu thành công!" : "Thiết lập mật khẩu thành công!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      fetchProfile();
    } catch (error: any) {
      const message = error.response?.data?.message;
      toast.error(Array.isArray(message) ? message[0] : message || "Cập nhật mật khẩu thất bại");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Họ và tên không được để trống");
      return;
    }
    setIsSavingProfile(true);
    try {
      await api.put(`/users/${userProfile?.id}`, {
        name: fullName,
      });
      toast.success("Cập nhật thông tin cá nhân thành công!");
      fetchProfile();
    } catch (error: any) {
      const message = error.response?.data?.message;
      toast.error(Array.isArray(message) ? message[0] : message || "Cập nhật thông tin cá nhân thất bại");
    } finally {
      setIsSavingProfile(false);
    }
  };



  const handleLinkGoogle = () => {
    const token = localStorage.getItem("accessToken");
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google?token=${token}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 animate-in fade-in duration-300">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Cài đặt hệ thống</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý tài khoản, liên kết Google OAuth và tuỳ chỉnh giao diện học tập của bạn.</p>
      </header>

      {/* Gmail Link Reminder Banner */}
      {!isLoadingProfile && userProfile && (!userProfile.email || !userProfile.emailVerified) && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-2xl p-4 flex gap-3 text-amber-800 dark:text-amber-300 text-sm font-medium">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
          <div>
            <p className="font-bold">Tài khoản chưa được bảo vệ bằng Gmail!</p>
            <p className="mt-0.5 text-amber-700 dark:text-amber-400 font-normal">
              Vui lòng liên kết tài khoản Google bên dưới để bảo vệ tài khoản bằng Gmail và sử dụng chức năng <strong>Quên mật khẩu</strong> khi cần thiết.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab("account")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${
                activeTab === "account"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Lock className="w-5 h-5" />
              Bảo mật & Tài khoản
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${
                activeTab === "appearance"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Palette className="w-5 h-5" />
              Giao diện hiển thị
            </button>
            <button
              onClick={() => setActiveTab("language")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors text-left ${
                activeTab === "language"
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Globe className="w-5 h-5" />
              Ngôn ngữ
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[500px]">
          {isLoadingProfile ? (
            <div className="flex items-center justify-center h-64">
              <CircularProgress className="text-slate-900 dark:text-white" />
            </div>
          ) : (
            <>
              {activeTab === "account" && userProfile && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Personal Info Section */}
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Thông tin cá nhân</h2>
                    <form className="max-w-md space-y-4" onSubmit={handleUpdateProfile}>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-2.5 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white text-sm"
                          placeholder="Họ và tên"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Tên đăng nhập (username)
                        </label>
                        <input
                          type="text"
                          value={userProfile.username}
                          disabled
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg dark:text-slate-400 text-slate-500 text-sm cursor-not-allowed"
                        />
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          Không thể thay đổi tên đăng nhập.
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSavingProfile}
                          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors disabled:opacity-60 text-sm"
                        >
                          {isSavingProfile ? (
                            <CircularProgress size={16} />
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Lưu thay đổi
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  <hr className="border-slate-200 dark:border-slate-800" />

                  {/* Google OAuth Link Section */}
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Liên kết Google OAuth</h2>
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 max-w-md">
                      {userProfile.providerId ? (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                          <div>
                            <p className="font-bold text-sm text-slate-900 dark:text-white">Đã liên kết với Google</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">ID liên kết: {userProfile.providerId}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Liên kết tài khoản của bạn với Google để có thể đăng nhập nhanh chóng thông qua Google OAuth.
                          </p>
                          <button
                            type="button"
                            onClick={handleLinkGoogle}
                            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-sm font-bold rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.44 0-6.228-2.77-6.228-6.2s2.788-6.2 6.228-6.2c1.508 0 2.885.536 3.978 1.43l3.226-3.21a10.957 10.957 0 00-7.204-2.75C6.076 1.8 1.2 6.626 1.2 12.6s4.876 10.8 11.04 10.8c5.96 0 10.74-4.254 10.74-10.8 0-.662-.075-1.285-.18-1.857H12.24z" />
                            </svg>
                            Liên kết Google Account
                          </button>
                        </div>
                      )}
                    </div>
                  </div>



                  {/* Change Password Section */}
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Đổi mật khẩu</h2>
                    <form className="max-w-md space-y-4" onSubmit={handleUpdatePassword}>
                      {userProfile.hasPassword && (
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mật khẩu hiện tại</label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full px-4 py-2.5 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white text-sm"
                            placeholder="••••••••"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mật khẩu mới</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2.5 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white text-sm"
                          placeholder="Tối thiểu 6 ký tự"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Xác nhận mật khẩu mới</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2.5 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white text-sm"
                          placeholder="Nhập lại mật khẩu mới"
                        />
                      </div>
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSavingPassword}
                          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors disabled:opacity-60 text-sm"
                        >
                          {isSavingPassword ? (
                            <CircularProgress size={16} />
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              {userProfile.hasPassword ? "Cập nhật mật khẩu" : "Thiết lập mật khẩu"}
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Chế độ hiển thị</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                      <button
                        onClick={() => setTheme("light")}
                        className={`flex flex-col items-center gap-4 p-6 border-2 rounded-xl relative transition-all ${
                          theme === "light"
                            ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        {theme === "light" && (
                          <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-slate-900 border-2 border-white ring-2 ring-slate-900" />
                        )}
                        <div className="w-full h-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
                          <Sun className="w-8 h-8 text-amber-500" />
                        </div>
                        <span
                          className={`font-semibold ${
                            theme === "light" ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          Sáng
                        </span>
                      </button>

                      <button
                        onClick={() => setTheme("dark")}
                        className={`flex flex-col items-center gap-4 p-6 border-2 rounded-xl relative transition-all ${
                          theme === "dark"
                            ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        {theme === "dark" && (
                          <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-slate-100 border-2 border-slate-900 ring-2 ring-slate-100" />
                        )}
                        <div className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center shadow-sm">
                          <Moon className="w-8 h-8 text-sky-400" />
                        </div>
                        <span
                          className={`font-semibold ${
                            theme === "dark" ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          Tối
                        </span>
                      </button>

                      <button
                        onClick={() => setTheme("system")}
                        className={`flex flex-col items-center gap-4 p-6 border-2 rounded-xl relative transition-all ${
                          theme === "system"
                            ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800"
                            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        {theme === "system" && (
                          <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-slate-900 dark:bg-slate-100 border-2 border-white dark:border-slate-900 ring-2 ring-slate-900 dark:ring-slate-100" />
                        )}
                        <div className="w-full h-24 bg-gradient-to-br from-white to-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                          <Monitor className="w-8 h-8 text-slate-500" />
                        </div>
                        <span
                          className={`font-semibold ${
                            theme === "system" ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          Hệ thống
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "language" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Ngôn ngữ hệ thống</h2>
                    <div className="max-w-md space-y-3">
                      <label className="flex items-center justify-between p-4 border-2 border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl"> 🇻🇳 </span>
                          <span className="font-semibold text-slate-900 dark:text-white">Tiếng Việt</span>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-slate-900 dark:border-slate-100 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-slate-100 rounded-full" />
                        </div>
                      </label>

                      <label className="flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 rounded-xl cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl"> 🇬🇧 </span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">English</span>
                        </div>
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setting;
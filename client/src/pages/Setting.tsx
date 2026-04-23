import { Globe, Lock, Monitor, Moon, Palette, Save, Sun } from "lucide-react";
import { useState } from "react";
const Setting = () => {
      const [activeTab, setActiveTab] = useState<"account" | "appearance" | "language">("account");

  return (
     <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <header className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Cài đặt hệ thống</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Quản lý tài khoản, mật khẩu và tuỳ chỉnh giao diện học tập của bạn.</p>
      </header>

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
          {activeTab === "account" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Đổi mật khẩu</h2>
                <form className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mật khẩu hiện tại</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2.5 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Mật khẩu mới</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2.5 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white"
                      placeholder="Tối thiểu 8 ký tự"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Xác nhận mật khẩu mới</label>
                    <input 
                      type="password" 
                      className="w-full px-4 py-2.5 bg-transparent border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-slate-100 dark:text-white"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                  <div className="pt-2">
                    <button type="button" className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors">
                      <Save className="w-4 h-4" />
                      Cập nhật mật khẩu
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
                {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                  <button 
                    onClick={() => setTheme("light")}
                    className={`flex flex-col items-center gap-4 p-6 border-2 rounded-xl relative transition-all ${
                      theme === "light" ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {theme === "light" && <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-slate-900 border-2 border-white ring-2 ring-slate-900" />}
                    <div className="w-full h-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center shadow-sm">
                      <Sun className="w-8 h-8 text-amber-500" />
                    </div>
                    <span className={`font-semibold ${theme === "light" ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>Sáng</span>
                  </button>
                  
                  <button 
                    onClick={() => setTheme("dark")}
                    className={`flex flex-col items-center gap-4 p-6 border-2 rounded-xl relative transition-all ${
                      theme === "dark" ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {theme === "dark" && <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-slate-100 border-2 border-slate-900 ring-2 ring-slate-100" />}
                    <div className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center shadow-sm">
                      <Moon className="w-8 h-8 text-sky-400" />
                    </div>
                    <span className={`font-semibold ${theme === "dark" ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>Tối</span>
                  </button>

                  <button 
                    onClick={() => setTheme("system")}
                    className={`flex flex-col items-center gap-4 p-6 border-2 rounded-xl relative transition-all ${
                      theme === "system" ? "border-slate-900 dark:border-slate-100 bg-slate-50 dark:bg-slate-800" : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {theme === "system" && <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-slate-900 dark:bg-slate-100 border-2 border-white dark:border-slate-900 ring-2 ring-slate-900 dark:ring-slate-100" />}
                    <div className="w-full h-24 bg-gradient-to-br from-white to-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                      <Monitor className="w-8 h-8 text-slate-500" />
                    </div>
                    <span className={`font-semibold ${theme === "system" ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>Hệ thống</span>
                  </button>
                </div> */}
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
                      <span className="text-2xl">🇻🇳</span>
                      <span className="font-semibold text-slate-900 dark:text-white">Tiếng Việt</span>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-900 dark:border-slate-100 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 bg-slate-900 dark:bg-slate-100 rounded-full" />
                    </div>
                  </label>
                  
                  <label className="flex items-center justify-between p-4 border-2 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 rounded-xl cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇬🇧</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">English</span>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-700" />
                  </label>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Setting
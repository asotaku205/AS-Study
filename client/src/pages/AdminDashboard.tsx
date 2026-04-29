import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Activity,
  Settings,
  Shield,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Clock,
  AlertTriangle,
  Moon,
  Sun,
  ExternalLink,
} from "lucide-react";
import NavItem from "../components/admin/NavItem";
import Overview from "../components/admin/Overview";
import UserTab from "../components/admin/UserTab";
import DocumentsTab from "../components/admin/DocumentsTab";
import ReportTab from "../components/admin/ReportTab";
import SettingTab from "../components/admin/SettingTab";
import initialDocs from "../components/admin/mockData/Docs";
import type { Doc } from "../components/admin/mockData/Docs";
import initialUsers from "../components/admin/mockData/Users";
import type { User } from "../components/admin/mockData/Users";
import UserModal from "../components/admin/UserModal";
import DocViewModal from "../components/admin/DocViewModal";
import ConfirmDialog from "../components/admin/ConfirmDialog";
import SearchPanel from "../components/admin/SearchPanel";
import NotificationsPanel from "../components/admin/NotificationsPanel";
const AdminDashboard = () => { 
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [docs, setDocs] = useState<Doc[]>(initialDocs);
  const [docStatusFilter, setDocStatusFilter] = useState<
    "all" | "Published" | "Pending" | "Reported" | "Rejected"
  >("all");
  const [globalSearch, setGlobalSearch] = useState("");
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [userSearch, setUserSearch] = useState("");
  const [docSearch, setDocSearch] = useState("");
  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(new Set());
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [isDark, setTheme] = useState<"light" | "dark">("light");
  const [editingUser, setEditingUser] = useState<User | null | "new">(null);
  const [viewingDoc, setViewingDoc] = useState<Doc | null>(null);
  const [confirmAction, setConfirmAction] = useState<null | {
    type: string;
    payload: string;
  }>(null);

  const getConfirmConfig = () => {
    if (!confirmAction) return null;
    if (confirmAction.type === "ban") {
      const user = users.find((u) => u.id === confirmAction.payload);
      return {
        title: "Khoá tài khoản?",
        description: `Bạn có chắc muốn khoá tài khoản "${user?.name}"? Người dùng sẽ không thể đăng nhập.`,
        confirmLabel: "Khoá tài khoản",
        variant: "warning" as const,
      };
    }
    if (confirmAction.type === "deleteUser") {
      const user = users.find((u) => u.id === confirmAction.payload);
      return {
        title: "Xoá tài khoản?",
        description: `Hành động này sẽ xoá vĩnh viễn tài khoản "${user?.name}". Không thể hoàn tác.`,
        confirmLabel: "Xoá vĩnh viễn",
        variant: "danger" as const,
      };
    }
    if (confirmAction.type === "deleteDoc") {
      const doc = docs.find((d) => d.id === confirmAction.payload);
      return {
        title: "Xoá tài liệu?",
        description: `Hành động này sẽ xoá vĩnh viễn tài liệu "${doc?.title}". Không thể hoàn tác.`,
        confirmLabel: "Xoá vĩnh viễn",
        variant: "danger" as const,
      };
    }
    return null;
  };
  const confirmConfig = getConfirmConfig();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 z-40 shadow-sm fixed md:static inset-y-0 left-0 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-lg flex items-center justify-center shadow-md">
              <Shield className="w-4 h-4 text-white dark:text-slate-900" />
            </div>
            <span className="font-black text-lg text-slate-900 dark:text-white tracking-tight">
              Admin Portal
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-slate-500 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          <NavItem
            icon={LayoutDashboard}
            label="Tổng quan"
            active={activeTab === "overview"}
            onClick={() => setActiveTab("overview")}
          />
          <NavItem
            icon={Users}
            label="Quản lý Người dùng"
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          />
          <NavItem
            icon={BookOpen}
            label="Tài liệu & Học liệu"
            active={activeTab === "documents"}
            onClick={() => setActiveTab("documents")}
          />
          <NavItem
            icon={Activity}
            label="Báo cáo hệ thống"
            active={activeTab === "reports"}
            onClick={() => setActiveTab("reports")}
          />
          <NavItem
            icon={Settings}
            label="Cài đặt chung"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />

          {/* Pending badge shortcut */}
          {docs.filter((d) => d.status === "Pending").length > 0 && (
            <div className="pt-4 pb-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">
                Cần xử lý
              </p>
              <button
                onClick={() => {
                  setActiveTab("documents");
                  setDocStatusFilter("Pending");
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Chờ duyệt
                </span>
                <span className="bg-yellow-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                  {docs.filter((d) => d.status === "Pending").length}
                </span>
              </button>
              {docs.filter((d) => d.status === "Reported").length > 0 && (
                <button
                  onClick={() => {
                    setActiveTab("documents");
                    setDocStatusFilter("Reported");
                  }}
                  className="mt-1 w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Báo cáo vi phạm
                  </span>
                  <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                    {docs.filter((d) => d.status === "Reported").length}
                  </span>
                </button>
              )}
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0">
          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" /> Trở lại ứng dụng
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top bar */}
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 shrink-0 z-20">
          {/* Left: mobile menu + breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white -ml-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-400 dark:text-slate-500">
                Admin Portal
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
              <span className="font-black text-slate-900 dark:text-white">
                {activeTab === "overview"
                  ? "Tổng quan"
                  : activeTab === "users"
                    ? "Quản lý Người dùng"
                    : activeTab === "documents"
                      ? "Tài liệu & Học liệu"
                      : activeTab === "reports"
                        ? "Báo cáo hệ thống"
                        : "Cài đặt chung"}
              </span>
            </div>
          </div>

          {/* Right: search + notif + profile */}
          <div className="flex items-center gap-2">
            <SearchPanel
              globalSearch={globalSearch}
              setGlobalSearch={setGlobalSearch}
              showSearchDrop={showSearchDrop}
              setShowSearchDrop={setShowSearchDrop}
              users={users}
              docs={docs}
              onUserSelect={(u) => {
                setActiveTab("users");
                setUserSearch(u.name);
              }}
              onDocSelect={(d) => {
                setActiveTab("documents");
                setDocSearch(d.title);
              }}
            />
            <NotificationsPanel
              docs={docs}
              showNotifPanel={showNotifPanel}
              setShowNotifPanel={(v) => {
                setShowNotifPanel(v);
                if (v) {
                  setShowProfileMenu(false);
                  setShowSearchDrop(false);
                }
              }}
              readNotifIds={readNotifIds}
              setReadNotifIds={setReadNotifIds}
              onNotificationAction={(tabName, statusFilter) => {
                setActiveTab(tabName as any);
                if (statusFilter === "Pending" || statusFilter === "Reported") {
                  setDocStatusFilter(statusFilter);
                }
              }}
            />

            {/* ── Profile Dropdown ── */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu((v) => !v);
                  setShowNotifPanel(false);
                  setShowSearchDrop(false);
                }}
                className={`flex items-center gap-2 pl-1 pr-2 sm:pr-3 py-1 rounded-xl transition-colors ${showProfileMenu ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800"}`}
              >
                <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-xs shadow-md border-2 border-white dark:border-slate-800 shrink-0">
                  AD
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-black text-slate-900 dark:text-white leading-none">
                    Hoàng Văn E
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    Quản trị viên
                  </p>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 text-slate-400 hidden sm:block transition-transform duration-200 ${showProfileMenu ? "-rotate-90" : "rotate-90"}`}
                />
              </button>

              {showProfileMenu && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* Profile card */}
                  <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black text-sm shadow-md shrink-0">
                        AD
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-slate-900 dark:text-white text-sm truncate">
                          Hoàng Văn E
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
                          hoange@example.com
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black rounded-lg uppercase tracking-wider">
                        Admin
                      </span>
                      <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Đang hoạt động
                      </span>
                    </div>
                  </div>

                  {/* Menu */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setActiveTab("settings");
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-slate-400 shrink-0" />
                      Cài đặt hệ thống
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab("reports");
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-left"
                    >
                      <Activity className="w-4 h-4 text-slate-400 shrink-0" />
                      Nhật ký hoạt động
                    </button>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

                    {/* Dark mode toggle */}
                    <div className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                      <div className="flex items-center gap-3">
                        {isDark ? (
                          <Moon className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <Sun className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          {isDark ? "Chế độ tối" : "Chế độ sáng"}
                        </span>
                      </div>
                      <button
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 ${isDark ? "bg-slate-900 dark:bg-white" : "bg-slate-200"}`}
                      >
                        <span
                          className={`inline-block w-3.5 h-3.5 transform bg-white dark:bg-slate-900 rounded-full shadow transition-transform duration-200 ${isDark ? "translate-x-5" : "translate-x-0.5"}`}
                        />
                      </button>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

                    <Link
                      to="/"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
                      Trở về ứng dụng
                    </Link>

                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

                    <Link
                      to="/login"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      Đăng xuất
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-300/20 dark:bg-slate-700/10 rounded-full blur-[150px] opacity-60 pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-200/20 dark:bg-slate-800/10 rounded-full blur-[120px] opacity-60 pointer-events-none -z-10" />

          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {activeTab === "overview" && <Overview />}
            {activeTab === "users" && <UserTab onEditUser={setEditingUser} />}
            {activeTab === "documents" && <DocumentsTab onViewDoc={setViewingDoc} />}
            {activeTab === "reports" && <ReportTab />}
            {activeTab === "settings" && <SettingTab />}
          </div>
        </div>
      </main>

      {/* Modals & Dialogs */}
      {editingUser !== null && (
        <UserModal
          user={editingUser === "new" ? null : editingUser}
          onClose={() => setEditingUser(null)}
        />
      )}
      {viewingDoc && (
        <DocViewModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />
      )}
      {confirmConfig && (
        <ConfirmDialog
          open={!!confirmAction}
          title={confirmConfig.title}
          description={confirmConfig.description}
          confirmLabel={confirmConfig.confirmLabel}
          variant={confirmConfig.variant}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;

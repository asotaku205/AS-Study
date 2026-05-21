import { useState } from "react";
import {
  Search,
  CheckCircle2,
  Ban,
  UserX,
  UserCheck,
  Trash2,
  
} from "lucide-react";
import { useMemo } from "react";
import type { User } from "../../types/userTypes";
import AppPagination from "../Pagination";

const UserTab = ({
  user,
  onToggleBan,
}: {
  user: User[];
  onToggleBan: (id: number, isBanned: boolean) => void;
}) => {
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<
    "all" | "admin" | "user"
  >("all");
  const [userStatusFilter, setUserStatusFilter] = useState<
    "all" | "active" | "banned"
  >("all");
  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 5;
  const filteredUsers = useMemo(() => {
    return user.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
      const matchStatus =
        userStatusFilter === "all" ||
        (userStatusFilter === "active" ? !u.isBanned : u.isBanned);
      return matchSearch && matchRole && matchStatus;
    });
  }, [user, userSearch, userRoleFilter, userStatusFilter]);

  const totalUserPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );
  const pagedUsers = filteredUsers.slice(
    (userPage - 1) * USERS_PER_PAGE,
    userPage * USERS_PER_PAGE,
  );
 

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Quản lý người dùng
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            Tổng cộng{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {user.length}
            </span>{" "}
            tài khoản trên hệ thống.
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
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setUserPage(1);
              }}
              placeholder="Tìm theo tên, email..."
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all w-full"
            />
          </div>
          <select
            value={userRoleFilter}
            onChange={(e) => {
              setUserRoleFilter(e.target.value as typeof userRoleFilter);
              setUserPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={userStatusFilter}
            onChange={(e) => {
              setUserStatusFilter(e.target.value as typeof userStatusFilter);
              setUserPage(1);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="banned">Bị khoá</option>
          </select>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-950/60">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">
                  Tham gia
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {pagedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-slate-400 font-medium"
                  >
                    Không tìm thấy người dùng nào.
                  </td>
                </tr>
              ) : (
                pagedUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-inner ${user.isBanned ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p
                            className={`font-bold text-sm ${user.isBanned ? "text-slate-400 line-through" : "text-slate-900 dark:text-white"}`}
                          >
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold border ${user.role === "admin" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent" : "bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!user.isBanned ? (
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
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onToggleBan(user.id, user.isBanned)}
                          className={`p-2 rounded-lg transition-colors ${!user.isBanned ? "text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20" : "text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"}`}
                          title={
                            !user.isBanned
                              ? "Khoá tài khoản"
                              : "Mở khoá tài khoản"
                          }
                        >
                          {!user.isBanned ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          
                          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Xoá tài khoản"
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
          page={userPage}
          totalPages={totalUserPages}
          onChange={setUserPage}
        />
      </div>
    </div>
  );
};

export default UserTab;

import React from 'react'
import { useState } from 'react';
import { Search, Plus, CheckCircle2, Ban, UserX, UserCheck, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { type User, type UserRole, type UserStatus } from "./mockData/Users";
import  initialUsers  from "./mockData/Users";
import { useMemo } from 'react';

const UserTab = ({ onEditUser }: { onEditUser: (user: User | "new" | null) => void }) => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | UserRole>("all");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | UserStatus>("all");
  const [userPage, setUserPage] = useState(1);
  const USERS_PER_PAGE = 5;
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
      const matchStatus = userStatusFilter === "all" || u.status === userStatusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, userSearch, userRoleFilter, userStatusFilter]);

  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE));
  const pagedUsers = filteredUsers.slice((userPage - 1) * USERS_PER_PAGE, userPage * USERS_PER_PAGE);

    
  return (
     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Quản lý người dùng</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Tổng cộng <span className="font-bold text-slate-900 dark:text-white">{users.length + 12440}</span> tài khoản trên hệ thống.</p>
        </div>
        <button
          onClick={() => onEditUser("new")}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" /> Thêm người dùng
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text" value={userSearch} onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
              placeholder="Tìm theo tên, email..."
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all w-full"
            />
          </div>
          <select
            value={userRoleFilter}
            onChange={(e) => { setUserRoleFilter(e.target.value as typeof userRoleFilter); setUserPage(1); }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="Free">Free</option>
            <option value="Premium">Premium</option>
            <option value="Admin">Admin</option>
          </select>
          <select
            value={userStatusFilter}
            onChange={(e) => { setUserStatusFilter(e.target.value as typeof userStatusFilter); setUserPage(1); }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition-all"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Active">Hoạt động</option>
            <option value="Banned">Bị khoá</option>
          </select>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-950/60">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Vai trò</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden md:table-cell">Tham gia</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {pagedUsers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">Không tìm thấy người dùng nào.</td></tr>
              ) : pagedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shadow-inner ${user.status === "Banned" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`font-bold text-sm ${user.status === "Banned" ? "text-slate-400 line-through" : "text-slate-900 dark:text-white"}`}>{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold border ${user.role === "Admin" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent" : user.role === "Premium" ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700" : "bg-transparent text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.status === "Active"
                      ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Hoạt động</span>
                      : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 text-xs font-bold border border-red-100 dark:border-red-900"><Ban className="w-3.5 h-3.5" /> Bị khoá</span>
                    }
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap hidden md:table-cell">{user.date}</td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditUser(user)}
                        className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Chỉnh sửa"
                      ><Edit className="w-4 h-4" /></button>
                      <button
                        // onClick={() => handleToggleBan(user.id)}
                        className={`p-2 rounded-lg transition-colors ${user.status === "Active" ? "text-slate-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20" : "text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"}`}
                        title={user.status === "Active" ? "Khoá tài khoản" : "Mở khoá tài khoản"}
                      >{user.status === "Active" ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}</button>
                      <button
                        // onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="Xoá tài khoản"
                      ><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            {filteredUsers.length === 0 ? "0 kết quả" : `Hiển thị ${(userPage - 1) * USERS_PER_PAGE + 1}–${Math.min(userPage * USERS_PER_PAGE, filteredUsers.length)} / ${filteredUsers.length}`}
          </span>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setUserPage((p) => Math.max(1, p - 1))}
              disabled={userPage === 1}
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            ><ChevronLeft className="w-4 h-4" /></button>
            <span className="px-3 text-sm font-bold text-slate-700 dark:text-slate-300">{userPage} / {totalUserPages}</span>
            <button
              onClick={() => setUserPage((p) => Math.min(totalUserPages, p + 1))}
              disabled={userPage === totalUserPages}
              className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            ><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserTab
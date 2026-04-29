import { useRef, useMemo } from "react";
import { Search, X, Users, FileText } from "lucide-react";
import type { User } from "./mockData/Users";
import type { Doc } from "./mockData/Docs";
import DocStatusBadge from "./DocStatusBadge";

interface SearchPanelProps {
  globalSearch: string;
  setGlobalSearch: (value: string) => void;
  showSearchDrop: boolean;
  setShowSearchDrop: (value: boolean) => void;
  users: User[];
  docs: Doc[];
  onUserSelect: (user: User) => void;
  onDocSelect: (doc: Doc) => void;
}

const SearchPanel = ({
  globalSearch,
  setGlobalSearch,
  showSearchDrop,
  setShowSearchDrop,
  users,
  docs,
  onUserSelect,
  onDocSelect,
}: SearchPanelProps) => {
  const searchRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (q.length < 2) return { users: [] as User[], docs: [] as Doc[] };
    return {
      users: users
        .filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q),
        )
        .slice(0, 4),
      docs: docs
        .filter(
          (d) =>
            d.title.toLowerCase().includes(q) ||
            d.author.toLowerCase().includes(q),
        )
        .slice(0, 4),
    };
  }, [globalSearch, users, docs]);

  return (
    <div ref={searchRef} className="relative hidden sm:block">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
      <input
        type="text"
        value={globalSearch}
        onChange={(e) => {
          setGlobalSearch(e.target.value);
          setShowSearchDrop(true);
        }}
        onFocus={() => setShowSearchDrop(true)}
        placeholder="Tìm người dùng, tài liệu..."
        className="pl-9 pr-8 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-slate-300 dark:focus:border-slate-600 rounded-full text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-slate-900/20 dark:focus:ring-white/20 transition-all w-44 focus:w-64 duration-300"
      />
      {globalSearch && (
        <button
          onClick={() => {
            setGlobalSearch("");
            setShowSearchDrop(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Search dropdown — has results */}
      {showSearchDrop &&
        globalSearch.length >= 2 &&
        (searchResults.users.length > 0 || searchResults.docs.length > 0) && (
          <div className="absolute top-[calc(100%+8px)] right-0 w-[340px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
            {searchResults.users.length > 0 && (
              <div>
                <p className="px-4 pt-3.5 pb-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <Users className="w-3 h-3" /> Người dùng
                </p>
                {searchResults.users.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onUserSelect(u);
                      setShowSearchDrop(false);
                      setGlobalSearch("");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors text-left group"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${u.status === "Banned" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400" : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"}`}
                    >
                      {u.name.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-slate-900">
                        {u.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {u.email}
                      </p>
                    </div>
                    <span
                      className={`ml-auto shrink-0 text-[10px] font-black px-2 py-0.5 rounded-full border ${u.role === "Admin" ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent" : u.role === "Premium" ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700" : "bg-transparent text-slate-400 border-slate-200 dark:border-slate-700"}`}
                    >
                      {u.role}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {searchResults.docs.length > 0 && (
              <div
                className={
                  searchResults.users.length > 0
                    ? "border-t border-slate-100 dark:border-slate-800"
                    : ""
                }
              >
                <p className="px-4 pt-3.5 pb-1.5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-3 h-3" /> Tài liệu
                </p>
                {searchResults.docs.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onDocSelect(d);
                      setShowSearchDrop(false);
                      setGlobalSearch("");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors text-left group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {d.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {d.author} · {d.category}
                      </p>
                    </div>
                    <DocStatusBadge status={d.status} />
                  </button>
                ))}
              </div>
            )}
            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {searchResults.users.length + searchResults.docs.length}{" "}
                kết quả cho "
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  {globalSearch}
                </span>
                "
              </p>
            </div>
          </div>
        )}

      {/* Search dropdown — no results */}
      {showSearchDrop &&
        globalSearch.length >= 2 &&
        searchResults.users.length === 0 &&
        searchResults.docs.length === 0 && (
          <div className="absolute top-[calc(100%+8px)] right-0 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-center z-50 animate-in fade-in zoom-in-95 duration-150">
            <Search className="w-8 h-8 text-slate-200 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Không có kết quả cho&nbsp;
              <span className="text-slate-900 dark:text-white">
                "{globalSearch}"
              </span>
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium">
              Thử tìm theo tên hoặc email
            </p>
          </div>
        )}
    </div>
  );
};

export default SearchPanel;

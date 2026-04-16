import { Search } from "lucide-react";
import { X } from "lucide-react";

const SearchBar = ({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
      <input
        type="text"
        placeholder="Tìm tài liệu, tác giả, thẻ tag..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
        }}
        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-transparent shadow-sm"
      />
      {searchQuery && (
        <button
          onClick={() => {
            setSearchQuery("");
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <X className="w-3 h-3 text-slate-600 dark:text-slate-300" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

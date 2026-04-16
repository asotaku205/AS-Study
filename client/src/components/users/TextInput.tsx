
const TextInput = () => {
  return (
    <textarea
      className="w-full p-5 border border-slate-300 dark:border-slate-700 rounded-xl min-h-[160px] focus:ring-2 focus:ring-slate-900 dark:focus:ring-white focus:border-slate-900 dark:focus:border-white outline-none resize-y bg-slate-50 dark:bg-slate-950 placeholder-slate-400 dark:placeholder-slate-500 text-slate-900 dark:text-white"
      placeholder="Dán nội dung bài học, chương sách hoặc nhập từ khóa chủ đề vào đây..."
      required
    />
  );
};

export default TextInput;

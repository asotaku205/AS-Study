import { Link } from "react-router-dom";
import {
  BookOpen,
  Target,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Zap,
  Globe,
  Sparkles,
  Layers,
  Library as LibraryIcon,
  ArrowUpRight,
} from "lucide-react";
const HomePage = () => {
  return (
    <div className="space-y-32 pb-24 relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-slate-300/30 dark:bg-slate-800/20 rounded-full blur-[120px] opacity-50 mix-blend-multiply dark:mix-blend-lighten"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-slate-400/20 dark:bg-slate-700/20 rounded-full blur-[100px] opacity-50 mix-blend-multiply dark:mix-blend-lighten"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-12  overflow-hidden">
        <div className="relative z-10 text-center space-y-8 max-w-5xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-sm shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>Nền tảng học tập AI thế hệ mới</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-slate-900 dark:text-white tracking-tight leading-[1.05]">
            Biến tài liệu thành <br />
            <span className="text-slate-500 dark:text-slate-400">
              tri thức của bạn
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium">
            Tự động tạo câu hỏi, biên soạn bài giảng chi tiết và tương tác với gia
            sư AI thông minh chỉ trong vài giây. Tối ưu hoá khả năng tập trung.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link
              to="/register"
              className="w-full sm:w-auto px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3 text-lg group"
            >
              Bắt đầu miễn phí{" "}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/study"
              className="w-full sm:w-auto px-10 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:border-slate-900 dark:hover:border-slate-500 transition-all text-lg text-center"
            >
              Khám phá phòng học
            </Link>
          </div>

          <div className="pt-14 text-sm font-bold text-slate-500 dark:text-slate-400 flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-white" />{" "}
              Dễ dàng sử dụng
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-white" />{" "}
              Thiết lập trong 30s
            </span>
            <span className="flex items-center gap-2 hidden sm:flex">
              <CheckCircle2 className="w-5 h-5 text-slate-900 dark:text-white" />{" "}
              Hỗ trợ Tiếng Việt
            </span>
          </div>
        </div>
      </section>

      {/* Stats Section*/}
      <section className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="bg-slate-950/90 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] p-10 md:p-16 text-white shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5">
            <Globe className="w-96 h-96 text-white" />
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="space-y-3">
              <p className="text-5xl md:text-6xl font-black text-white">50k+</p>
              <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">
                Giờ học tập
              </p>
            </div>
            <div className="space-y-3 pt-12 md:pt-0">
              <p className="text-5xl md:text-6xl font-black text-white">
                120k+
              </p>
              <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">
                Câu hỏi Quiz tạo ra
              </p>
            </div>
            <div className="space-y-3 pt-12 md:pt-0">
              <p className="text-5xl md:text-6xl font-black text-white">99%</p>
              <p className="text-slate-400 font-bold tracking-widest uppercase text-sm">
                Người dùng hài lòng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Library Banner */}
      <section className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-8 md:p-12 rounded-[2rem] border border-white/40 dark:border-slate-800/60 shadow-lg flex flex-col md:flex-row items-center gap-8 md:gap-12 relative overflow-hidden group">
          {/*  background  */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-slate-100/50 to-transparent dark:from-slate-800/50 -z-10 group-hover:scale-105 transition-transform duration-700"></div>

          <div className="w-20 h-20 bg-slate-900 dark:bg-white rounded-3xl flex items-center justify-center shrink-0 shadow-xl rotate-3 group-hover:rotate-0 transition-transform">
            <LibraryIcon className="w-10 h-10 text-white dark:text-slate-900" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              Thư Viện Tài Liệu Cộng Đồng
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium max-w-2xl leading-relaxed">
              Khám phá hàng ngàn tài liệu học tập được chia sẻ từ cộng đồng. Lưu
              trữ vào thư viện cá nhân, học với AI hoặc tạo câu hỏi ngay lập tức.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              to="/library"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg hover:shadow-xl"
            >
              Truy cập Thư viện <ArrowUpRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/*Grid Features */}
      <section className="max-w-6xl mx-auto space-y-16 px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Hệ sinh thái học tập{" "}
            <span className="text-slate-500 dark:text-slate-400">
              toàn diện
            </span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-xl font-medium">
            Mọi công cụ bạn cần để tiếp thu kiến thức nhanh hơn, nhớ lâu hơn,
            được thiết kế tối giản tuyệt đối.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-10 md:p-12 rounded-[2rem] border border-white/40 dark:border-slate-800/60 shadow-lg transition-all group overflow-hidden relative">
            <div className="relative z-10 max-w-lg">
              <div className="w-16 h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                Bài Giảng AI <br /> Chuyên Sâu
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-medium">
                Nhập chủ đề bạn muốn học, AI sẽ biên soạn một bài giảng chi
                tiết, chia nhỏ ý chính, đi kèm ví dụ thực tế cực dễ hiểu thay vì
                những đoạn văn bản dài lê thê.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
              <BookOpen className="w-64 h-64 text-slate-900 dark:text-white" />
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-slate-800 p-10 md:p-12 rounded-[2rem] text-white shadow-lg transition-all group relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-white mb-4">
                Tạo trắc nghiệm
                <br />
                Tự Động
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg font-medium">
                Phân tích tài liệu PDF, DOCX, ... và sinh bài trắc nghiệm thông minh.
              </p>
            </div>
          </div>

          <div className="md:col-span-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-10 md:p-12 rounded-[2rem] border border-white/40 dark:border-slate-800/60 shadow-lg transition-all group flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="w-16 h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                Trợ lý Gia sư Đa Năng 24/7
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg font-medium max-w-2xl">
                Không gian Chat AI mở để bạn hỏi bất cứ điều gì. Gia sư ảo luôn
                sẵn sàng 24/7 để cùng bạn giải quyết vấn đề khó, giải bài tập
                hoặc giải thích lại các khái niệm phức tạp bằng ngôn ngữ đời
                thường.
              </p>
            </div>
            <div className="w-full md:w-1/3 bg-slate-100/50 dark:bg-slate-950/50 backdrop-blur-md rounded-2xl p-6 border border-white/50 dark:border-slate-800 shadow-inner">
              <div className="flex gap-3 mb-4">
                <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-full flex-shrink-0 flex items-center justify-center">
                  <span className="text-[10px] text-white dark:text-slate-900 font-bold">
                    You
                  </span>
                </div>
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm text-sm font-medium text-slate-900 dark:text-white">
                  Giải thích giúp tôi về Lượng tử?
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 bg-slate-300 dark:bg-slate-700 rounded-full flex-shrink-0 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                </div>
                <div className="bg-slate-900 dark:bg-slate-100 p-3 rounded-2xl rounded-tr-none shadow-sm text-sm font-medium text-white dark:text-slate-900">
                  Hãy tưởng tượng một đồng xu đang xoay...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start Section */}
      <section className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white/50 dark:border-slate-800 rounded-[2.5rem] p-12 md:p-20 text-center space-y-10 shadow-2xl">
          <Zap className="w-16 h-16 text-slate-900 dark:text-white mx-auto" />
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Sẵn sàng bứt phá?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              Nâng cao hiệu suất học tập của bạn lên một tầm cao mới với AI
              Scholarly.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-xl text-lg"
          >
            Tạo tài khoản ngay bây giờ
          </Link>
        </div>
      </section>
    </div>
  );
};
export default HomePage;

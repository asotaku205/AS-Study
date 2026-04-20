import { ArrowRight, BarChart3, BrainCircuit, CheckCircle2, Clock, RefreshCw, Sparkles, Target, Trophy, XCircle } from "lucide-react"
import { Link } from "react-router-dom"
const QuizResult = () => {

  const resultsData = {
  score: 80,
  time: "12:34",
  correct: 8,
  total: 10,
  aiRecommendations: [
    {
      id: 1,
      title: "Chính sách Tiền tệ & Lạm phát",
      description: "Bạn gặp khó khăn trong việc phân biệt các công cụ của NHTW. Hãy xem lại chương 4 trong tài liệu tham khảo.",
      actionText: "VÀO CHẾ ĐỘ HỌC TẬP",
      actionLink: "/study/new"
    },
    {
      id: 2,
      title: "Mô hình IS-LM trong Kinh tế mở",
      description: "Sự hiểu biết về tác động của tỷ giá hối đoái còn hạn chế. Bài quiz này cho thấy tỷ lệ sai 60% ở mảng này.",
      actionText: "LUYỆN TẬP THÊM",
      actionLink: "/create-quiz"
    }
  ],
  questions: [
    {
      id: 1,
      q: "Ngôn ngữ lập trình nào được sử dụng chủ yếu để xây dựng giao diện web?",
      yourAnswer: "JavaScript",
      correctAnswer: "JavaScript",
      isCorrect: true,
      explanation: "JavaScript là ngôn ngữ chuẩn để tạo tính tương tác trên trình duyệt, kết hợp cùng HTML và CSS tạo nên giao diện web động."
    },
    {
      id: 2,
      q: "ReactJS là một thư viện của ngôn ngữ nào?",
      yourAnswer: "TypeScript",
      correctAnswer: "JavaScript",
      isCorrect: false,
      explanation: "Mặc dù ReactJS thường được dùng với TypeScript hiện nay, nhưng bản chất nó là một thư viện của JavaScript, được phát triển bởi Facebook."
    }
  ]
};
  return (
     <div className="max-w-5xl mx-auto space-y-12 pb-12">
      {/* Overview Card */}
      <section 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-sm"
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 dark:from-white to-transparent"></div>
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center justify-center p-3 bg-slate-100 dark:bg-slate-800 rounded-full mb-2">
            <Trophy className="w-8 h-8 text-slate-900 dark:text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Hoàn thành bài thi!</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6">
            <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <BarChart3 className="w-5 h-5 text-slate-400 mb-3" />
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2">Điểm số</span>
              <div className="text-4xl font-bold text-slate-900 dark:text-white">{resultsData.score}%</div>
            </div>
            
            <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <Clock className="w-5 h-5 text-slate-400 mb-3" />
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2">Thời gian</span>
              <div className="text-4xl font-semibold text-slate-900 dark:text-white">{resultsData.time}</div>
            </div>

            <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <Target className="w-5 h-5 text-slate-400 mb-3" />
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2">Đúng</span>
              <div className="text-4xl font-semibold text-emerald-600 dark:text-emerald-400">
                {resultsData.correct} <span className="text-xl text-slate-400 dark:text-slate-500">/ {resultsData.total}</span>
              </div>
            </div>

            <div className="flex flex-col items-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <XCircle className="w-5 h-5 text-slate-400 mb-3" />
              <span className="text-sm text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider mb-2">Sai</span>
              <div className="text-4xl font-semibold text-rose-600 dark:text-rose-400">
                {resultsData.total - resultsData.correct} <span className="text-xl text-slate-400 dark:text-slate-500">/ {resultsData.total}</span>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/create-quiz"
              className="px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCw className="w-5 h-5" /> Thử lại
            </Link>
            <Link
              to="/study/new"
              className="px-8 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <BrainCircuit className="w-5 h-5" /> Ôn tập ngay <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-sm"
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Đề xuất từ AS Scholarly
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base">
              Dựa trên các câu trả lời chưa chính xác, bạn nên tập trung vào:
            </p>
          </div>
          <Sparkles className="w-8 h-8 text-slate-400 dark:text-slate-500 shrink-0 mt-1" />
        </div>

        <div className="space-y-8">
          {resultsData.aiRecommendations.map((rec) => (
            <div key={rec.id} className="flex gap-6 items-start">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-2xl text-slate-900 dark:text-white shrink-0">
                {rec.id.toString().padStart(2, '0')}
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {rec.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
                  {rec.description}
                </p>
                <div className="pt-2">
                  <Link 
                    to={rec.actionLink}
                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b-2 border-transparent hover:border-slate-900 dark:hover:border-white transition-colors pb-0.5"
                  >
                    {rec.actionText} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed Review */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Chi tiết bài làm
          </h2>
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {resultsData.questions.length} câu hỏi
          </span>
        </div>
        
        <div className="space-y-6">
          {resultsData.questions.map((q, idx) => (
            <div 
              key={q.id} 
              className={`bg-white dark:bg-slate-900 rounded-2xl border ${
                q.isCorrect ? 'border-emerald-200 dark:border-emerald-900/50' : 'border-rose-200 dark:border-rose-900/50'
              } p-6 shadow-sm overflow-hidden relative`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                q.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
              }`}></div>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {q.isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-500" />
                  )}
                </div>
                <div className="flex-1 space-y-5">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white leading-relaxed">
                    <span className="text-slate-400 dark:text-slate-500 mr-2">{idx + 1}.</span>
                    {q.q}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Bạn chọn:</span>
                      <span className={`font-semibold text-base ${
                        q.isCorrect 
                          ? 'text-emerald-700 dark:text-emerald-400' 
                          : 'text-rose-700 dark:text-rose-400'
                      }`}>
                        {q.yourAnswer}
                      </span>
                    </div>
                    {!q.isCorrect && (
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="block text-slate-500 dark:text-slate-400 mb-1 font-medium">Đáp án đúng:</span>
                        <span className="font-semibold text-base text-emerald-700 dark:text-emerald-400">
                          {q.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 mt-4 flex gap-3">
                    <BrainCircuit className="w-5 h-5 text-slate-700 dark:text-slate-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white block mb-1">AI Giải thích:</span>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default QuizResult
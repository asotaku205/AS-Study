import { BookOpen, Globe, MessageSquare, PenTool, Sparkles, Target, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "../components/users/ChatBox";
const StudyMode = () => {
    const navigate = useNavigate();
    const [isChatOpen, setIsChatOpen] = useState(false);
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)] relative pb-6">
      
      {/* Main Content Area */}
      <div className={`flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300 ${isChatOpen ? 'lg:w-[65%]' : 'w-full'}`}>
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Chế độ: Chi tiết & Chuyên sâu</span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Machine Learning Cơ bản & Ứng dụng
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Chia sẻ cộng đồng</span>
            </button>
            {/* Toggle Chat Button */}
            {!isChatOpen && (
              <button 
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Mở Trợ lý AI</span>
              </button>
            )}
          </div>
        </div>
        
        {/* Article Body */}
        <div className="p-8 md:px-12 md:py-10 overflow-y-auto flex-1 bg-slate-50/30 dark:bg-slate-900">
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-slate dark:prose-invert prose-lg prose-headings:font-black prose-headings:tracking-tight max-w-none">
              
              <p className="text-slate-700 dark:text-slate-300 font-medium text-xl leading-relaxed mb-10 border-l-4 border-slate-900 dark:border-white pl-6 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-r-xl">
                Machine Learning (Học máy) là một nhánh của Trí tuệ Nhân tạo (AI), tập trung vào việc sử dụng dữ liệu và thuật toán để bắt chước cách con người học tập, dần dần cải thiện độ chính xác mà không cần được lập trình trực tiếp cho từng tình huống.
              </p>

              <h2>1. Phân loại Học Máy chính</h2>
              <p className="font-medium">Dựa trên cách thức huấn luyện, chúng ta chia học máy thành 3 nhóm cơ bản:</p>
              
              <div className="grid gap-4 not-prose mb-10">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    Học có giám sát (Supervised Learning)
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Mô hình được huấn luyện trên một tập dữ liệu đã được gán nhãn. Đầu vào và đầu ra kỳ vọng đã được xác định rõ ràng.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    Học không giám sát (Unsupervised Learning)
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Mô hình tự tìm ra các mẫu (patterns) hoặc cấu trúc ẩn trong dữ liệu thô hoàn toàn không được gán nhãn.</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    Học tăng cường (Reinforcement Learning)
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Mô hình học cách ra quyết định thông qua quá trình thử - sai, nhận phần thưởng khi làm đúng và bị phạt khi làm sai.</p>
                </div>
              </div>

              <h2>2. Ứng dụng Thực tế</h2>
              <p className="font-medium">Học máy đang len lỏi vào mọi ngóc ngách của cuộc sống số:</p>
              <ul className="font-medium">
                <li><strong>Thương mại điện tử:</strong> Các hệ thống gợi ý sản phẩm của Amazon, Shopee phân tích lịch sử mua hàng của bạn để đưa ra đề xuất.</li>
                <li><strong>Giải trí:</strong> Netflix và Spotify dùng ML để giữ chân người dùng bằng cách gợi ý phim, nhạc hợp gu.</li>
                <li><strong>Xử lý ngôn ngữ tự nhiên (NLP):</strong> Công nghệ đằng sau các trợ lý ảo như ChatGPT, Google Translate.</li>
                <li><strong>Y tế:</strong> ML có khả năng phân tích hàng ngàn bức ảnh X-quang trong vài phút để phát hiện dấu hiệu ung thư sớm với độ chính xác cao hơn cả bác sĩ con người.</li>
              </ul>

              <div className="my-12 not-prose bg-slate-900 dark:bg-slate-800 text-white rounded-2xl p-8 relative overflow-hidden shadow-lg border border-transparent dark:border-slate-700">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Zap className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4 text-slate-300 font-bold uppercase tracking-wider text-sm">
                    <PenTool className="w-4 h-4" />
                    Bài tập tư duy
                  </div>
                  <p className="text-lg leading-relaxed mb-6 font-bold">
                    Hãy thử phân loại bài toán sau: Hệ thống nhận diện khuôn mặt để mở khóa điện thoại thông minh (Face ID) sử dụng phương pháp học máy nào?
                  </p>
                  <p className="text-slate-400 text-sm font-medium">
                    💡 Gợi ý: Hãy nghĩ xem điện thoại của bạn cần học khuôn mặt của bạn (gắn nhãn là "Chủ nhân") lúc mới mua máy như thế nào. Bạn có thể hỏi Chatbot AI bên phải để thảo luận nhé.
                  </p>
                </div>
              </div>

            </article>
            
            {/* End of Lesson Actions */}
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/study')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm"
              >
                <BookOpen className="w-5 h-5" />
                Học tiếp chủ đề mới
              </button>
              <button 
                onClick={() => navigate('/create-quiz')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Target className="w-5 h-5" />
                Tạo Quiz ôn tập bài này
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating/Docked Chatbot UI */}
      {isChatOpen && (
        <ChatBox setIsChatOpen={setIsChatOpen} />
      )}
    </div>
  )
}

export default StudyMode
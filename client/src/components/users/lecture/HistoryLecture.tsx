import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type RecentStudy = {
  id: number;
  title: string;
  date: string;
  progress: string;
  content: string;
};

const HistoryLecture = () => {
  const [studies, setStudies] = useState<RecentStudy[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const lectureHistoryStr = localStorage.getItem("lectureHistory");
    if (lectureHistoryStr) {
      try {
        const parsed = JSON.parse(lectureHistoryStr);
        setStudies(parsed);
        return;
      } catch (err) {
        console.error("Lỗi khi load lectureHistory:", err);
      }
    }

    // Fallback to mock history
    setStudies([
      {
        id: 1,
        title: "Khóa học ReactJS cơ bản",
        date: "1 ngày trước",
        progress: "45%",
        content: ""
      },
      {
        id: 2,
        title: "Khóa học TypeScript nâng cao",
        date: "2 ngày trước",
        progress: "75%",
        content: ""
      }
    ]);
  }, []);

  const handleSelectLecture = (study: RecentStudy) => {
    if (!study.content) return;
    localStorage.setItem("activeLecture", JSON.stringify({
      title: study.title,
      content: study.content
    }));
    navigate("/study");
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-700 dark:text-slate-300" /> 
          Đang học dở
        </h2>
        <div className="space-y-4">
          {studies.map((study) => {
            const hasContent = study.content && study.content.length > 0;
            return (
              <div 
                key={study.id} 
                onClick={() => hasContent && handleSelectLecture(study)}
                className={`bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between group block ${hasContent ? 'cursor-pointer' : ''}`}
              >
                <div>
                  <h3 className={`font-bold text-slate-900 dark:text-white transition-colors line-clamp-2 mb-2 ${hasContent ? 'group-hover:text-slate-600 dark:group-hover:text-slate-300' : ''}`}>
                    {study.title}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">Cập nhật: {study.date}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-slate-900 dark:bg-white h-full rounded-full transition-all duration-500" 
                      style={{ width: study.progress }}
                    />
                  </div>
                  <span className="text-xs font-black text-slate-900 dark:text-white min-w-[2.5rem] text-right">
                    {study.progress}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryLecture;
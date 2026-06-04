import { Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserId } from "../../../services/authService";
import { getMyLectures } from "../../../services/lectureService";

type RecentStudy = {
  id: number;
  title: string;
  date: string;
  content: string;
};

const formatTimeAgo = (dateStr: string) => {
  if (!dateStr) return "Vừa xong";
  if (!dateStr.includes("-") && !dateStr.includes("/")) return dateStr;
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} giờ trước`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} ngày trước`;
  return date.toLocaleDateString("vi-VN");
};

const HistoryLecture = () => {
  const [studies, setStudies] = useState<RecentStudy[]>([]);
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const historyKey = userId ? `lectureHistory_${userId}` : "lectureHistory";

  useEffect(() => {
    getMyLectures()
      .then((data) => {
        const formatted = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          date: item.createdAt,
          content: item.content,
        }));
        setStudies(formatted);
      })
      .catch((err) => {
        console.error("Lỗi khi tải bài giảng từ DB:", err);
        const lectureHistoryStr = localStorage.getItem(historyKey);
        if (lectureHistoryStr) {
          try {
            const parsed = JSON.parse(lectureHistoryStr);
            setStudies(parsed);
          } catch (localErr) {
            console.error("Lỗi khi parse local lectureHistory:", localErr);
          }
        }
      });
  }, [historyKey]);

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
        <div className="space-y-4 max-h-[580px] overflow-y-auto">
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
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">Cập nhật: {formatTimeAgo(study.date)}</p>
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
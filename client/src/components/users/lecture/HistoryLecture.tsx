import { Clock } from "lucide-react";
import { Link } from "react-router-dom";
const HistoryLecture = () => {
    const recentStudies: {
        id: number;
        title: string;
        date: string;
        progress: string;
    }[] = [
        {
            id: 1,
            title: "Khóa học ReactJS cơ bản",
            date: "1 ngày trước",
            progress: "45%",
        },
        {
            id: 2,
            title: "Khóa học TypeScript nâng cao",
            date: "2 ngày trước",
            progress: "75%",
        }
    ];
  return (
    <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-700 dark:text-slate-300" /> 
              Đang học dở
            </h2>
            <div className="space-y-4">
              {recentStudies.map((study) => (
                <Link 
                  key={study.id} 
                  to={`/study/${study.id}`}
                  className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between group block"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors line-clamp-2 mb-2">
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
                </Link>
              ))}
            </div>
          </div>
        </div>

  )
}

export default HistoryLecture
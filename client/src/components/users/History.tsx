import { CheckCircle2, Clock } from "lucide-react";
import { Link } from "react-router-dom";
const History = () => {
  return (
     <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-slate-700 dark:text-slate-300" /> 
              Các Quiz gần đây
            </h2>
            <div className="space-y-4">
              {recentQuizzes.map((quiz) => (
                <div key={quiz.id} className="bg-slate-50 dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer group">
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors line-clamp-2">{quiz.title}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {quiz.date}</span>
                    </div>
                    <span className="text-sm font-black bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-2 py-1 rounded-md shadow-sm">{quiz.score}</span>
                  </div>
                  <Link 
                    to={`/quiz-results/${quiz.id}`} 
                    className="mt-4 block w-full text-center py-2.5 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    Xem kết quả
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
  )
}

export default History
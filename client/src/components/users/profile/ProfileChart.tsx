// import React from 'react'

// const ProfileChart = () => {
//   return (
//     <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-2xl border border-white/50 dark:border-slate-800 shadow-xl flex flex-col flex-1">
//             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
//               <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">
//                 <BarChart3 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
//                 Tổng quan Học tập (Tuần này)
//               </h3>
//               <select className="text-sm font-semibold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white shadow-sm transition-all">
//                 <option>Tất cả hoạt động</option>
//                 <option>Số Quiz</option>
//                 <option>Tài liệu đã lưu</option>
//               </select>
//             </div>
            
//             <div className="flex-1 w-full min-h-[300px]">
//               <ResponsiveContainer width="100%" height="100%">
//                 <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
//                   <defs>
//                     <linearGradient id="colorStudyTime" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor={isDark ? "#F8FAFC" : "#0F172A"} stopOpacity={0.15}/>
//                       <stop offset="95%" stopColor={isDark ? "#F8FAFC" : "#0F172A"} stopOpacity={0}/>
//                     </linearGradient>
//                     <linearGradient id="colorQuizzes" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor={isDark ? "#94A3B8" : "#64748B"} stopOpacity={0.15}/>
//                       <stop offset="95%" stopColor={isDark ? "#94A3B8" : "#64748B"} stopOpacity={0}/>
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "#1E293B" : "#E2E8F0"} />
//                   <XAxis 
//                     dataKey="name" 
//                     axisLine={false} 
//                     tickLine={false} 
//                     tick={{fill: isDark ? '#64748B' : '#94A3B8', fontSize: 13, fontWeight: 600}} 
//                     dy={15} 
//                   />
//                   <YAxis 
//                     axisLine={false} 
//                     tickLine={false} 
//                     tick={{fill: isDark ? '#64748B' : '#94A3B8', fontSize: 13, fontWeight: 600}} 
//                   />
//                   <Tooltip 
//                     contentStyle={{ 
//                       borderRadius: '12px', 
//                       border: isDark ? '1px solid #334155' : '1px solid #E2E8F0', 
//                       backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
//                       backdropFilter: 'blur(8px)',
//                       color: isDark ? '#F8FAFC' : '#0F172A',
//                       boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
//                       fontWeight: 600
//                     }}
//                     itemStyle={{ color: isDark ? '#F8FAFC' : '#0F172A', fontWeight: 'bold' }}
//                     labelStyle={{ color: isDark ? '#94A3B8' : '#64748B', paddingBottom: '4px' }}
//                   />
//                   <Area 
//                     type="monotone" 
//                     name="Giờ học"
//                     dataKey="studyTime" 
//                     stroke={isDark ? "#F8FAFC" : "#0F172A"} 
//                     strokeWidth={3} 
//                     fillOpacity={1} 
//                     fill="url(#colorStudyTime)" 
//                   />
//                   <Area 
//                     type="monotone" 
//                     name="Quiz đã tạo"
//                     dataKey="quizzes" 
//                     stroke={isDark ? "#94A3B8" : "#64748B"} 
//                     strokeWidth={2} 
//                     strokeDasharray="4 4"
//                     fillOpacity={1} 
//                     fill="url(#colorQuizzes)" 
//                   />
//                 </AreaChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//   )
// }

// export default ProfileChart
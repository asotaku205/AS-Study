import { FileText, File, X } from "lucide-react";
const UploadZone = ({ file, setFile }: { file: File | null; setFile: (file: File | null) => void }) => {
  return (
    <>
          {!file ? (
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {}}
              className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input 
                id="file-upload" 
                type="file" 
                className="hidden" 
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
              />    
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-500 dark:text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Kéo thả file vào đây hoặc nhấn để chọn
              </h3>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                Hỗ trợ PDF, DOCX, PPTX, TXT,MD (Tối đa 50MB)
              </p>
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shadow-sm">
                  <File className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{file.name}</h4>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setFile(null)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          </>
  )
}

export default UploadZone
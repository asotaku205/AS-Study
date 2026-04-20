import {  Bot, Plus } from "lucide-react";
import Message from "../components/users/chatbox/Message";
import Input from "../components/users/chatbox/Input";
import HistoryChat from "../components/users/chatbox/HistoryChat";


const ChatAI = () => {
    
    return (  
    <div className="flex h-[calc(100vh-8rem)] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      {/* Sidebar - History */}
      <HistoryChat/>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-white dark:bg-slate-900">
        {/* Chat Header for Mobile */}
        <div className="md:hidden px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
            <Bot className="w-5 h-5 text-blue-900 dark:text-blue-400" /> Trợ lý AI
          </div>
          <button className="p-1.5 bg-slate-100 dark:bg-slate-800 rounded-md">
            <Plus className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
        </div>

        {/* Messages */}
        <Message/>

        {/* Input Area */}
        <Input/>

      </div>
    </div>
    );
}
export default ChatAI;
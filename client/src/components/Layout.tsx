import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-slate-200 selection:text-slate-900 dark:selection:bg-slate-800 dark:selection:text-white transition-colors duration-300">
      <Header />
      <main className="grow pt-16 relative">
        {/* background*/}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-slate-200/40 dark:bg-slate-800/10 rounded-full blur-[100px] opacity-60"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-slate-200/40 dark:bg-slate-800/20 rounded-full blur-[100px] opacity-60"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative z-10">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;

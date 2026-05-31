import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";

// Lazy load tất cả pages để giảm initial bundle size
const NotFound = lazy(() => import("./pages/NotFound"));
const Layout = lazy(() => import("./components/Layout"));
const HomePage = lazy(() => import("./pages/HomePage"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Library = lazy(() => import("./pages/Library"));
const DocsDetail = lazy(() => import("./pages/DocsDetail"));
const PersonalLibrary = lazy(() => import("./pages/PersonalLibrary"));
const UploadDoc = lazy(() => import("./pages/UploadDoc"));
const CreateQuiz = lazy(() => import("./pages/CreateQuiz"));
const CreateLecture = lazy(() => import("./pages/CreateLecture"));
const ChatAI = lazy(() => import("./pages/ChatAI"));
const QuizMode = lazy(() => import("./pages/QuizMode"));
const QuizResult = lazy(() => import("./pages/QuizResult"));
const StudyMode = lazy(() => import("./pages/StudyMode"));
const Profile = lazy(() => import("./pages/Profile"));
const Setting = lazy(() => import("./pages/Setting"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminRoute = lazy(() =>
  import("./components/admin/AdminRoute").then((m) => ({ default: m.AdminRoute }))
);
const RequireRole = lazy(() =>
  import("./components/admin/AdminRoute").then((m) => ({ default: m.RequireRole }))
);

// Skeleton fallback khi lazy load
const PageSkeleton = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-slate-900 dark:border-white border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Đang tải...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/library" element={<Library />} />
            <Route path="/library/:id" element={<DocsDetail />} />
            <Route path="/personal-library" element={<PersonalLibrary />} />
            <Route path="/upload" element={<UploadDoc />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/create-lecture" element={<CreateLecture />} />
            <Route path="/chat" element={<ChatAI />} />
            <Route path="/quiz" element={<QuizMode />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/quiz-result" element={<QuizResult />} />
            <Route path="/study" element={<StudyMode />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Setting />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route element={<RequireRole allow={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <ToastContainer position="top-right" autoClose={2500} />
    </ErrorBoundary>
  );
}

export default App;


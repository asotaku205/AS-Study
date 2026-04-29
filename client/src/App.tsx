import { Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Library from "./pages/Library";
import DocsDetail from "./pages/DocsDetail";
import PersonalLibrary from "./pages/PersonalLibrary";
import UploadDoc from "./pages/UploadDoc";
import CreateQuiz from "./pages/CreateQuiz";
import CreateLecture from "./pages/CreateLecture";
import ChatAI from "./pages/ChatAI";
import QuizMode from "./pages/QuizMode";
import QuizResult from "./pages/QuizResult";
import StudyMode from "./pages/StudyMode";
import Profile from "./pages/Profile";
import Setting from "./pages/Setting";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
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
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboard/>}/>
      </Routes>
  );
}

export default App;

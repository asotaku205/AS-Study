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
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
  );
}

export default App;

import api from "./api";

export const saveQuizResult = async (topic: string, difficulty: string, questionCount: number, score: number | null, questions?: any) => {
  const response = await api.post("/quizz/save-result", { topic, difficulty, questionCount, score, questions });
  return response.data;
};

export const getMyQuizzes = async () => {
  const response = await api.get("/quizz/my-quizzes");
  return response.data;
};



export const getMyQuizStats = async () => {
  const response = await api.get("/quizz/my-stats");
  return response.data;
};

export const getAdminQuizStats = async () => {
  const response = await api.get("/quizz/admin-stats");
  return response.data;
};

export const getMyRecentActivity = async () => {
  const response = await api.get("/quizz/my-recent");
  return response.data;
};


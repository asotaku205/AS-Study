import api from "./api";

export const saveLecture = async (title: string, content: string) => {
  const response = await api.post("/lectures/save-lecture", { title, content });
  return response.data;
};

export const getMyLectures = async () => {
  const response = await api.get("/lectures/my-lectures");
  return response.data;
};

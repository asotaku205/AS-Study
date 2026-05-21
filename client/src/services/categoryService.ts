import api from "./api";
import type { CategoriesStatus } from "../types/categoryTypes";

export const createCategory = async (name: string, slug: string, status: CategoriesStatus) => {
  const response = await api.post("/categories", { name, slug, status });
  return response.data;
}
export const getAllCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
}
export const updateCategory = async (id: number, name: string, slug: string, status: CategoriesStatus) => {
  const response = await api.patch(`/categories/${id}`, { name, slug, status });
  return response.data;
}
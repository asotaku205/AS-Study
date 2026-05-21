import { useEffect, useState } from "react";
import type { Category } from "../types/categoryTypes";
import { getAllCategories } from "../services/categoryService";

const useGetCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
       }
    };

    loadCategories();
  }, []);

  return { categories, setCategories };
};
export default useGetCategories;

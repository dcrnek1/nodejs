import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useProductsByCategoryId = (category_id, options = {}) => {
  return useQuery({
    queryKey: ["product", "category", category_id],
    staleTime: 1 * 60 * 1000,
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/category/${category_id}`
      );
      return data;
    },
    ...options,
  });
};

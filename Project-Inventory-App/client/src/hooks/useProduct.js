import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useProductsByCategoryId = (category_id) => {
  return useQuery({
    queryKey: ["products", "category", category_id],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/category/${category_id}`
      );
      return data;
    },
  });
};

export const useAllProducts = () => {
  return useQuery({
    queryKey: ["products"],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/`
      );
      return data;
    },
  });
};

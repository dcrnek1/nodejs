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

export const useAllProducts = (column, order, page, limit) => {
  return useQuery({
    queryKey: ["products", column, order, page, limit],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/`,
        {
          params: {
            orderColumn: column,
            order: order,
            page: page,
            limit: limit
          },
        }
      );
      return data;
    },
  });
};

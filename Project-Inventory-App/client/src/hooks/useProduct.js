import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import axios from "axios";

export const useProductsByCategoryId = (category_id) => {
  return useQuery({
    queryKey: ["products", "category", category_id],
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/category/${category_id}`
      );
      return data;
    },
  });
};

export const useAllProducts = (column, order, limit) => {
  return useInfiniteQuery({
    queryKey: ["products", column, order, limit],
    staleTime: 5 * 60 * 1000,
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/`,
        {
          params: {
            orderColumn: column,
            orderValue: order,
            page: pageParam,
            limit,
          },
        }
      );
      return data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
  });
};

export const useProductById = (productId) => {
  return useQuery({
    queryKey: ["productById", productId],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/products/${productId}`
      );
      return data;
    }
  });
};

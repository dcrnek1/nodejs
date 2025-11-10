import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCategories = (order) => {
  return useQuery({
    queryKey: ["categories", order],
    staleTime: 1 * 60 * 1000,
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/categories`, {
          params: {
            order: order === 'asc' ? 'asc' : 'desc'
          }
        }
      );
      return data;
    },
  });
};

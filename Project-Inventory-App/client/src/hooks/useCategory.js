import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    staleTime: 1 * 60 * 1000,
    queryFn: async () => {
      const { data } = await axios.get(
        `https://${import.meta.env.VITE_API_URL}/categories`
      );
      return data;
    },
  });
};

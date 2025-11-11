import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useCategories = (order) => {
  return useQuery({
    queryKey: ["categories", order],
    staleTime: 1 * 60 * 1000,
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/categories`,
        {
          params: {
            order: order === "asc" ? "asc" : "desc",
          },
        }
      );
      return data;
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ category_id, data }) => {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/categories/update/${category_id}`,
        data
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries(["categories", 'desc']);
      queryClient.invalidateQueries({ queryKey: ["products", "category"] });
      toast.success("Succesfully updated category.");
    },
    onError: (error) => {
      toast.error("Error updating category.", {
        description: error?.response?.data?.errors?.[0]?.msg,
      });
    },
  });
};

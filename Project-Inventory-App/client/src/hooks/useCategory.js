import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useCategories = (column, order, limit) => {
  return useInfiniteQuery({
    queryKey: ["categories", column, order, limit],
    staleTime: 1 * 60 * 1000,
    placeholderData: keepPreviousData,
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/categories`,
        {
          params: {
            orderColumn: column,
            order: order,
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
      queryClient.invalidateQueries({queryKey: ["categories"]});
      queryClient.invalidateQueries({ queryKey: ["products", "category"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Succesfully updated category.");
    },
    onError: (error) => {
      toast.error("Error updating category.", {
        description: error?.response?.data?.errors?.[0]?.msg,
      });
    },
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/categories`,
        data
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]});
      queryClient.invalidateQueries({ queryKey: ["products", "category"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Succesfully created category.");
    },
    onError: (error) => {
      toast.error("Error creating a category.", {
        description: error?.response?.data?.errors?.[0]?.msg,
      });
    },
  });
};

export const useDeleteCategory = (name) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (category_id) => {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/categories/${category_id}`,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["categories"]});
      queryClient.invalidateQueries({ queryKey: ["products", "category"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Succesfully deleted category ${name}.`);
    },
    onError: (error) => {
      toast.error("Error deleting category.", {
        description: error?.response?.data?.errors?.[0]?.msg,
      });
    },
  });
};

import api from "@/api/axios";
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useProductsByCategoryId = (category_id) => {
  return useQuery({
    queryKey: ["products", "category", category_id],
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { data } = await api.get(
        `${import.meta.env.VITE_API_URL}/products/category/${category_id}`,
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
      const { data } = await api.get(
        `${import.meta.env.VITE_API_URL}/products/`,
        {
          params: {
            orderColumn: column,
            orderValue: order,
            page: pageParam,
            limit,
          },
        },
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
      const { data } = await api.get(
        `${import.meta.env.VITE_API_URL}/products/${productId}`,
      );
      return data;
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post(
        `${import.meta.env.VITE_API_URL}/products`,
        data,
      );
      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", "category"] });
      toast.success("Succesfully created product.");
    },
    onError: (error) => {
      toast.error("Error creating a product.", {
        description: error?.response?.data?.errors?.[0]?.msg,
      });
    },
  });
};

export const useDeleteProduct = (name) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product_id) => {
      await api.delete(
        `${import.meta.env.VITE_API_URL}/products/${product_id}`,
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["products", "category"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success(`Succesfully deleted product ${name}.`);
    },
    onError: (error) => {
      if (error.status == 401 || error.status == 403) {
        toast.error("Error deleting a product.", {
          description: "Please log in in order to delete a product.",
          duration: 4000
        });
      } else {
        toast.error("Error deleting a product.", {
          description: error?.response?.data?.errors?.[0]?.msg,
        });
      }
    },
  });
};

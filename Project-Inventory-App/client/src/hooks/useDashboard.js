import api from "@/api/axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";

export const useFetchUsers = () => {
  const query = useQuery({
    queryKey: ["dashboard", "users"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get(
        `${import.meta.env.VITE_API_URL}/admin/userlist`,
      );
      return data;
    },
  });

  useEffect(() => {
    const status = query.error?.response?.status;
    if (status === 401 || status === 403) {
      toast.error("Insufficient privileges.", {duration: 3000, description: "Log in with Admin privileges."});
    }
  }, [query.error]);
  return query;
};

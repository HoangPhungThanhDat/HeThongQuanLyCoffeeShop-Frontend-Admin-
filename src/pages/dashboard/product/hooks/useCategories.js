
import { useQuery } from "@tanstack/react-query";
import CategoryAPI from "@/api/categoryApi";
import { PRODUCT_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const categoryFilterKeys = {
  all: ["categories-for-product"],
  lists: () => [...categoryFilterKeys.all, "list"],
};

export function useCategories(options = {}) {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: categoryFilterKeys.lists(),
    queryFn: async () => {
      const response = await CategoryAPI.getAll();
      return response.data || [];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    onError: () => {
      toast.error(PRODUCT_MESSAGES.FETCH_CATEGORIES_ERROR);
    },
  });

  return {
    categories: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export default useCategories;
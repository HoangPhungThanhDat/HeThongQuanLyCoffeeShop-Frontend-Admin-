
import { useQuery } from "@tanstack/react-query";
import ProductAPI from "@/api/productApi";
import { PROMOTION_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const productKeys = {
  all: ["products"],
  lists: () => [...productKeys.all, "list"],
};

export function useProducts(options = {}) {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: productKeys.lists(),
    queryFn: async () => {
      const response = await ProductAPI.getAll();
      return response.data || [];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    onError: () => {
      toast.error(PROMOTION_MESSAGES.FETCH_PRODUCTS_ERROR);
    },
  });

  return {
    products: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}

export default useProducts;
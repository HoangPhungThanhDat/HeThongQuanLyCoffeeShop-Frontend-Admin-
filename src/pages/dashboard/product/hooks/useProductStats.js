import { useQuery } from "@tanstack/react-query";
import ProductAPI from "@/api/productApi";
import { productKeys } from "./useProducts";

export function useProductStats() {
  return useQuery({
    queryKey: [...productKeys.all, "stats"],
    queryFn: async () => {
      const res = await ProductAPI.getStats();
      const d = res.data;
      return {
        totalProducts: Number(d.total ?? 0),
        activeProducts: Number(d.active ?? 0),
        inactiveProducts: Number(d.inactive ?? 0),
        lowStockProducts: Number(d.lowStock ?? 0),
      };
    },
    staleTime: 60 * 1000, // 1 phút
  });
}

export default useProductStats;
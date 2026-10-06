import { useQuery } from "@tanstack/react-query";
import OrderItemAPI from "@/api/orderitemApi";
import { orderItemKeys } from "./useOrderItems";

/**
 * Stats toàn bộ order items (không phân trang).
 * BE trả: { total, totalQuantity, totalRevenue, avgPrice }
 *
 * ⚠️ Giữ tên field cũ (totalItems, totalQuantity, totalRevenue) để không phải sửa OrderItemsStats.jsx.
 * Field `uniqueOrders` không có trong BE → set = 0.
 */
export function useOrderItemStats() {
  return useQuery({
    queryKey: orderItemKeys.stats(),
    queryFn: async () => {
      const res = await OrderItemAPI.getStats();
      const d = res.data;
      return {
        totalItems: Number(d.total ?? 0),
        totalQuantity: Number(d.totalQuantity ?? 0),
        totalRevenue: Number(d.totalRevenue ?? 0),
        uniqueOrders: 0, // BE không trả field này
      };
    },
    staleTime: 60 * 1000,
  });
}

export default useOrderItemStats;
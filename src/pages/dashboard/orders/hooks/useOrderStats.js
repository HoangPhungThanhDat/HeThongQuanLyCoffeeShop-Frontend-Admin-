import { useQuery } from "@tanstack/react-query";
import OrderAPI from "@/api/orderApi";
import { orderKeys } from "./useOrders";

/**
 * Hook lấy thống kê đơn hàng TOÀN BỘ (không phân trang).
 * BE trả: { total, pending, paid, cancelled, totalRevenue }
 *
 * ⚠️ Field trả về phải khớp với JPQL getOrderStats() ở BE.
 * Nếu BE dùng CONFIRMED/COMPLETED thay vì PAID → sửa map tương ứng.
 */
export function useOrderStats() {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: async () => {
      const res = await OrderAPI.getStats();
      const d = res.data;
      return {
        totalOrders: Number(d.total ?? 0),
        pendingOrders: Number(d.pending ?? 0),
        paidOrders: Number(d.paid ?? 0),
        cancelledOrders: Number(d.cancelled ?? 0),
        totalRevenue: Number(d.totalRevenue ?? 0),
      };
    },
    staleTime: 60 * 1000, // cache 1 phút
  });
}

export default useOrderStats;
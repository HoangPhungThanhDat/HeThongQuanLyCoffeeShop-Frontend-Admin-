import { useQuery } from "@tanstack/react-query";
import BillApi from "@/api/billApi";
import { billKeys } from "./useBills";

/**
 * Stats toàn bộ bills (không phân trang).
 *
 * ⚠️ Giữ tên field khớp với `BillStats.jsx` cũ:
 * - totalBills, completedBills, pendingBills, failedBills, totalRevenue
 *
 * BE trả: { total, paidCount, pendingCount, cancelledCount, totalRevenue }
 *
 * Mapping:
 * - BE "paidCount"      → FE "completedBills"  (PAID = COMPLETED)
 * - BE "cancelledCount" → FE "failedBills"     (CANCELLED ~ FAILED)
 */
export function useBillStats() {
  return useQuery({
    queryKey: billKeys.stats(),
    queryFn: async () => {
      const res = await BillApi.getStats();
      const d = res.data;
      return {
        totalBills: Number(d.total ?? 0),
        completedBills: Number(d.paidCount ?? 0),
        pendingBills: Number(d.pendingCount ?? 0),
        failedBills: Number(d.cancelledCount ?? 0),
        totalRevenue: Number(d.totalRevenue ?? 0),
      };
    },
    staleTime: 60 * 1000,
  });
}

export default useBillStats;
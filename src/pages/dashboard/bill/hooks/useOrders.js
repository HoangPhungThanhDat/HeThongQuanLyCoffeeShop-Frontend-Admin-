// src/pages/dashboard/bill/hooks/useOrders.js
import { useQuery } from "@tanstack/react-query";
import OrderAPI from "@/api/orderApi";
import { BILL_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const orderKeys = {
  all: ["orders"],
  lists: () => [...orderKeys.all, "list"],
  // ⭐ Thêm key riêng cho dropdown bill (tránh đụng với orders page)
  forBillSelect: () => [...orderKeys.all, "for-bill-select"],
};

export function useOrders(options = {}) {
  const { enabled = true } = options;

  const query = useQuery({
    queryKey: orderKeys.forBillSelect(),
    queryFn: async () => {
      // ⭐ SỬA: dùng getAllForSelect hoặc getAll với size lớn
      const response = await OrderAPI.getAll({ size: 1000 });

      // ⭐ SỬA: đọc .content từ PageResponse — LUÔN trả mảng
      const data = response.data?.content ?? response.data ?? [];

      // Đảm bảo là mảng
      return Array.isArray(data) ? data : [];
    },
    enabled,
    staleTime: 5 * 60 * 1000, // Orders ít thay đổi
    // ⚠️ React Query v5 KHÔNG dùng onError nữa
  });

  // Xử lý lỗi bằng useEffect (React Query v5)
  // Nếu bạn dùng v4 → giữ onError trong useQuery

  return {
    orders: Array.isArray(query.data) ? query.data : [], // ⭐ luôn là mảng
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useOrders;
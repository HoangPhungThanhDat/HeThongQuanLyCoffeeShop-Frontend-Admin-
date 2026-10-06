// src/pages/dashboard/category/hooks/useCategoryDetail.js
import { useQuery } from "@tanstack/react-query";
import CategoryAPI from "@/api/categoryApi";
import { CATEGORY_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";
import { categoryKeys } from "./useCategories";

/**
 * Hook lấy chi tiết 1 category theo id
 * @param {number|null} id
 * @param {object} options - { initialData, enabled }
 */
export function useCategoryDetail(id, options = {}) {
  const { initialData = null, enabled = true } = options;

  const query = useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: async () => {
      const response = await CategoryAPI.getById(id);
      return response.data;
    },
    enabled: enabled && Boolean(id),
    initialData: initialData || undefined,
    onError: () => {
      toast.error(CATEGORY_MESSAGES.FETCH_DETAIL_ERROR);
    },
  });

  return {
    category: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useCategoryDetail;
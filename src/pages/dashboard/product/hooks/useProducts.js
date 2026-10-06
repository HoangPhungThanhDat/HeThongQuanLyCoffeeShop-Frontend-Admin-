import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import ProductAPI from "@/api/productApi";
import { PRODUCT_MESSAGES } from "../constants/messages";
import { isLowStock } from "../constants/stockConfig";
import { toast } from "@/lib/toast";

export const productKeys = {
  all: ["products"],
  lists: () => [...productKeys.all, "list"],
  list: (filters) => [...productKeys.lists(), filters],
  details: () => [...productKeys.all, "detail"],
  detail: (id) => [...productKeys.details(), id],
};

const DEFAULT_PAGE_SIZE = 10;

export function useProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [page, setPage] = useState(0); // 0-based, khớp backend
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  // ⚡ Debounce search 400ms — tránh gọi API mỗi ký tự
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Reset trang về 0 khi filter thay đổi
  useEffect(() => {
    setPage(0);
  }, [debouncedKeyword, selectedCategory, sortBy, sortDir]);

  // Params gửi lên BE
  const params = useMemo(
    () => ({
      page,
      size,
      keyword: debouncedKeyword || undefined,
      categoryId: selectedCategory !== "ALL" ? selectedCategory : undefined,
      sortBy,
      sortDir,
    }),
    [page, size, debouncedKeyword, selectedCategory, sortBy, sortDir]
  );

  const query = useQuery({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      const response = await ProductAPI.getAll(params);
      return response.data; // PageResponse: { content, page, size, totalElements, totalPages, ... }
    },
    placeholderData: keepPreviousData, // giữ data trang cũ khi fetch trang mới
    staleTime: 30 * 1000,
  });

  const pageData = query.data;
  const products = pageData?.content ?? [];

  // ============ STATS ============
  // Lưu ý: stats dựa trên TRANG HIỆN TẠI (chỉ 10 SP), không phải toàn bộ.
  // Nếu cần stats toàn bộ → BE phải có endpoint riêng /products/stats.
  const stats = useMemo(() => {
    const totalProducts = pageData?.totalElements ?? 0;
    const activeProducts = products.filter((p) => p.isActive).length;
    const lowStockProducts = products.filter((p) =>
      isLowStock(p.stockQuantity)
    ).length;
    const inactiveProducts = products.filter((p) => !p.isActive).length;

    return {
      totalProducts, // tổng toàn bộ (từ BE)
      activeProducts, // chỉ tính trên trang hiện tại
      lowStockProducts,
      inactiveProducts,
    };
  }, [products, pageData?.totalElements]);

  // ============ HELPERS ============
  const toggleCategoryFilter = (categoryId) => {
    setSelectedCategory((prev) => (prev === categoryId ? "ALL" : categoryId));
  };

  const clearFilters = () => {
    setSelectedCategory("ALL");
    setSearchTerm("");
    setPage(0);
  };

  const hasActiveFilters =
    selectedCategory !== "ALL" || searchTerm.trim() !== "";

  return {
    // Data
    products, // 10 SP của trang hiện tại
    stats,

    // Pagination
    page: pageData?.page ?? 0,
    size: pageData?.size ?? size,
    totalPages: pageData?.totalPages ?? 0,
    totalElements: pageData?.totalElements ?? 0,
    hasNext: pageData?.hasNext ?? false,
    hasPrevious: pageData?.hasPrevious ?? false,
    setPage,
    setSize,
    sortBy,
    sortDir,
    setSortBy,
    setSortDir,

    // Filter state
    searchTerm,
    selectedCategory,
    hasActiveFilters,

    // Filter actions
    setSearchTerm,
    setSelectedCategory,
    toggleCategoryFilter,
    clearFilters,

    // Query state
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    // Actions
    refetch: query.refetch,
  };
}

export default useProducts;
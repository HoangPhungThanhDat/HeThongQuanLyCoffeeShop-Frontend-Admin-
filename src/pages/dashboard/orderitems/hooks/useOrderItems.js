import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import OrderItemAPI from "@/api/orderitemApi";
import { ORDER_ITEM_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const orderItemKeys = {
  all: ["order-items"],
  lists: () => [...orderItemKeys.all, "list"],
  list: (filters) => [...orderItemKeys.lists(), filters],
  details: () => [...orderItemKeys.all, "detail"],
  detail: (id) => [...orderItemKeys.details(), id],
  stats: () => [...orderItemKeys.all, "stats"],   // ⭐ THÊM
};

const DEFAULT_PAGE_SIZE = 10;

export function useOrderItems() {
  const [searchTerm, setSearchTermRaw] = useState("");
  const [orderId, setOrderIdRaw] = useState("ALL");
  const [productId, setProductIdRaw] = useState("ALL");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  // ⚡ Debounce search 400ms
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // ⭐ KHÔNG dùng useEffect reset page — reset trong handler

  const params = useMemo(
    () => ({
      page,
      size,
      keyword: debouncedKeyword || undefined,
      orderId: orderId !== "ALL" ? orderId : undefined,
      productId: productId !== "ALL" ? productId : undefined,
      sortBy,
      sortDir,
    }),
    [page, size, debouncedKeyword, orderId, productId, sortBy, sortDir]
  );

  const query = useQuery({
    queryKey: orderItemKeys.list(params),
    queryFn: async () => {
      const response = await OrderItemAPI.getAll(params);
      return response.data; // PageResponse: { content, page, size, totalElements, totalPages, ... }
    },
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000,
  });

  const pageData = query.data;
  const orderItems = pageData?.content ?? [];

  // Xử lý lỗi
  useEffect(() => {
    if (query.isError) {
      toast.error(ORDER_ITEM_MESSAGES?.FETCH_ERROR || "Không tải được order items");
    }
  }, [query.isError]);

  // ⚡ Tự lùi trang khi trang cuối bị xoá hết
  useEffect(() => {
    if (
      !query.isLoading &&
      !query.isFetching &&
      pageData &&
      pageData.content?.length === 0 &&
      page > 0
    ) {
      setPage((p) => p - 1);
    }
  }, [pageData, page, query.isLoading, query.isFetching]);

  // ============ HANDLERS — RESET PAGE TRỰC TIẾP ============
  const setSearchTerm = useCallback((v) => {
    setSearchTermRaw(v);
    setPage(0);
  }, []);

  const setOrderId = useCallback((v) => {
    setOrderIdRaw(v);
    setPage(0);
  }, []);

  const setProductId = useCallback((v) => {
    setProductIdRaw(v);
    setPage(0);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTermRaw("");
    setOrderIdRaw("ALL");
    setProductIdRaw("ALL");
    setPage(0);
  }, []);

  const hasActiveFilters =
    searchTerm.trim() !== "" || orderId !== "ALL" || productId !== "ALL";

  return {
    // Data — 10 items của trang hiện tại
    orderItems,

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

    // Filter
    searchTerm,
    orderId,
    productId,
    hasActiveFilters,
    setSearchTerm,
    setOrderId,
    setProductId,
    clearFilters,

    // Query state
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

export default useOrderItems;
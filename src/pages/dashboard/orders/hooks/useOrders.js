// src/pages/dashboard/orders/hooks/useOrders.js
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState, useEffect, useMemo, useCallback } from "react";
import OrderAPI from "@/api/orderApi";
import { ORDER_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const orderKeys = {
  all: ["orders"],
  lists: () => [...orderKeys.all, "list"],
  list: (filters) => [...orderKeys.lists(), filters],
  details: () => [...orderKeys.all, "detail"],
  detail: (id) => [...orderKeys.details(), id],
  stats: () => [...orderKeys.all, "stats"],
};

const DEFAULT_PAGE_SIZE = 10;

export function useOrders() {
  const [searchTerm, setSearchTermRaw] = useState("");
  const [selectedStatus, setSelectedStatusRaw] = useState("ALL");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  // ⚡ Debounce search 400ms — tránh gọi API mỗi ký tự
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedKeyword(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // ⭐ KHÔNG có useEffect reset page ở đây — tránh bug
  // → Reset page trực tiếp trong các handler setter bên dưới

  // Params gửi lên BE
  const params = useMemo(
    () => ({
      page,
      size,
      keyword: debouncedKeyword || undefined,
      status: selectedStatus !== "ALL" ? selectedStatus : undefined,
      sortBy,
      sortDir,
    }),
    [page, size, debouncedKeyword, selectedStatus, sortBy, sortDir]
  );

  const query = useQuery({
    queryKey: orderKeys.list(params),
    queryFn: async () => {
      const response = await OrderAPI.getAll(params);
      return response.data; // PageResponse: { content, page, size, totalElements, totalPages, ... }
    },
    placeholderData: keepPreviousData, // giữ data trang cũ khi fetch trang mới
    staleTime: 30 * 1000,
  });

  const pageData = query.data;
  const orders = pageData?.content ?? [];

  // Xử lý lỗi (React Query v5 — không dùng onError trong useQuery)
  useEffect(() => {
    if (query.isError) {
      toast.error(ORDER_MESSAGES?.FETCH_ERROR || "Không tải được đơn hàng");
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
  // ⭐ Reset page ngay trong handler thay vì dùng useEffect
  // → Tránh bug effect chạy sai thời điểm

  const setSearchTerm = useCallback((value) => {
    setSearchTermRaw(value);
    setPage(0); // reset khi gõ search
  }, []);

  const setSelectedStatus = useCallback((value) => {
    setSelectedStatusRaw(value);
    setPage(0); // reset khi đổi status
  }, []);

  const toggleStatusFilter = useCallback((status) => {
    setSelectedStatusRaw((prev) => (prev === status ? "ALL" : status));
    setPage(0); // reset khi toggle status
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedStatusRaw("ALL");
    setSearchTermRaw("");
    setPage(0);
  }, []);

  const hasActiveFilters =
    selectedStatus !== "ALL" || searchTerm.trim() !== "";

  return {
    // Data — 10 đơn của trang hiện tại
    orders,

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
    selectedStatus,
    hasActiveFilters,

    // Filter actions — dùng handler đã wrap useCallback
    setSearchTerm,
    setSelectedStatus,
    toggleStatusFilter,
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

export default useOrders;
// src/pages/dashboard/category/hooks/useCategories.js
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import CategoryAPI from "@/api/categoryApi";
import { CATEGORY_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const categoryKeys = {
  all: ["categories"],
  lists: () => [...categoryKeys.all, "list"],
  list: (filters) => [...categoryKeys.lists(), filters],
  details: () => [...categoryKeys.all, "detail"],
  detail: (id) => [...categoryKeys.details(), id],
};

/**
 * Hook lấy danh sách categories + search + stats
 */
export function useCategories() {
  const [searchTerm, setSearchTerm] = useState("");

  const query = useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: async () => {
      const response = await CategoryAPI.getAll();
      return [...response.data].sort((a, b) => {
        if (typeof a.id === "number" && typeof b.id === "number")
          return b.id - a.id;
        return 0;
      });
    },
    onError: () => {
      toast.error(CATEGORY_MESSAGES.FETCH_ERROR);
    },
  });

  const categories = query.data || [];

  // Filter theo search
  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) return categories;
    const term = searchTerm.toLowerCase();
    return categories.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.description?.toLowerCase().includes(term)
    );
  }, [searchTerm, categories]);

  // Stats
  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const withDescription = categories.filter(
      (c) => c.description && c.description.trim() !== ""
    ).length;
    const withoutDescription = totalCategories - withDescription;
    const hasProducts = categories.filter(
      (c) => c.products && c.products.length > 0
    ).length;

    return {
      totalCategories,
      withDescription,
      withoutDescription,
      hasProducts,
    };
  }, [categories]);

  return {
    // Data
    categories,
    filteredCategories,
    stats,

    // State
    searchTerm,
    setSearchTerm,

    // Query state
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,

    // Actions
    refetch: query.refetch,
  };
}

export default useCategories;
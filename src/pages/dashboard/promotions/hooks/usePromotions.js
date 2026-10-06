
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import PROMOTIONSAPI from "@/api/promotionApi";
import { PROMOTION_MESSAGES } from "../constants/messages";
import { isPromotionRunning } from "../utils/formatters";
import { toast } from "@/lib/toast";

export const promotionKeys = {
  all: ["promotions"],
  lists: () => [...promotionKeys.all, "list"],
  list: (filters) => [...promotionKeys.lists(), filters],
  details: () => [...promotionKeys.all, "detail"],
  detail: (id) => [...promotionKeys.details(), id],
};

export function usePromotions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const query = useQuery({
    queryKey: promotionKeys.lists(),
    queryFn: async () => {
      const response = await PROMOTIONSAPI.getAll();
      return [...response.data].sort((a, b) => b.id - a.id);
    },
    onError: () => {
      toast.error(PROMOTION_MESSAGES.FETCH_ERROR);
    },
  });

  const promotions = query.data || [];

  // ============ FILTER ============
  const filteredPromotions = useMemo(() => {
    let result = [...promotions];

    if (selectedStatus !== "ALL") {
      result = result.filter((p) =>
        selectedStatus === "ACTIVE" ? p.isActive : !p.isActive
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.id?.toString().includes(term)
      );
    }

    return result;
  }, [promotions, searchTerm, selectedStatus]);

  // ============ STATS ============
  const stats = useMemo(() => {
    const totalPromotions = promotions.length;
    const activePromotions = promotions.filter((p) => p.isActive).length;
    const inactivePromotions = promotions.filter((p) => !p.isActive).length;
    const runningPromotions = promotions.filter(isPromotionRunning).length;

    return {
      totalPromotions,
      activePromotions,
      inactivePromotions,
      runningPromotions,
    };
  }, [promotions]);

  // ============ HELPERS ============
  const toggleStatusFilter = (status) => {
    setSelectedStatus((prev) => (prev === status ? "ALL" : status));
  };

  const clearFilters = () => {
    setSelectedStatus("ALL");
    setSearchTerm("");
  };

  const hasActiveFilters =
    selectedStatus !== "ALL" || searchTerm.trim() !== "";

  return {
    // Data
    promotions,
    filteredPromotions,
    stats,

    // Filter state
    searchTerm,
    selectedStatus,
    hasActiveFilters,

    // Filter actions
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

export default usePromotions;
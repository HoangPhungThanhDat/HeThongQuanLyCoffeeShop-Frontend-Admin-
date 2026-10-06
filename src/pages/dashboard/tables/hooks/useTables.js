
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import TableAPI from "@/api/tableApi";
import { TABLE_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const tableKeys = {
  all: ["tables"],
  lists: () => [...tableKeys.all, "list"],
  list: (filters) => [...tableKeys.lists(), filters],
  details: () => [...tableKeys.all, "detail"],
  detail: (id) => [...tableKeys.details(), id],
};

export function useTables() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  const query = useQuery({
    queryKey: tableKeys.lists(),
    queryFn: async () => {
      const response = await TableAPI.getAll();
      return [...response.data].sort((a, b) => {
        if (typeof a.id === "number" && typeof b.id === "number")
          return b.id - a.id;
        return 0;
      });
    },
    onError: () => {
      toast.error(TABLE_MESSAGES.FETCH_ERROR);
    },
  });

  const tables = query.data || [];

  // ============ FILTER ============
  const filteredTables = useMemo(() => {
    let result = [...tables];

    if (selectedStatus !== "ALL") {
      result = result.filter((t) => t.status === selectedStatus);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (t) =>
          t.number?.toLowerCase().includes(term) ||
          t.capacity?.toString().includes(term)
      );
    }

    return result;
  }, [tables, searchTerm, selectedStatus]);

  // ============ STATS ============
  const stats = useMemo(() => {
    const totalTables = tables.length;
    const freeTables = tables.filter((t) => t.status === "FREE").length;
    const occupiedTables = tables.filter((t) => t.status === "OCCUPIED").length;
    const reservedTables = tables.filter((t) => t.status === "RESERVED").length;

    return { totalTables, freeTables, occupiedTables, reservedTables };
  }, [tables]);

  // ============ FILTER HELPERS ============
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
    tables,
    filteredTables,
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

export default useTables;
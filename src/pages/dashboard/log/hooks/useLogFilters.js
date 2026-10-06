
import { useState, useEffect } from "react";

/**
 * Quản lý state filter + search debounce
 * @param {Function} onFilterChange - callback khi filter/search thay đổi
 */
export const useLogFilters = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [timeFilter, setTimeFilter] = useState("ALL");

  // Debounce search 500ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  /**
   * Build params cho API
   */
  const buildParams = (page, pageSize) => {
    const params = { page, size: pageSize };
    if (actionFilter !== "ALL") params.action = actionFilter;
    if (levelFilter !== "ALL") params.level = levelFilter;
    if (timeFilter !== "ALL") params.timeRange = timeFilter;
    if (debouncedSearch.trim()) params.keyword = debouncedSearch.trim();
    return params;
  };

  /**
   * Reset filters về mặc định
   */
  const resetFilters = () => {
    setSearchTerm("");
    setDebouncedSearch("");
    setActionFilter("ALL");
    setLevelFilter("ALL");
    setTimeFilter("ALL");
  };

  return {
    // states
    searchTerm, setSearchTerm,
    debouncedSearch,
    actionFilter, setActionFilter,
    levelFilter, setLevelFilter,
    timeFilter, setTimeFilter,
    // utils
    buildParams,
    resetFilters,
  };
};
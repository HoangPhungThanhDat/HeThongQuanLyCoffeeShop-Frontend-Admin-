
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import UserAPI from "@/api/userApi";
import { USER_MESSAGES } from "../constants/messages";
import { toast } from "@/lib/toast";

export const userKeys = {
  all: ["users"],
  lists: () => [...userKeys.all, "list"],
  list: (filters) => [...userKeys.lists(), filters],
  details: () => [...userKeys.all, "detail"],
  detail: (id) => [...userKeys.details(), id],
};

export function useUsers() {
  const [searchTerm, setSearchTerm] = useState("");

  const query = useQuery({
    queryKey: userKeys.lists(),
    queryFn: async () => {
      const response = await UserAPI.getAll();
      return [...response.data].sort((a, b) => {
        if (typeof a.id === "number" && typeof b.id === "number")
          return b.id - a.id;
        return 0;
      });
    },
    onError: () => {
      toast.error(USER_MESSAGES.FETCH_ERROR);
    },
  });

  const users = query.data || [];

  // ============ SEARCH FILTER ============
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.username?.toLowerCase().includes(term) ||
        u.fullName?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term)
    );
  }, [searchTerm, users]);

  // ============ STATS ============
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.isActive).length;
    const inactiveUsers = users.filter((u) => !u.isActive).length;
    const adminUsers = users.filter(
      (u) => u.role?.toUpperCase() === "ADMIN"
    ).length;

    return { totalUsers, activeUsers, inactiveUsers, adminUsers };
  }, [users]);

  return {
    // Data
    users,
    filteredUsers,
    stats,

    // State
    searchTerm,

    // Actions
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

export default useUsers;
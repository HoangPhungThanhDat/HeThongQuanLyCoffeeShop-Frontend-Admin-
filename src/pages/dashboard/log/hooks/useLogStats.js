
import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import logApi from "@/api/logApi";
import { LEVEL_CONFIG } from "../constants";

/**
 * Hook quản lý stats + charts
 */
export const useLogStats = () => {
  const [stats, setStats] = useState({
    total: 0, today: 0, success: 0, info: 0,
    warnings: 0, errors: 0, uniqueUsers: 0,
  });
  const [dailyActivity, setDailyActivity] = useState([]);
  const [levelDistribution, setLevelDistribution] = useState([]);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false);

  const fetchStats = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsAutoRefreshing(true);

      const [statsRes, dailyRes, levelRes] = await Promise.allSettled([
        logApi.getStats(),
        logApi.getDailyChart(7),
        logApi.getLevelDistribution(),
      ]);

      // STATS
      if (statsRes.status === "fulfilled" && statsRes.value) {
        const val = statsRes.value?.data ?? statsRes.value;
        setStats({
          total: val.total ?? 0,
          today: val.today ?? 0,
          success: val.success ?? 0,
          info: val.info ?? 0,
          warnings: val.warnings ?? 0,
          errors: val.errors ?? 0,
          uniqueUsers: val.uniqueUsers ?? 0,
        });
      }

      // DAILY
      if (dailyRes.status === "fulfilled") {
        const val = dailyRes.value?.data ?? dailyRes.value;
        if (Array.isArray(val)) {
          setDailyActivity(
            val.map((d) => ({
              day: d.day ? dayjs(d.day).format("DD/MM") : "?",
              total: d.total ?? 0,
              errors: d.errors ?? 0,
            }))
          );
        }
      }

      // LEVEL
      if (levelRes.status === "fulfilled") {
        const val = levelRes.value?.data ?? levelRes.value;
        if (Array.isArray(val)) {
          setLevelDistribution(
            val.map((d) => ({
              name: LEVEL_CONFIG[d.name]?.label || d.name,
              value: d.value ?? 0,
              color: LEVEL_CONFIG[d.name]?.color || "#6b7280",
            }))
          );
        }
      }

      setLastRefreshed(new Date());
    } catch (error) {
      console.error("❌ Fetch stats error:", error);
    } finally {
      setIsAutoRefreshing(false);
    }
  }, []);

  return {
    stats,
    dailyActivity,
    levelDistribution,
    lastRefreshed,
    isAutoRefreshing,
    refetchStats: fetchStats,
  };
};
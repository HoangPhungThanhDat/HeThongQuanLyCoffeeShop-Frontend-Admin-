
import { useState, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import OrderAPI from "@/api/orderApi";
import Swal from "sweetalert2";
import { STATUS_CONFIG } from "../constants";
import { toArray } from "../utils";

export const useOrderReport = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [timeRange, setTimeRange] = useState("month");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  // ==================== FETCH ====================
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await OrderAPI.getAll({ size: 10000 });
        if (!isMounted) return;
        setOrders(toArray(res));
      } catch (error) {
        if (!isMounted) return;
        console.error("Lỗi tải dữ liệu:", error);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Không thể tải dữ liệu!",
          showConfirmButton: false,
          timer: 2500,
        });
      } finally {
        if (isMounted) {
          setTimeout(() => setLoading(false), 1200);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  // ==================== FILTER ====================
  const filteredOrders = useMemo(() => {
    const now = dayjs();
    let result = [...orders];

    switch (timeRange) {
      case "today":
        result = result.filter(
          (o) => dayjs(o.createdAt).format("YYYY-MM-DD") === now.format("YYYY-MM-DD")
        );
        break;
      case "week":
        result = result.filter((o) => dayjs(o.createdAt).isAfter(now.startOf("week")));
        break;
      case "month":
        result = result.filter((o) => dayjs(o.createdAt).isAfter(now.startOf("month")));
        break;
      case "year":
        result = result.filter((o) => dayjs(o.createdAt).year() === now.year());
        break;
      default:
        break;
    }

    if (statusFilter !== "ALL") {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (o) =>
          o.id?.toString().includes(term) ||
          o.table?.number?.toLowerCase().includes(term)
      );
    }

    return result;
  }, [orders, timeRange, statusFilter, searchTerm]);

  // ==================== STATS ====================
  const stats = useMemo(() => {
    const total = orders.length;
    const filtered = filteredOrders.length;

    const totalRevenue = filteredOrders.reduce(
      (s, o) => s + (o.totalAmount || 0),
      0
    );

    const statusCounts = {};
    Object.keys(STATUS_CONFIG).forEach((key) => {
      statusCounts[key] = orders.filter((o) => o.status === key).length;
    });

    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    const todayOrders = orders.filter(
      (o) => dayjs(o.createdAt).format("YYYY-MM-DD") === today
    ).length;
    const yesterdayOrders = orders.filter(
      (o) => dayjs(o.createdAt).format("YYYY-MM-DD") === yesterday
    ).length;

    const growth =
      yesterdayOrders > 0
        ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100
        : 0;

    const completedRate = total > 0 ? (statusCounts.PAID / total) * 100 : 0;
    const cancelledRate = total > 0 ? (statusCounts.CANCELLED / total) * 100 : 0;
    const avgValue = filtered > 0 ? totalRevenue / filtered : 0;

    return {
      total,
      filtered,
      totalRevenue,
      avgValue,
      statusCounts,
      todayOrders,
      yesterdayOrders,
      growth,
      completedRate,
      cancelledRate,
    };
  }, [orders, filteredOrders]);

  // ==================== CHART DATA ====================
  const dailyOrders = useMemo(() => {
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const date = dayjs().subtract(i, "day");
      const dateStr = date.format("YYYY-MM-DD");
      const dayOrders = orders.filter(
        (o) => dayjs(o.createdAt).format("YYYY-MM-DD") === dateStr
      );
      const completed = dayOrders.filter((o) => o.status === "PAID").length;
      const cancelled = dayOrders.filter((o) => o.status === "CANCELLED").length;

      result.push({
        date: date.format("DD/MM"),
        fullDate: dateStr,
        total: dayOrders.length,
        completed,
        cancelled,
        revenue: dayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0),
      });
    }
    return result;
  }, [orders]);

  const monthlyOrders = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const currentYear = dayjs().year();
      const monthOrders = orders.filter(
        (o) =>
          dayjs(o.createdAt).year() === currentYear &&
          dayjs(o.createdAt).month() + 1 === month
      );

      return {
        month: `T${month}`,
        total: monthOrders.length,
        completed: monthOrders.filter((o) => o.status === "PAID").length,
        cancelled: monthOrders.filter((o) => o.status === "CANCELLED").length,
      };
    });
  }, [orders]);

  const statusPieData = useMemo(() => {
    return Object.entries(stats.statusCounts)
      .filter(([_, count]) => count > 0)
      .map(([status, count]) => ({
        name: STATUS_CONFIG[status]?.label || status,
        value: count,
        status,
      }));
  }, [stats.statusCounts]);

  const hourlyOrders = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const count = filteredOrders.filter(
        (o) => dayjs(o.createdAt).hour() === i
      ).length;
      return { hour: `${i}h`, orders: count };
    });
  }, [filteredOrders]);

  const weekdayData = useMemo(() => {
    const weekdays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    return weekdays.map((day, i) => {
      const dayIndex = i === 6 ? 0 : i + 1;
      const count = filteredOrders.filter(
        (o) => dayjs(o.createdAt).day() === dayIndex
      ).length;
      return { weekday: day, orders: count };
    });
  }, [filteredOrders]);

  return {
    loading,
    orders,
    filteredOrders,
    timeRange, setTimeRange,
    statusFilter, setStatusFilter,
    searchTerm, setSearchTerm,
    stats,
    dailyOrders,
    monthlyOrders,
    statusPieData,
    hourlyOrders,
    weekdayData,
  };
};
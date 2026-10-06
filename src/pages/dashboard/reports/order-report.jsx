import { useState, useEffect, useMemo } from "react";
import {
  Card,
  Typography,
  Button,
  Chip,
} from "@material-tailwind/react";
import {
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  SparklesIcon,
  CurrencyDollarIcon,
  FunnelIcon,
  FireIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  ChartBarIcon,
  DocumentArrowDownIcon,
  MagnifyingGlassIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
} from "recharts";
import OrderAPI from "@/api/orderApi";
import { CoffeeLoader } from "@/widgets/loaders";
import Swal from "sweetalert2";

// Status config đồng bộ hệ thống
const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ xác nhận",
    icon: ClockIcon,
    color: "#f59e0b",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    icon: CheckCircleIcon,
    color: "#3b82f6",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  PREPARING: {
    label: "Đang chuẩn bị",
    icon: FireIcon,
    color: "#f97316",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
  },
  SERVED: {
    label: "Đã phục vụ",
    icon: ClipboardDocumentListIcon,
    color: "#8b5cf6",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  PAID: {
    label: "Đã thanh toán",
    icon: CurrencyDollarIcon,
    color: "#22c55e",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: XCircleIcon,
    color: "#ef4444",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
  },
};

const PIE_COLORS = ["#f59e0b", "#3b82f6", "#f97316", "#8b5cf6", "#22c55e", "#ef4444"];

/**
 * Helper: luôn trả về mảng, dù BE trả PageResponse, mảng, hay null
 */
const toArray = (res) => {
  const data = res?.data?.content ?? res?.data ?? res;
  return Array.isArray(data) ? data : [];
};

export function OrderReport() {
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
        // ⭐ SỬA: thêm size lớn để lấy tất cả cho báo cáo
        const res = await OrderAPI.getAll({ size: 10000 });

        if (!isMounted) return;

        // ⭐ SỬA: đọc .content từ PageResponse
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

  // ==================== FILTER DATA ====================
  const filteredOrders = useMemo(() => {
    const now = dayjs();
    let result = [...orders];

    // Filter theo thời gian
    switch (timeRange) {
      case "today":
        result = result.filter(
          (o) => dayjs(o.createdAt).format("YYYY-MM-DD") === now.format("YYYY-MM-DD")
        );
        break;
      case "week":
        result = result.filter((o) =>
          dayjs(o.createdAt).isAfter(now.startOf("week"))
        );
        break;
      case "month":
        result = result.filter((o) =>
          dayjs(o.createdAt).isAfter(now.startOf("month"))
        );
        break;
      case "year":
        result = result.filter(
          (o) => dayjs(o.createdAt).year() === now.year()
        );
        break;
      default:
        break;
    }

    // Filter theo status
    if (statusFilter !== "ALL") {
      result = result.filter((o) => o.status === statusFilter);
    }

    // Filter theo search
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

    // Đơn hàng hôm nay vs hôm qua
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

  // ==================== FORMAT ====================
  const formatPrice = (v) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(v || 0);

  const formatCompact = (v) => {
    if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
    return v.toString();
  };

  // ==================== EXPORT CSV ====================
  const handleExport = () => {
    const csvData = [
      ["Mã ĐH", "Ngày tạo", "Trạng thái", "Bàn", "Tổng tiền"],
      ...filteredOrders.map((o) => [
        o.id,
        dayjs(o.createdAt).format("DD/MM/YYYY HH:mm"),
        STATUS_CONFIG[o.status]?.label || o.status,
        o.table?.number || "N/A",
        o.totalAmount || 0,
      ]),
    ];
    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-don-hang-${dayjs().format("YYYY-MM-DD")}.csv`;
    link.click();

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Đã xuất báo cáo!",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // ==================== LOADER ====================
  if (loading) {
    return (
      <CoffeeLoader
        title="Đang pha chế báo cáo đơn hàng"
        subtitle="Vui lòng chờ trong giây lát"
      />
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6">

        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg shadow-[#8B5E3C]/30 flex-shrink-0"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ClipboardDocumentListIcon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <Typography
                variant="h4"
                className="font-extrabold text-[#4e342e] tracking-tight text-2xl lg:text-3xl"
              >
                Báo Cáo Đơn Hàng
              </Typography>
              <Typography className="text-xs lg:text-sm text-[#8B5E3C] font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Phân tích chi tiết đơn hàng và trạng thái xử lý
              </Typography>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outlined"
              className="flex items-center gap-2 border-2 border-[#8B5E3C]/40 text-[#6d4c41] hover:bg-[#faf6f1] hover:border-[#8B5E3C] rounded-xl normal-case font-bold px-4 py-2.5"
              onClick={() => window.location.reload()}
            >
              <ArrowPathIcon className="h-4 w-4" strokeWidth={2.5} />
              Làm mới
            </Button>
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] shadow-lg shadow-[#8B5E3C]/30 rounded-xl normal-case font-bold px-5 py-2.5 flex-1 md:flex-none"
              onClick={handleExport}
            >
              <DocumentArrowDownIcon className="h-4 w-4" strokeWidth={2.5} />
              Xuất báo cáo
            </Button>
          </div>
        </motion.div>

        {/* ===== FILTER BAR ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-white border border-amber-100 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-[#8B5E3C]" />
            <Typography className="text-[11px] font-extrabold uppercase tracking-widest text-[#6d4c41]">
              Thời gian:
            </Typography>
          </div>
          {[
            { key: "today", label: "Hôm nay" },
            { key: "week", label: "Tuần" },
            { key: "month", label: "Tháng" },
            { key: "year", label: "Năm" },
            { key: "all", label: "Tất cả" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setTimeRange(opt.key)}
              className={`px-3.5 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider transition-all duration-200 ${
                timeRange === opt.key
                  ? "bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] text-white shadow-lg shadow-[#8B5E3C]/30"
                  : "bg-[#faf6f1] text-[#6d4c41] border border-[#C89F77]/30 hover:border-[#8B5E3C]"
              }`}
            >
              {opt.label}
            </button>
          ))}

          <div className="w-px h-6 bg-[#C89F77]/30 mx-1" />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-xs font-bold text-[#6d4c41] focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40 cursor-pointer"
          >
            <option value="ALL">🔲 Tất cả trạng thái</option>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>

          <div className="relative flex-1 min-w-[200px] md:ml-auto">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]" />
            <input
              type="text"
              placeholder="Tìm mã ĐH, số bàn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-xs font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40"
            />
          </div>
        </motion.div>

        {/* ===== KPI CARDS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              title: "Tổng đơn hàng",
              value: stats.filtered,
              unit: "đơn",
              icon: ClipboardDocumentListIcon,
              gradient: "from-[#8B5E3C] to-[#6d4c41]",
              badge: `${stats.total} total`,
            },
            {
              title: "Hoàn thành",
              value: stats.statusCounts.PAID || 0,
              unit: "đơn",
              icon: CheckCircleIcon,
              gradient: "from-green-500 to-emerald-600",
              badge: `${stats.completedRate.toFixed(0)}%`,
            },
            {
              title: "Đang chờ xử lý",
              value:
                (stats.statusCounts.PENDING || 0) +
                (stats.statusCounts.CONFIRMED || 0) +
                (stats.statusCounts.PREPARING || 0),
              unit: "đơn",
              icon: ClockIcon,
              gradient: "from-amber-500 to-orange-600",
              badge: "Chờ",
            },
            {
              title: "Đã hủy",
              value: stats.statusCounts.CANCELLED || 0,
              unit: "đơn",
              icon: XCircleIcon,
              gradient: "from-red-500 to-rose-600",
              badge: `${stats.cancelledRate.toFixed(0)}%`,
            },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md hover:shadow-2xl border border-amber-100 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#f5ede3] to-transparent rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#faf6f1] border border-[#C89F77]/30">
                    <Typography className="text-[9px] font-extrabold text-[#8B5E3C] uppercase">
                      {s.badge}
                    </Typography>
                  </div>
                </div>
                <div className="relative">
                  <Typography className="text-[10px] font-extrabold uppercase text-gray-400 tracking-[0.15em] mb-1">
                    {s.title}
                  </Typography>
                  <div className="flex items-end gap-2">
                    <Typography className="text-2xl font-extrabold text-[#4e342e] leading-none">
                      {s.value}
                    </Typography>
                    {s.unit && (
                      <span className="text-[10px] font-semibold text-gray-400 mb-1">
                        {s.unit}
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative mt-4 h-1 rounded-full bg-[#faf6f1] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${s.gradient}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===== GROWTH CARDS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="p-5 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] shadow-xl border-0 overflow-hidden relative">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="relative flex items-center justify-between">
              <div>
                <Typography className="text-[10px] font-extrabold text-amber-200 uppercase tracking-widest mb-1">
                  Đơn hôm nay
                </Typography>
                <Typography className="text-2xl font-extrabold text-white leading-none">
                  {stats.todayOrders}
                </Typography>
                <Typography className="text-[10px] text-amber-200/80 mt-1">
                  Hôm qua: {stats.yesterdayOrders}
                </Typography>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ShoppingCartIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card
            className={`p-5 rounded-2xl shadow-xl border-0 overflow-hidden relative ${
              stats.growth >= 0
                ? "bg-gradient-to-br from-green-500 to-emerald-600"
                : "bg-gradient-to-br from-red-500 to-rose-600"
            }`}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="relative flex items-center justify-between">
              <div>
                <Typography className="text-[10px] font-extrabold text-white/80 uppercase tracking-widest mb-1">
                  Tăng trưởng
                </Typography>
                <div className="flex items-center gap-2">
                  {stats.growth >= 0 ? (
                    <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-6 h-6 text-white" />
                  )}
                  <Typography className="text-2xl font-extrabold text-white leading-none">
                    {stats.growth >= 0 ? "+" : ""}
                    {stats.growth.toFixed(1)}%
                  </Typography>
                </div>
                <Typography className="text-[10px] text-white/80 mt-1">
                  So với hôm qua
                </Typography>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {stats.growth >= 0 ? (
                  <ArrowTrendingUpIcon className="w-6 h-6 text-white" />
                ) : (
                  <ArrowTrendingDownIcon className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
          </Card>

          <Card className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl border-0 overflow-hidden relative">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="relative flex items-center justify-between">
              <div>
                <Typography className="text-[10px] font-extrabold text-white/80 uppercase tracking-widest mb-1">
                  Doanh thu (lọc)
                </Typography>
                <Typography className="text-2xl font-extrabold text-white leading-none truncate">
                  {formatCompact(stats.totalRevenue)}
                </Typography>
                <Typography className="text-[10px] text-white/80 mt-1">
                  AOV: {formatCompact(stats.avgValue)}
                </Typography>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <BanknotesIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ===== SECTION TITLE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex items-center gap-3"
        >
          <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
          <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
            Phân tích đơn hàng
          </Typography>
        </motion.div>

        {/* ===== CHART ROW 1 ===== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="xl:col-span-2"
          >
            <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg">
                    <PresentationChartLineIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Typography className="font-extrabold text-[#4e342e] text-sm">
                      Đơn hàng 30 ngày gần nhất
                    </Typography>
                    <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                      Tổng / Hoàn thành / Đã hủy
                    </Typography>
                  </div>
                </div>
                <Chip
                  value="Realtime"
                  className="bg-green-50 text-green-700 border border-green-200 text-[9px] font-extrabold uppercase w-fit"
                  size="sm"
                />
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyOrders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" vertical={false} />
                    <XAxis dataKey="date" stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #C89F77",
                        borderRadius: "12px",
                        fontSize: "12px",
                        boxShadow: "0 4px 12px rgba(139, 94, 60, 0.15)",
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "11px", color: "#6d4c41" }} iconType="circle" />
                    <Line type="monotone" dataKey="total" name="Tổng" stroke="#8B5E3C" strokeWidth={2.5} dot={{ r: 3, fill: "#8B5E3C" }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="completed" name="Hoàn thành" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3, fill: "#22c55e" }} activeDot={{ r: 5 }} />
                    <Line type="monotone" dataKey="cancelled" name="Đã hủy" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3, fill: "#ef4444" }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
                  <ChartPieIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">
                    Trạng thái đơn
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    Phân bổ
                  </Typography>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData.length ? statusPieData : [{ name: "Chưa có", value: 1 }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={STATUS_CONFIG[entry.status]?.color || PIE_COLORS[i % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #C89F77",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(v, n) => [`${v} đơn`, n]}
                    />
                    <Legend wrapperStyle={{ fontSize: "10px", color: "#6d4c41" }} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ===== CHART ROW 2 ===== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">
                    Đơn hàng theo tháng
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    Năm {dayjs().year()}
                  </Typography>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyOrders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" vertical={false} />
                    <XAxis dataKey="month" stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #C89F77",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      cursor={{ fill: "#faf6f1" }}
                    />
                    <Bar dataKey="total" name="Tổng" fill="#8B5E3C" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="completed" name="Hoàn thành" fill="#22c55e" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <ClockIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">
                    Đơn hàng theo giờ
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    Giờ cao điểm
                  </Typography>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyOrders}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" vertical={false} />
                    <XAxis dataKey="hour" stroke="#a4714b" fontSize={9} tickLine={false} axisLine={false} interval={2} />
                    <YAxis stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #C89F77",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(v) => [`${v} đơn`, "Số đơn"]}
                      cursor={{ fill: "#faf6f1" }}
                    />
                    <Bar dataKey="orders" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <FireIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">
                    Đơn hàng theo thứ
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    Xu hướng trong tuần
                  </Typography>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={weekdayData}>
                    <PolarGrid stroke="#e8d9c7" />
                    <PolarAngleAxis dataKey="weekday" tick={{ fontSize: 10, fill: "#6d4c41" }} />
                    <PolarRadiusAxis tick={{ fontSize: 9, fill: "#a4714b" }} axisLine={false} />
                    <Radar
                      name="Đơn hàng"
                      dataKey="orders"
                      stroke="#0891b2"
                      fill="#0891b2"
                      fillOpacity={0.4}
                      strokeWidth={2.5}
                    />
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #C89F77",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(v) => [`${v} đơn`, "Số đơn"]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ===== ORDER TABLE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex items-center gap-3 mt-2"
        >
          <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
          <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
            Danh sách đơn hàng
          </Typography>
          <span className="ml-auto text-[10px] font-extrabold text-[#8B5E3C] bg-white border border-[#C89F77]/30 px-2.5 py-1 rounded-lg">
            {stats.filtered} đơn
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed min-w-[900px]">
                <colgroup><col className="w-[7%]" /><col className="w-[10%]" /><col className="w-[12%]" /><col className="w-[18%]" /><col className="w-[15%]" /><col className="w-[18%]" /><col className="w-[20%]" /></colgroup>
                <thead>
                  <tr className="bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] border-b-2 border-amber-100">
                    {["STT", "Mã ĐH", "Ngày tạo", "Trạng thái", "Bàn", "Tổng tiền", "Thanh toán"].map((el) => (
                      <th key={el} className="py-4 px-5 text-left">
                        <Typography className="text-[10px] font-extrabold uppercase text-[#6d4c41] tracking-wider">
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-16">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-3">
                            <span className="text-4xl">📋</span>
                          </div>
                          <Typography className="text-sm font-bold text-[#8B5E3C] mb-1">
                            Không có đơn hàng nào
                          </Typography>
                          <Typography className="text-xs text-gray-400">
                            Thử thay đổi bộ lọc hoặc khoảng thời gian
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.slice(0, 20).map((order, i) => {
                      const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                      const StatusIcon = cfg.icon;
                      return (
                        <motion.tr
                          key={order.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.02 }}
                          className="group hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] border-b border-amber-50 transition-all duration-200"
                        >
                          <td className="py-3 px-5">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] group-hover:from-[#8B5E3C] group-hover:to-[#6d4c41] flex items-center justify-center text-xs font-bold text-[#6d4c41] group-hover:text-white transition-all duration-300">
                              {i + 1}
                            </div>
                          </td>
                          <td className="py-3 px-5">
                            <Typography className="text-sm font-extrabold text-[#8B5E3C] whitespace-nowrap">
                              #{order.id}
                            </Typography>
                          </td>
                          <td className="py-3 px-5">
                            <Typography className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                              {dayjs(order.createdAt).format("DD/MM HH:mm")}
                            </Typography>
                          </td>
                          <td className="py-3 px-5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-extrabold whitespace-nowrap ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                              <StatusIcon className="w-3 h-3" strokeWidth={2.5} />
                              {cfg.label}
                            </span>
                          </td>
                          <td className="py-3 px-5">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#f5ede3] to-[#faf6f1] border border-[#C89F77]/40">
                              <span className="text-[10px]">🪑</span>
                              <Typography className="text-[10px] font-bold text-[#6d4c41]">
                                {order.table?.number || "N/A"}
                              </Typography>
                            </span>
                          </td>
                          <td className="py-3 px-5">
                            <Typography className="text-sm font-extrabold text-[#4e342e] whitespace-nowrap">
                              {formatPrice(order.totalAmount)}
                            </Typography>
                          </td>
                          <td className="py-3 px-5">
                            <Typography className="text-xs font-bold text-gray-600 truncate">
                              {order.paymentMethod === "CASH"
                                ? "💵 Tiền mặt"
                                : order.paymentMethod === "CREDIT_CARD"
                                ? "💳 Thẻ"
                                : order.paymentMethod === "E_WALLET"
                                ? "📱 Ví điện tử"
                                : "🏦 Chuyển khoản"}
                            </Typography>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {filteredOrders.length > 20 && (
              <div className="p-4 bg-[#faf6f1] border-t border-amber-100 text-center">
                <Typography className="text-[10px] font-bold text-[#6d4c41]">
                  Hiển thị 20 / {filteredOrders.length} đơn hàng. Nhấn "Xuất báo cáo" để xem toàn bộ.
                </Typography>
              </div>
            )}
          </Card>
        </motion.div>

        {/* ===== INFO NOTE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <SparklesIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Ghi chú:</span> Báo cáo đơn hàng hiển thị chi tiết tất cả đơn hàng theo khoảng thời gian và trạng thái được chọn. Sử dụng bộ lọc để phân tích từng nhóm đơn hàng cụ thể. Nhấn "Xuất báo cáo" để tải CSV chi tiết.
          </Typography>
        </motion.div>
      </div>
    </div>
  );
}

export default OrderReport;
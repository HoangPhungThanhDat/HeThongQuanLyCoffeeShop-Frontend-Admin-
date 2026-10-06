import { useState, useEffect, useMemo } from "react";
import { Card, Typography, Button, Chip } from "@material-tailwind/react";
import {
  BanknotesIcon, ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  CalendarDaysIcon, ArrowPathIcon, SparklesIcon, CurrencyDollarIcon,
  ShoppingCartIcon, UsersIcon, TrophyIcon, ChartPieIcon,
  PresentationChartLineIcon, DocumentArrowDownIcon, FunnelIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  ResponsiveContainer, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip, AreaChart, Area,
} from "recharts";
import reportApi from "@/api/reportApi";
import { CoffeeLoader } from "@/widgets/loaders";
import { getImageUrl, handleImageError } from "@/utils/imageHelper";   // ✅ MỚI
import Swal from "sweetalert2";

const COLORS = ["#8B5E3C", "#C89F77", "#a4714b", "#6d4c41", "#4e342e", "#D4A574"];

const PAYMENT_LABEL = {
  CASH: "Tiền mặt",
  CARD: "Thẻ",
  MOBILE: "Ví điện tử",
};

export function Revenue() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  const [preset, setPreset] = useState("month");
  const [fromDate, setFromDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));

  // ==================== DATE PRESETS ====================
  const datePresets = [
    { key: "today", label: "Hôm nay" },
    { key: "week", label: "Tuần này" },
    { key: "month", label: "Tháng này" },
    { key: "year", label: "Năm nay" },
    { key: "custom", label: "Tùy chỉnh" },
  ];

  const handlePresetChange = (key) => {
    setPreset(key);
    const now = dayjs();

    switch (key) {
      case "today":
        setFromDate(now.format("YYYY-MM-DD"));
        setToDate(now.format("YYYY-MM-DD"));
        break;
      case "week":
        setFromDate(now.startOf("week").format("YYYY-MM-DD"));
        setToDate(now.format("YYYY-MM-DD"));
        break;
      case "month":
        setFromDate(now.startOf("month").format("YYYY-MM-DD"));
        setToDate(now.format("YYYY-MM-DD"));
        break;
      case "year":
        setFromDate(now.startOf("year").format("YYYY-MM-DD"));
        setToDate(now.format("YYYY-MM-DD"));
        break;
      case "custom":
        break;
    }
  };

  // ==================== FETCH REPORT ====================
  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await reportApi.getRevenue(fromDate, toDate);
      setReport(data);
    } catch (error) {
      console.error("❌ Fetch report error:", error);
      Swal.fire({
        icon: "error",
        title: "Không tải được báo cáo",
        text: error?.response?.data?.message || "Vui lòng thử lại",
        confirmButtonColor: "#8B5E3C",
      });
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  // ==================== DERIVED DATA ====================
  const stats = useMemo(() => {
    if (!report) return {
      totalRevenue: 0, totalOrders: 0, avgOrder: 0,
      uniqueCustomers: 0, growth: 0, previousRevenue: 0,
    };
    return {
      totalRevenue: report.totalRevenue || 0,
      totalOrders: report.totalOrders || 0,
      avgOrder: report.avgOrderValue || 0,
      uniqueCustomers: report.uniqueCustomers || 0,
      growth: report.growthPercent || 0,
      previousRevenue: report.previousRevenue || 0,
    };
  }, [report]);

  const dailyRevenue = useMemo(() => {
    if (!report?.dailyRevenue) return [];
    return report.dailyRevenue.map((d) => ({
      date: dayjs(d.date).format("DD/MM"),
      fullDate: d.date,
      revenue: Number(d.revenue) || 0,
      orders: Number(d.orderCount) || 0,
    }));
  }, [report]);

  const paymentMethodData = useMemo(() => {
    if (!report?.paymentMethodStats) return [];
    return report.paymentMethodStats.map((s) => ({
      name: PAYMENT_LABEL[s.method] || s.method,
      value: Number(s.revenue) || 0,
      count: Number(s.count) || 0,
    }));
  }, [report]);

  const topProducts = useMemo(() => {
    if (!report?.topProducts) return [];
    return report.topProducts.map((p) => ({
      id: p.productId,
      name: p.name,
      imageUrl: p.imageUrl,
      quantity: Number(p.totalQuantity) || 0,
      revenue: Number(p.totalRevenue) || 0,
    }));
  }, [report]);

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

  const handleExport = () => {
    if (!dailyRevenue.length) {
      Swal.fire({
        toast: true, position: "top-end", icon: "warning",
        title: "Không có dữ liệu để xuất", showConfirmButton: false, timer: 2000,
      });
      return;
    }

    const csvData = [
      ["Báo cáo doanh thu từ " + fromDate + " đến " + toDate],
      [],
      ["Ngày", "Doanh thu", "Số đơn"],
      ...dailyRevenue.map((d) => [d.fullDate, d.revenue, d.orders]),
      [],
      ["Top sản phẩm", "", "", ""],
      ["Sản phẩm", "Số lượng", "Doanh thu"],
      ...topProducts.map((p) => [p.name, p.quantity, p.revenue]),
    ];
    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-doanh-thu-${fromDate}_${toDate}.csv`;
    link.click();

    Swal.fire({
      toast: true, position: "top-end", icon: "success",
      title: "Đã xuất báo cáo!", showConfirmButton: false, timer: 2000,
    });
  };

  // ==================== LOADER ====================
  if (loading && !report) {
    return (
      <CoffeeLoader
        title="Đang pha chế báo cáo"
        subtitle="Vui lòng chờ trong giây lát"
      />
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6">

        {/* HEADER */}
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
              <ChartBarIcon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <Typography variant="h4" className="font-extrabold text-[#4e342e] tracking-tight text-2xl lg:text-3xl">
                Báo Cáo Doanh Thu
              </Typography>
              <Typography className="text-xs lg:text-sm text-[#8B5E3C] font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Phân tích chi tiết doanh số và xu hướng kinh doanh
              </Typography>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outlined"
              className="flex items-center gap-2 border-2 border-[#8B5E3C]/40 text-[#6d4c41] hover:bg-[#faf6f1] hover:border-[#8B5E3C] rounded-xl normal-case font-bold px-4 py-2.5"
              onClick={fetchReport}
            >
              <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} strokeWidth={2.5} />
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

        {/* TIME FILTER + DATE PICKER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-amber-100 shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
              <FunnelIcon className="w-4 h-4 text-[#8B5E3C]" />
              <Typography className="text-[11px] font-extrabold uppercase tracking-widest text-[#6d4c41]">
                Khoảng thời gian:
              </Typography>
            </div>
            {datePresets.map((opt) => (
              <button
                key={opt.key}
                onClick={() => handlePresetChange(opt.key)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 ${
                  preset === opt.key
                    ? "bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] text-white shadow-lg shadow-[#8B5E3C]/30"
                    : "bg-[#faf6f1] text-[#6d4c41] border border-[#C89F77]/30 hover:border-[#8B5E3C]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {preset === "custom" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-end gap-3 pt-3 border-t border-amber-100"
            >
              <div className="flex-1 min-w-[180px]">
                <Typography className="text-[10px] font-extrabold uppercase text-gray-400 tracking-widest mb-1.5">
                  Từ ngày
                </Typography>
                <div className="relative">
                  <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C] pointer-events-none z-10" />
                  <input
                    type="date"
                    value={fromDate}
                    max={toDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-sm font-semibold text-[#4e342e] focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-[180px]">
                <Typography className="text-[10px] font-extrabold uppercase text-gray-400 tracking-widest mb-1.5">
                  Đến ngày
                </Typography>
                <div className="relative">
                  <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C] pointer-events-none z-10" />
                  <input
                    type="date"
                    value={toDate}
                    min={fromDate}
                    max={dayjs().format("YYYY-MM-DD")}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-sm font-semibold text-[#4e342e] focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40"
                  />
                </div>
              </div>

              <Button
                onClick={fetchReport}
                className="bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] text-white px-6 py-2.5 rounded-xl normal-case font-bold shadow-md"
              >
                Áp dụng
              </Button>

              <Typography className="text-xs text-[#8B5E3C] font-bold ml-auto">
                📅 {dayjs(fromDate).format("DD/MM/YYYY")} → {dayjs(toDate).format("DD/MM/YYYY")}
              </Typography>
            </motion.div>
          )}

          {preset !== "custom" && (
            <div className="flex items-center gap-2 ml-auto px-3 py-2 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30">
              <CalendarDaysIcon className="w-4 h-4 text-[#8B5E3C]" />
              <Typography className="text-xs font-bold text-[#4e342e]">
                {dayjs(fromDate).format("DD/MM/YYYY")} → {dayjs(toDate).format("DD/MM/YYYY")}
              </Typography>
            </div>
          )}
        </motion.div>

        {/* KPI CARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {[
            { title: "Tổng doanh thu", value: formatPrice(stats.totalRevenue),
              icon: BanknotesIcon, gradient: "from-[#8B5E3C] to-[#6d4c41]",
              badge: "COMPLETED" },
            { title: "Tổng đơn hàng", value: stats.totalOrders.toString(),
              unit: "đơn", icon: ShoppingCartIcon, gradient: "from-green-500 to-emerald-600",
              badge: "Đã TT" },
            { title: "Giá trị TB/Đơn", value: formatCompact(stats.avgOrder),
              unit: "VNĐ", icon: CurrencyDollarIcon, gradient: "from-blue-500 to-indigo-600",
              badge: "AOV" },
            { title: "Khách hàng", value: stats.uniqueCustomers.toString(),
              unit: "người", icon: UsersIcon, gradient: "from-purple-500 to-fuchsia-600",
              badge: "Unique" },
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
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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
                    <Typography className="text-2xl font-extrabold text-[#4e342e] leading-none truncate">
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

        {/* GROWTH CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <Card className="p-5 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] shadow-xl border-0 overflow-hidden relative">
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
            <div className="relative flex items-center justify-between">
              <div>
                <Typography className="text-[10px] font-extrabold text-amber-200 uppercase tracking-widest mb-1">
                  Kỳ trước
                </Typography>
                <Typography className="text-2xl font-extrabold text-white leading-none truncate">
                  {formatCompact(stats.previousRevenue)}
                </Typography>
                <Typography className="text-[10px] text-amber-200/80 mt-1">
                  {dayjs(fromDate).subtract(dayjs(toDate).diff(fromDate, "day") + 1, "day").format("DD/MM")} → {dayjs(fromDate).subtract(1, "day").format("DD/MM")}
                </Typography>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <BanknotesIcon className="w-6 h-6 text-white" />
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
                    {stats.growth >= 0 ? "+" : ""}{stats.growth.toFixed(1)}%
                  </Typography>
                </div>
                <Typography className="text-[10px] text-white/80 mt-1">
                  So với kỳ trước
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
        </motion.div>

        {/* CHARTS TITLE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-3"
        >
          <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
          <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
            Biểu đồ phân tích
          </Typography>
        </motion.div>

        {/* MAIN CHARTS */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="xl:col-span-2"
          >
            <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg">
                    <PresentationChartLineIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Typography className="font-extrabold text-[#4e342e] text-sm">
                      Doanh thu theo ngày
                    </Typography>
                    <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                      {dailyRevenue.length} ngày có doanh thu
                    </Typography>
                  </div>
                </div>
                <Chip value="Realtime" className="bg-green-50 text-green-700 border border-green-200 text-[9px] font-extrabold uppercase w-fit" size="sm" />
              </div>
              <div className="h-72" style={{ minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyRevenue}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5E3C" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#8B5E3C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" vertical={false} />
                    <XAxis dataKey="date" stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={formatCompact} />
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "#fff", border: "1px solid #C89F77",
                        borderRadius: "12px", fontSize: "12px",
                        boxShadow: "0 4px 12px rgba(139, 94, 60, 0.15)",
                      }}
                      formatter={(v) => [formatPrice(v), "Doanh thu"]}
                    />
                    <Area type="monotone" dataKey="revenue" stroke="#8B5E3C" strokeWidth={2.5} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <ChartPieIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">Phương thức TT</Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">Phân bổ doanh thu</Typography>
                </div>
              </div>
              <div className="h-72" style={{ minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData.length ? paymentMethodData : [{ name: "Chưa có", value: 1 }]}
                      cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                      paddingAngle={3} dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {paymentMethodData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip
                      contentStyle={{ backgroundColor: "#fff", border: "1px solid #C89F77", borderRadius: "12px", fontSize: "12px" }}
                      formatter={(v) => formatPrice(v)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* TOP PRODUCTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex items-center gap-3 mt-2"
        >
          <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
          <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
            Top sản phẩm doanh thu
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
            <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <TrophyIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-bold text-[#4e342e] tracking-wide">
                    Top 10 sản phẩm doanh thu cao nhất
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    {dayjs(fromDate).format("DD/MM/YYYY")} → {dayjs(toDate).format("DD/MM/YYYY")}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-fixed min-w-[800px]">
                <colgroup>
                  <col className="w-[8%]" /><col className="w-[42%]" />
                  <col className="w-[15%]" /><col className="w-[20%]" /><col className="w-[15%]" />
                </colgroup>
                <thead>
                  <tr className="bg-[#faf6f1] border-b border-amber-100">
                    {["Hạng", "Sản phẩm", "Đã bán", "Doanh thu", "Tỷ lệ"].map((el) => (
                      <th key={el} className={`py-3 px-5 ${el === "Hạng" ? "text-center" : "text-left"}`}>
                        <Typography className="text-[10px] font-extrabold uppercase text-[#6d4c41] tracking-wider">
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topProducts.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-3">
                            <span className="text-3xl">☕</span>
                          </div>
                          <Typography className="text-xs text-gray-400 italic">
                            Chưa có dữ liệu bán hàng trong khoảng thời gian này
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    topProducts.map((p, i) => {
                      const maxRevenue = topProducts[0]?.revenue || 1;
                      const percent = (p.revenue / maxRevenue) * 100;
                      return (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.05 }}
                          className="group hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] border-b border-amber-50 transition-all duration-200"
                        >
                          <td className="py-4 px-5 text-center">
                            <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl font-extrabold text-xs shadow-sm ${
                              i === 0 ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                              : i === 1 ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                              : i === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                              : "bg-[#faf6f1] text-[#6d4c41] border border-[#C89F77]/30"
                            }`}>
                              {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3 min-w-0">
                              {/* ✅ FIX: dùng helper getImageUrl + handleImageError */}
                              <img
                                src={getImageUrl(p.imageUrl)}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover shadow-md border-2 border-white ring-2 ring-amber-100 flex-shrink-0 bg-[#faf6f1]"
                                onError={handleImageError}
                              />
                              <div className="min-w-0">
                                <Typography className="text-xs font-extrabold text-[#4e342e] group-hover:text-[#8B5E3C] transition-colors truncate">
                                  {p.name}
                                </Typography>
                                <Typography className="text-[10px] text-gray-400">
                                  ID: #{p.id}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <Chip value={`${p.quantity} ly`}
                              className="bg-gradient-to-r from-[#faf6f1] to-[#f5ede3] text-[#6d4c41] border border-[#C89F77]/30 text-[10px] font-extrabold w-fit"
                              size="sm" />
                          </td>
                          <td className="py-4 px-5">
                            <Typography className="text-sm font-extrabold text-green-600 truncate">
                              {formatPrice(p.revenue)}
                            </Typography>
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 rounded-full bg-[#faf6f1] overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percent}%` }}
                                  transition={{ duration: 0.8, delay: 0.7 + i * 0.05 }}
                                  className="h-full rounded-full bg-gradient-to-r from-[#8B5E3C] to-[#C89F77]"
                                />
                              </div>
                              <Typography className="text-[10px] font-extrabold text-[#8B5E3C] w-8 text-right">
                                {percent.toFixed(0)}%
                              </Typography>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* INFO NOTE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <SparklesIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Ghi chú:</span> Báo cáo doanh thu cung cấp cái nhìn tổng quan về hiệu suất kinh doanh.
            Dữ liệu chỉ tính các hóa đơn <span className="font-bold">ĐÃ THANH TOÁN (COMPLETED)</span>.
            Chọn "Tùy chỉnh" để chọn khoảng ngày cụ thể. Nhấn "Xuất báo cáo" để tải file CSV.
          </Typography>
        </motion.div>
      </div>
    </div>
  );
}

export default Revenue;
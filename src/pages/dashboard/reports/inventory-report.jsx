import { useState, useEffect, useMemo } from "react";
import {
  Card,
  Typography,
  Button,
} from "@material-tailwind/react";
import {
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  SparklesIcon,
  FunnelIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  BanknotesIcon,
  ArchiveBoxIcon,
  ArrowDownTrayIcon,
  BellAlertIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
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
import ProductAPI from "@/api/productApi";
import CategoryAPI from "@/api/categoryApi";
import { CoffeeLoader } from "@/widgets/loaders";
import Swal from "sweetalert2";

// ==================== STOCK CONFIG ====================
const getStockConfig = (qty) => {
  if (qty === 0) {
    return {
      label: "Hết hàng",
      emoji: "🚨",
      color: "#dc2626",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      level: "out",
    };
  }
  if (qty < 10) {
    return {
      label: "Sắp hết",
      emoji: "⚠️",
      color: "#f59e0b",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      level: "low",
    };
  }
  if (qty < 30) {
    return {
      label: "Trung bình",
      emoji: "📦",
      color: "#3b82f6",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      level: "medium",
    };
  }
  return {
    label: "Đầy đủ",
    emoji: "✅",
    color: "#22c55e",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    level: "high",
  };
};

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#dc2626"];

/**
 * Helper: luôn trả về mảng, dù BE trả PageResponse, mảng, hay null
 */
const toArray = (res) => {
  const data = res?.data?.content ?? res?.data ?? res;
  return Array.isArray(data) ? data : [];
};

export function InventoryReport() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("stock"); // stock | name | value

  // ==================== FETCH ====================
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        // ⭐ SỬA: thêm size lớn để lấy tất cả cho báo cáo
        const [productsRes, categoriesRes] = await Promise.all([
          ProductAPI.getAll({ size: 10000 }),
          CategoryAPI.getAll({ size: 10000 }),
        ]);

        if (!isMounted) return;

        // ⭐ SỬA: đọc .content từ PageResponse
        setProducts(toArray(productsRes));
        setCategories(toArray(categoriesRes));
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
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter danh mục
    if (categoryFilter !== "ALL") {
      result = result.filter(
        (p) => p.category?.id?.toString() === categoryFilter
      );
    }

    // Filter trạng thái kho
    if (stockFilter !== "ALL") {
      result = result.filter((p) => {
        const qty = p.stockQuantity || 0;
        if (stockFilter === "OUT") return qty === 0;
        if (stockFilter === "LOW") return qty > 0 && qty < 10;
        if (stockFilter === "MEDIUM") return qty >= 10 && qty < 30;
        if (stockFilter === "HIGH") return qty >= 30;
        return true;
      });
    }

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(term) ||
          p.id?.toString().includes(term)
      );
    }

    // Sort
    if (sortBy === "stock") {
      result.sort((a, b) => (a.stockQuantity || 0) - (b.stockQuantity || 0));
    } else if (sortBy === "name") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sortBy === "value") {
      result.sort(
        (a, b) =>
          (b.price || 0) * (b.stockQuantity || 0) -
          (a.price || 0) * (a.stockQuantity || 0)
      );
    }

    return result;
  }, [products, categoryFilter, stockFilter, searchTerm, sortBy]);

  // ==================== STATS ====================
  const stats = useMemo(() => {
    const total = products.length;
    const totalStock = products.reduce(
      (s, p) => s + (p.stockQuantity || 0),
      0
    );
    const totalValue = products.reduce(
      (s, p) => s + (p.price || 0) * (p.stockQuantity || 0),
      0
    );
    const outOfStock = products.filter((p) => (p.stockQuantity || 0) === 0).length;
    const lowStock = products.filter(
      (p) => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < 10
    ).length;
    const mediumStock = products.filter(
      (p) =>
        (p.stockQuantity || 0) >= 10 && (p.stockQuantity || 0) < 30
    ).length;
    const highStock = products.filter((p) => (p.stockQuantity || 0) >= 30).length;
    const activeProducts = products.filter((p) => p.isActive).length;
    const inactiveProducts = products.filter((p) => !p.isActive).length;
    const avgStock = total > 0 ? totalStock / total : 0;

    return {
      total,
      totalStock,
      totalValue,
      outOfStock,
      lowStock,
      mediumStock,
      highStock,
      activeProducts,
      inactiveProducts,
      avgStock,
    };
  }, [products]);

  // ==================== CHART DATA ====================
  const stockDistribution = useMemo(() => {
    return [
      { name: "Đầy đủ", value: stats.highStock, color: "#22c55e" },
      { name: "Trung bình", value: stats.mediumStock, color: "#3b82f6" },
      { name: "Sắp hết", value: stats.lowStock, color: "#f59e0b" },
      { name: "Hết hàng", value: stats.outOfStock, color: "#dc2626" },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const categoryDistribution = useMemo(() => {
    return categories
      .map((cat) => {
        const catProducts = products.filter(
          (p) => p.category?.id === cat.id
        );
        return {
          name: cat.name,
          shortName:
            cat.name?.length > 12
              ? cat.name.substring(0, 12) + "..."
              : cat.name,
          products: catProducts.length,
          stock: catProducts.reduce((s, p) => s + (p.stockQuantity || 0), 0),
          value: catProducts.reduce(
            (s, p) => s + (p.price || 0) * (p.stockQuantity || 0),
            0
          ),
        };
      })
      .filter((c) => c.products > 0)
      .sort((a, b) => b.stock - a.stock)
      .slice(0, 10);
  }, [categories, products]);

  const topStockedProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0))
      .slice(0, 10);
  }, [products]);

  const topValueProducts = useMemo(() => {
    return products
      .map((p) => ({
        ...p,
        stockValue: (p.price || 0) * (p.stockQuantity || 0),
      }))
      .sort((a, b) => b.stockValue - a.stockValue)
      .slice(0, 10);
  }, [products]);

  const categoryRadarData = useMemo(() => {
    return categoryDistribution.slice(0, 6).map((c) => ({
      category: c.shortName,
      stock: c.stock,
    }));
  }, [categoryDistribution]);

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

  // ==================== EXPORT ====================
  const handleExport = () => {
    const csvData = [
      ["ID", "Tên SP", "Danh mục", "Tồn kho", "Giá", "Giá trị tồn", "Trạng thái"],
      ...filteredProducts.map((p) => [
        p.id,
        p.name,
        p.category?.name || "N/A",
        p.stockQuantity || 0,
        p.price || 0,
        (p.price || 0) * (p.stockQuantity || 0),
        getStockConfig(p.stockQuantity || 0).label,
      ]),
    ];
    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-kho-hang-${dayjs().format("YYYY-MM-DD")}.csv`;
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
        title="Đang pha chế báo cáo kho"
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
              <ArchiveBoxIcon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <Typography
                variant="h4"
                className="font-extrabold text-[#4e342e] tracking-tight text-2xl lg:text-3xl"
              >
                Báo Cáo Kho Hàng
              </Typography>
              <Typography className="text-xs lg:text-sm text-[#8B5E3C] font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Phân tích tồn kho, giá trị và cảnh báo hàng hóa
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
              <ArrowDownTrayIcon className="h-4 w-4" strokeWidth={2.5} />
              Xuất báo cáo
            </Button>
          </div>
        </motion.div>

        {/* ===== ALERT BANNER ===== */}
        {(stats.outOfStock > 0 || stats.lowStock > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${
              stats.outOfStock > 0
                ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-300"
                : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300"
            }`}
          >
            <div
              className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                stats.outOfStock > 0 ? "bg-red-100" : "bg-amber-100"
              }`}
            >
              <BellAlertIcon
                className={`w-6 h-6 ${
                  stats.outOfStock > 0 ? "text-red-600" : "text-amber-600"
                }`}
                strokeWidth={2.2}
              />
            </div>
            <div className="flex-1">
              <Typography
                className={`text-sm font-extrabold uppercase tracking-wider mb-0.5 ${
                  stats.outOfStock > 0 ? "text-red-700" : "text-amber-700"
                }`}
              >
                {stats.outOfStock > 0
                  ? `⚠️ Cảnh báo: ${stats.outOfStock} sản phẩm đã hết hàng!`
                  : `⚠️ Cảnh báo: ${stats.lowStock} sản phẩm sắp hết hàng!`}
              </Typography>
              <Typography
                className={`text-xs leading-relaxed ${
                  stats.outOfStock > 0 ? "text-red-600" : "text-amber-600"
                }`}
              >
                {stats.outOfStock > 0
                  ? `${stats.outOfStock} sản phẩm cần nhập thêm ngay. ${stats.lowStock} sản phẩm khác đang ở mức sắp hết.`
                  : "Vui lòng nhập thêm hàng để đảm bảo phục vụ khách hàng."}
              </Typography>
            </div>
            <button
              onClick={() => setStockFilter("LOW")}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 hover:scale-105 ${
                stats.outOfStock > 0
                  ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                  : "bg-amber-600 text-white border-amber-600 hover:bg-amber-700"
              }`}
            >
              Xem ngay
            </button>
          </motion.div>
        )}

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
              Lọc:
            </Typography>
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-xs font-bold text-[#6d4c41] focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40 cursor-pointer"
          >
            <option value="ALL">📁 Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id.toString()}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-xs font-bold text-[#6d4c41] focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40 cursor-pointer"
          >
            <option value="ALL">📦 Tất cả trạng thái</option>
            <option value="OUT">🚨 Hết hàng</option>
            <option value="LOW">⚠️ Sắp hết</option>
            <option value="MEDIUM">📦 Trung bình</option>
            <option value="HIGH">✅ Đầy đủ</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-xs font-bold text-[#6d4c41] focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40 cursor-pointer"
          >
            <option value="stock">⬆️ Tồn kho (ít → nhiều)</option>
            <option value="name">🔤 Tên (A → Z)</option>
            <option value="value">💰 Giá trị tồn (cao → thấp)</option>
          </select>

          <div className="relative flex-1 min-w-[200px] md:ml-auto">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]" />
            <input
              type="text"
              placeholder="Tìm tên hoặc mã sản phẩm..."
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
              title: "Tổng sản phẩm",
              value: stats.total,
              unit: "SP",
              icon: CubeIcon,
              gradient: "from-[#8B5E3C] to-[#6d4c41]",
              badge: `${stats.activeProducts} active`,
            },
            {
              title: "Tổng tồn kho",
              value: stats.totalStock.toLocaleString(),
              unit: "đơn vị",
              icon: ArchiveBoxIcon,
              gradient: "from-blue-500 to-indigo-600",
              badge: `TB ${stats.avgStock.toFixed(0)}`,
            },
            {
              title: "Giá trị tồn kho",
              value: formatCompact(stats.totalValue),
              unit: "VNĐ",
              icon: BanknotesIcon,
              gradient: "from-green-500 to-emerald-600",
              badge: "Value",
            },
            {
              title: "Cần nhập thêm",
              value: stats.lowStock + stats.outOfStock,
              unit: "SP",
              icon: ExclamationTriangleIcon,
              gradient: "from-red-500 to-rose-600",
              badge: `${stats.outOfStock} hết`,
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

        {/* ===== STOCK STATUS CARDS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              label: "Đầy đủ",
              value: stats.highStock,
              icon: ShieldCheckIcon,
              gradient: "from-green-500 to-emerald-600",
              emoji: "✅",
              filter: "HIGH",
            },
            {
              label: "Trung bình",
              value: stats.mediumStock,
              icon: CubeIcon,
              gradient: "from-blue-500 to-indigo-600",
              emoji: "📦",
              filter: "MEDIUM",
            },
            {
              label: "Sắp hết",
              value: stats.lowStock,
              icon: ExclamationTriangleIcon,
              gradient: "from-amber-500 to-orange-600",
              emoji: "⚠️",
              filter: "LOW",
            },
            {
              label: "Hết hàng",
              value: stats.outOfStock,
              icon: XCircleIcon,
              gradient: "from-red-500 to-rose-600",
              emoji: "🚨",
              filter: "OUT",
            },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06 }}
                whileHover={{ y: -4 }}
                onClick={() =>
                  setStockFilter(stockFilter === s.filter ? "ALL" : s.filter)
                }
                className={`group relative overflow-hidden rounded-2xl p-4 shadow-md hover:shadow-xl border-2 transition-all duration-300 text-left ${
                  stockFilter === s.filter
                    ? `bg-gradient-to-br ${s.gradient} border-white/40`
                    : "bg-white border-amber-100"
                }`}
              >
                <div className="relative flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      stockFilter === s.filter
                        ? "bg-white/20"
                        : `bg-gradient-to-br ${s.gradient}`
                    }`}
                  >
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography
                      className={`text-[10px] font-extrabold uppercase tracking-wider ${
                        stockFilter === s.filter
                          ? "text-white/80"
                          : "text-gray-400"
                      }`}
                    >
                      {s.emoji} {s.label}
                    </Typography>
                    <Typography
                      className={`text-xl font-extrabold leading-none mt-0.5 ${
                        stockFilter === s.filter ? "text-white" : "text-[#4e342e]"
                      }`}
                    >
                      {s.value}
                    </Typography>
                  </div>
                </div>
              </motion.button>
            );
          })}
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
            Phân tích tồn kho
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
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">
                    Tồn kho theo danh mục
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    Top 10 danh mục
                  </Typography>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryDistribution} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" horizontal={false} />
                    <XAxis type="number" stroke="#a4714b" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis
                      dataKey="shortName"
                      type="category"
                      stroke="#a4714b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #C89F77",
                        borderRadius: "12px",
                        fontSize: "12px",
                        boxShadow: "0 4px 12px rgba(139, 94, 60, 0.15)",
                      }}
                      formatter={(v, n) => [`${v} đơn vị`, "Tồn kho"]}
                    />
                    <Bar dataKey="stock" fill="#C89F77" radius={[0, 8, 8, 0]} />
                  </BarChart>
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
                    Trạng thái kho
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    Phân bổ theo mức
                  </Typography>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={
                        stockDistribution.length
                          ? stockDistribution
                          : [{ name: "Chưa có", value: 1 }]
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {stockDistribution.map((entry, i) => (
                        <Cell key={i} fill={entry.color || PIE_COLORS[i]} />
                      ))}
                    </Pie>
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #C89F77",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(v, n) => [`${v} sản phẩm`, n]}
                    />
                    <Legend wrapperStyle={{ fontSize: "10px", color: "#6d4c41" }} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ===== CHART ROW 2 ===== */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <PresentationChartLineIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">
                    Tồn kho theo danh mục (Radar)
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    So sánh 6 danh mục
                  </Typography>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={categoryRadarData}>
                    <PolarGrid stroke="#e8d9c7" />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{ fontSize: 10, fill: "#6d4c41" }}
                    />
                    <PolarRadiusAxis
                      tick={{ fontSize: 9, fill: "#a4714b" }}
                      axisLine={false}
                    />
                    <Radar
                      name="Tồn kho"
                      dataKey="stock"
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
                      formatter={(v) => [`${v} đơn vị`, "Tồn kho"]}
                    />
                  </RadarChart>
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <BanknotesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">
                    Top giá trị tồn kho
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    10 SP giá trị cao nhất
                  </Typography>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topValueProducts.slice(0, 8).map((p) => ({
                      name:
                        p.name?.length > 14
                          ? p.name.substring(0, 14) + "..."
                          : p.name,
                      value: p.stockValue,
                    }))}
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" horizontal={false} />
                    <XAxis
                      type="number"
                      stroke="#a4714b"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={formatCompact}
                    />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#a4714b"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      width={100}
                    />
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #C89F77",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(v) => [formatPrice(v), "Giá trị tồn"]}
                    />
                    <Bar dataKey="value" fill="#22c55e" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ===== PRODUCT TABLE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-3 mt-2"
        >
          <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
          <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
            Danh sách sản phẩm
          </Typography>
          <span className="ml-auto text-[10px] font-extrabold text-[#8B5E3C] bg-white border border-[#C89F77]/30 px-2.5 py-1 rounded-lg">
            {filteredProducts.length} sản phẩm
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed min-w-[1000px]">
                <colgroup><col className="w-[5%]" /><col className="w-[28%]" /><col className="w-[15%]" /><col className="w-[12%]" /><col className="w-[12%]" /><col className="w-[14%]" /><col className="w-[14%]" /></colgroup>
                <thead>
                  <tr className="bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] border-b-2 border-amber-100">
                    {[
                      "STT",
                      "Sản phẩm",
                      "Danh mục",
                      "Tồn kho",
                      "Giá bán",
                      "Giá trị tồn",
                      "Trạng thái",
                    ].map((el) => (
                      <th key={el} className="py-4 px-4 text-left">
                        <Typography className="text-[10px] font-extrabold uppercase text-[#6d4c41] tracking-wider">
                          {el}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-16">
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-3">
                            <span className="text-4xl">📦</span>
                          </div>
                          <Typography className="text-sm font-bold text-[#8B5E3C] mb-1">
                            Không có sản phẩm nào
                          </Typography>
                          <Typography className="text-xs text-gray-400">
                            Thử thay đổi bộ lọc
                          </Typography>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.slice(0, 20).map((p, i) => {
                      const cfg = getStockConfig(p.stockQuantity || 0);
                      const stockValue = (p.price || 0) * (p.stockQuantity || 0);
                      return (
                        <motion.tr
                          key={p.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.55 + i * 0.02 }}
                          className="group hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] border-b border-amber-50 transition-all duration-200"
                        >
                          <td className="py-3 px-4">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] group-hover:from-[#8B5E3C] group-hover:to-[#6d4c41] flex items-center justify-center text-xs font-bold text-[#6d4c41] group-hover:text-white transition-all duration-300">
                              {i + 1}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                 src={p.imageUrl || "https://via.placeholder.com/150"}
                                 alt={p.name}
                                className="w-11 h-11 rounded-xl object-cover shadow-md border-2 border-white ring-2 ring-amber-100 flex-shrink-0"
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
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#f5ede3] to-[#faf6f1] border border-[#C89F77]/40 max-w-full">
                              <span className="text-[10px]">📁</span>
                              <Typography className="text-[10px] font-bold text-[#6d4c41] truncate">
                                {p.category?.name || "N/A"}
                              </Typography>
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full border text-[11px] font-extrabold ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                              {p.stockQuantity || 0}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Typography className="text-xs font-extrabold text-[#8B5E3C] whitespace-nowrap">
                              {formatPrice(p.price)}
                            </Typography>
                          </td>
                          <td className="py-3 px-4">
                            <Typography className="text-xs font-extrabold text-green-600 whitespace-nowrap">
                              {formatCompact(stockValue)}
                            </Typography>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-extrabold whitespace-nowrap ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                              <span>{cfg.emoji}</span>
                              {cfg.label}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {filteredProducts.length > 20 && (
              <div className="p-4 bg-[#faf6f1] border-t border-amber-100 text-center">
                <Typography className="text-[10px] font-bold text-[#6d4c41]">
                  Hiển thị 20 / {filteredProducts.length} sản phẩm. Nhấn "Xuất báo cáo" để xem toàn bộ.
                </Typography>
              </div>
            )}
          </Card>
        </motion.div>

        {/* ===== INFO NOTE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <SparklesIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Ghi chú:</span> Báo cáo kho hàng giúp theo dõi tình trạng tồn kho theo danh mục, cảnh báo sản phẩm sắp hết hoặc đã hết hàng. Sử dụng bộ lọc để phân tích từng nhóm sản phẩm. Nhấn "Xuất báo cáo" để tải CSV chi tiết.
          </Typography>
        </motion.div>
      </div>
    </div>
  );
}

export default InventoryReport;
import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  CardBody,
  Avatar,
  Chip,
  Progress,
} from "@material-tailwind/react";
import {
  BanknotesIcon,
  UsersIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  SparklesIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  FireIcon,
  StarIcon,
  EyeIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { StatisticsChart } from "@/widgets/charts";
import BillAPI from "@/api/billApi";
import productApi from "@/api/productApi";
import { chartsConfig } from "@/configs/charts-config";
import { CoffeeLoader } from "@/widgets/loaders";

// ⭐ Helper: chuẩn hoá response từ BE về mảng
const toArray = (res) => {
  const data = res?.data?.content ?? res?.data ?? res;
  return Array.isArray(data) ? data : [];
};

export function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenueToday: 0,
    totalBills: 0,
    totalProducts: 0,
    totalRevenueAll: 0,
    avgOrderValue: 0,
    completedOrders: 0,
    pendingOrders: 0,
    topProduct: null,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [chartData, setChartData] = useState({
    weekly: [],
    monthly: [],
    hourly: [],
    categoryRevenue: [],
    paymentMethods: [],
  });

  // ==================== HELPERS ====================
  const getRevenuePerDayOfWeek = (bills) => {
    const result = Array(7).fill(0);
    const startOfWeek = dayjs().startOf("week").add(1, "day");
    const endOfWeek = dayjs().endOf("week").add(1, "day");

    bills.forEach((bill) => {
      if (bill.paymentStatus === "COMPLETED") {
        const billDate = dayjs(bill.createdAt);
        if (
          billDate.isAfter(startOfWeek.subtract(1, "day")) &&
          billDate.isBefore(endOfWeek.add(1, "day"))
        ) {
          const day = billDate.day();
          const index = day === 0 ? 6 : day - 1;
          result[index] += bill.totalAmount || 0;
        }
      }
    });
    return result;
  };

  const getRevenuePerMonth = (bills) => {
    const result = Array(12).fill(0);
    const currentYear = dayjs().year();

    bills.forEach((bill) => {
      if (
        bill.paymentStatus === "COMPLETED" &&
        dayjs(bill.createdAt).year() === currentYear
      ) {
        const month = dayjs(bill.createdAt).month();
        result[month] += bill.totalAmount || 0;
      }
    });
    return result;
  };

  const getRevenuePerHour = (bills) => {
    const result = Array(24).fill(0);
    const today = dayjs().format("YYYY-MM-DD");

    bills.forEach((bill) => {
      if (
        bill.paymentStatus === "COMPLETED" &&
        dayjs(bill.createdAt).format("YYYY-MM-DD") === today
      ) {
        const hour = dayjs(bill.createdAt).hour();
        result[hour] += bill.totalAmount || 0;
      }
    });
    return result;
  };

  const getPaymentMethodDistribution = (bills) => {
    const methods = {
      CASH: 0,
      CREDIT_CARD: 0,
      E_WALLET: 0,
      BANK_TRANSFER: 0,
    };

    bills.forEach((bill) => {
      if (bill.paymentStatus === "COMPLETED" && bill.paymentMethod) {
        methods[bill.paymentMethod] = (methods[bill.paymentMethod] || 0) + 1;
      }
    });

    const total = Object.values(methods).reduce((a, b) => a + b, 0);
    return Object.entries(methods).map(([method, count]) => ({
      label:
        method === "CASH"
          ? "Tiền mặt"
          : method === "CREDIT_CARD"
          ? "Thẻ"
          : method === "E_WALLET"
          ? "Ví điện tử"
          : "Chuyển khoản",
      value: total > 0 ? ((count / total) * 100).toFixed(1) : 0,
      count: count,
    }));
  };

  const getTopSellingProducts = (bills, products) => {
    const productSales = {};

    bills.forEach((bill) => {
      if (bill.paymentStatus === "COMPLETED" && bill.billDetails) {
        bill.billDetails.forEach((detail) => {
          const productId = detail.productId;
          if (!productSales[productId]) {
            productSales[productId] = { quantity: 0, revenue: 0 };
          }
          productSales[productId].quantity += detail.quantity || 0;
          productSales[productId].revenue +=
            detail.quantity * detail.price || 0;
        });
      }
    });

    return Object.entries(productSales)
      .map(([productId, data]) => {
        const product = products.find((p) => p.id === parseInt(productId));
        return {
          ...product,
          soldQuantity: data.quantity,
          revenue: data.revenue,
        };
      })
      .sort((a, b) => b.soldQuantity - a.soldQuantity)
      .slice(0, 5);
  };

  // ==================== FETCH DATA ====================
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        // ⭐ SỬA: thêm params { size: 1000 }
        const [billsRes, productsRes, newestRes] = await Promise.all([
          BillAPI.getAll({ size: 1000 }),
          productApi.getAll({ size: 1000 }),
          productApi.getNewest(),
        ]);

        if (!isMounted) return;

        // ⭐ SỬA: dùng toArray để handle PageResponse hoặc Array
        const bills = toArray(billsRes);
        const products = toArray(productsRes);
        const newestProducts = toArray(newestRes);

        const completedBills = bills.filter(
          (b) => b.paymentStatus === "COMPLETED"
        );
        const pendingBills = bills.filter(
          (b) => b.paymentStatus === "PENDING"
        );

        const totalRevenueAll = completedBills.reduce(
          (sum, bill) => sum + (bill.totalAmount || 0),
          0
        );
        const avgOrderValue =
          completedBills.length > 0
            ? totalRevenueAll / completedBills.length
            : 0;

        const today = dayjs().format("YYYY-MM-DD");
        const revenueToday = completedBills
          .filter(
            (bill) => dayjs(bill.createdAt).format("YYYY-MM-DD") === today
          )
          .reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);

        const topProducts = getTopSellingProducts(bills, products);
        const paymentDist = getPaymentMethodDistribution(bills);

        setStats({
          totalRevenueToday: revenueToday,
          totalBills: bills.length,
          totalProducts: products.length,
          totalRevenueAll,
          avgOrderValue,
          completedOrders: completedBills.length,
          pendingOrders: pendingBills.length,
          topProduct: topProducts[0] || null,
        });

        setRecentProducts(newestProducts.slice(0, 5));
        setTopSellingProducts(topProducts);

        setChartData({
          weekly: getRevenuePerDayOfWeek(bills),
          monthly: getRevenuePerMonth(bills),
          hourly: getRevenuePerHour(bills),
          paymentMethods: paymentDist,
        });
      } catch (error) {
        if (!isMounted) return;
        console.error("Lỗi khi tải dữ liệu thống kê:", error);
      } finally {
        if (isMounted) {
          setTimeout(() => setLoading(false), 1500);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==================== FORMAT HELPERS ====================
  const formatCompactPrice = (price) => {
    if (price >= 1_000_000_000)
      return `${(price / 1_000_000_000).toFixed(1)}B`;
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
    return price.toString();
  };

  const formatFullPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  // ==================== STATS CARDS ====================
  const statisticsCardsData = [
    {
      title: "Doanh thu hôm nay",
      value: formatFullPrice(stats.totalRevenueToday),
      icon: BanknotesIcon,
      gradient: "from-[#8B5E3C] to-[#6d4c41]",
      badge: "+12%",
      badgeColor: "text-green-600 bg-green-50 border-green-200",
      footer: "so với hôm qua",
      progress: 75,
    },
    {
      title: "Đơn hàng hoàn thành",
      value: stats.completedOrders,
      unit: "đơn",
      icon: CheckCircleIcon,
      gradient: "from-green-500 to-emerald-600",
      badge: `${stats.pendingOrders} chờ`,
      badgeColor: "text-amber-700 bg-amber-50 border-amber-200",
      footer: "đơn đang xử lý",
      progress:
        stats.totalBills > 0
          ? (stats.completedOrders / stats.totalBills) * 100
          : 0,
    },
    {
      title: "Giá trị TB/Đơn",
      value: formatCompactPrice(stats.avgOrderValue),
      unit: "VNĐ",
      icon: CurrencyDollarIcon,
      gradient: "from-blue-500 to-indigo-600",
      badge: "+8%",
      badgeColor: "text-green-600 bg-green-50 border-green-200",
      footer: "so với tuần trước",
      progress: 65,
    },
    {
      title: "Tổng doanh thu",
      value: formatCompactPrice(stats.totalRevenueAll),
      unit: "VNĐ",
      icon: ChartBarIcon,
      gradient: "from-purple-500 to-fuchsia-600",
      badge: "+15%",
      badgeColor: "text-green-600 bg-green-50 border-green-200",
      footer: "so với tháng trước",
      progress: 88,
    },
  ];

  // ==================== CHARTS ====================
  const statisticsChartsData = [
    {
      title: "Doanh thu theo ngày",
      description: "Hiệu suất tuần này",
      footer: "Cập nhật hôm nay",
      icon: CalendarDaysIcon,
      chart: {
        type: "bar",
        height: 240,
        series: [
          {
            name: "Doanh thu",
            data: chartData.weekly.length
              ? chartData.weekly
              : [0, 0, 0, 0, 0, 0, 0],
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#8B5E3C"],
          plotOptions: {
            bar: { columnWidth: "40%", borderRadius: 8 },
          },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
          },
        },
      },
    },
    {
      title: "Doanh thu theo tháng",
      description: `Năm ${dayjs().year()}`,
      footer: "Cập nhật theo năm",
      icon: ChartBarIcon,
      chart: {
        type: "line",
        height: 240,
        series: [
          {
            name: "Doanh thu",
            data: chartData.monthly.length
              ? chartData.monthly
              : Array(12).fill(0),
          },
        ],
        options: {
          ...chartsConfig,
          colors: ["#C89F77"],
          stroke: { lineCap: "round", curve: "smooth", width: 3 },
          markers: { size: 6 },
          xaxis: {
            ...chartsConfig.xaxis,
            categories: [
              "T1",
              "T2",
              "T3",
              "T4",
              "T5",
              "T6",
              "T7",
              "T8",
              "T9",
              "T10",
              "T11",
              "T12",
            ],
          },
        },
      },
    },
  ];

  // ==================== LOADER ====================
  if (loading) {
    return (
      <CoffeeLoader
        title="Đang pha chế dashboard"
        subtitle="Vui lòng chờ trong giây lát"
      />
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8 2xl:py-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 flex flex-col gap-6 lg:gap-8">
        {/* ===== Page Header ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 2xl:w-16 2xl:h-16 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg shadow-[#8B5E3C]/30 flex-shrink-0"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <SparklesIcon className="w-6 h-6 2xl:w-8 2xl:h-8 text-white" />
            </motion.div>
            <div>
              <Typography
                variant="h4"
                className="font-extrabold text-[#4e342e] tracking-tight text-2xl lg:text-3xl 2xl:text-4xl"
              >
                Dashboard Coffee Shop
              </Typography>
              <Typography className="text-xs lg:text-sm text-[#8B5E3C] font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Tổng quan doanh thu và hoạt động kinh doanh
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-amber-100 shadow-sm">
              <CalendarDaysIcon className="w-4 h-4 text-[#8B5E3C]" />
              <Typography className="text-xs font-bold text-[#4e342e]">
                {dayjs().format("DD/MM/YYYY")}
              </Typography>
            </div>
            <button className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-lg shadow-[#8B5E3C]/30">
              <ArrowPathIcon className="w-5 h-5" strokeWidth={2.5} />
            </button>
          </div>
        </motion.div>

        {/* ===== Stats Cards (4 cards) ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5"
        >
          {statisticsCardsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.08, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden bg-white rounded-2xl p-5 2xl:p-6 shadow-md hover:shadow-2xl border border-amber-100 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#f5ede3] to-transparent rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative flex items-start justify-between mb-4">
                  <div
                    className={`w-11 h-11 2xl:w-14 2xl:h-14 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      className="w-5 h-5 2xl:w-7 2xl:h-7 text-white"
                      strokeWidth={2.2}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${stat.badgeColor}`}
                  >
                    <ArrowTrendingUpIcon className="w-3 h-3" />
                    <Typography className="text-[10px] font-extrabold">
                      {stat.badge}
                    </Typography>
                  </div>
                </div>

                <div className="relative">
                  <Typography className="text-[10px] 2xl:text-xs font-extrabold uppercase text-gray-400 tracking-[0.15em] mb-1">
                    {stat.title}
                  </Typography>
                  <div className="flex items-end gap-2">
                    <Typography className="text-2xl 2xl:text-3xl font-extrabold text-[#4e342e] leading-none truncate">
                      {stat.value}
                    </Typography>
                    {stat.unit && (
                      <span className="text-[10px] font-semibold text-gray-400 mb-1">
                        {stat.unit}
                      </span>
                    )}
                  </div>
                </div>

                <div className="relative mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      {stat.footer}
                    </Typography>
                    <Typography className="text-[9px] font-extrabold text-[#8B5E3C]">
                      {stat.progress.toFixed(0)}%
                    </Typography>
                  </div>
                  <div className="h-1 rounded-full bg-[#faf6f1] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${stat.gradient}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===== Charts Grid ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {statisticsChartsData.map((chart, index) => {
            const ChartIcon = chart.icon;
            return (
              <motion.div
                key={chart.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
                  {/* Chart Header */}
                  <div className="p-5 lg:p-6 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg shadow-[#8B5E3C]/30">
                        <ChartIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <Typography className="font-bold text-[#4e342e] tracking-wide">
                          {chart.title}
                        </Typography>
                        <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                          {chart.description}
                        </Typography>
                      </div>
                      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[#C89F77]/30">
                        <ClockIcon className="w-3 h-3 text-[#8B5E3C]" />
                        <span className="text-[10px] font-bold text-[#6d4c41]">
                          {chart.footer}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chart Body */}
                  <div className="p-5 lg:p-6">
                    <StatisticsChart {...chart} />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===== Bottom Section ===== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Products */}
          <motion.div
            className="xl:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card className="shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden h-full">
              {/* Header */}
              <div className="p-5 lg:p-6 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                      <CubeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <Typography className="font-bold text-[#4e342e] tracking-wide">
                        Sản phẩm mới nhất
                      </Typography>
                      <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                        {recentProducts.length} sản phẩm gần đây
                      </Typography>
                    </div>
                  </div>
                  <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#faf6f1] border border-[#C89F77]/30 hover:border-[#8B5E3C]/60 text-[#6d4c41] text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 hover:bg-[#8B5E3C] hover:text-white">
                    Xem tất cả
                    <ArrowRightIcon className="w-3 h-3" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full table-fixed min-w-[600px]">
                  <colgroup><col className="w-[40%]" /><col className="w-[18%]" /><col className="w-[22%]" /><col className="w-[20%]" /></colgroup>
                  <thead>
                    <tr className="bg-[#faf6f1] border-b border-amber-100">
                      {["Sản phẩm", "Tồn kho", "Giá bán", "Trạng thái"].map(
                        (el) => (
                          <th key={el} className="py-3 px-4 lg:px-6 text-left">
                            <Typography className="text-[10px] font-extrabold uppercase text-[#6d4c41] tracking-wider">
                              {el}
                            </Typography>
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {recentProducts.length > 0 ? (
                      recentProducts.map((product, index) => (
                        <motion.tr
                          key={product.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          className="group hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] border-b border-amber-50 transition-all duration-200"
                        >
                          <td className="py-3 px-4 lg:px-6">
                            <div className="flex items-center gap-3 min-w-0">
                              <img
                                src={
                                  product.imageUrl
                                    ? product.imageUrl.startsWith("http")
                                      ? product.imageUrl
                                      : `http://localhost:8080/api/products/image/${product.imageUrl}`
                                    : "https://via.placeholder.com/80"
                                }
                                alt={product.name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "https://via.placeholder.com/80";
                                }}
                                className="w-10 h-10 rounded-xl object-cover shadow-md border-2 border-white ring-2 ring-amber-100 group-hover:ring-[#8B5E3C]/40 transition-all duration-300 flex-shrink-0"
                              />
                              <Typography className="text-xs font-bold text-[#4e342e] group-hover:text-[#8B5E3C] transition-colors truncate">
                                {product.name}
                              </Typography>
                            </div>
                          </td>
                          <td className="py-3 px-4 lg:px-6">
                            <Chip
                              value={
                                product.stockQuantity !== undefined
                                  ? `${product.stockQuantity} sp`
                                  : "N/A"
                              }
                              className="bg-[#faf6f1] text-[#6d4c41] border border-[#C89F77]/30 text-[10px] font-bold w-fit"
                              size="sm"
                            />
                          </td>
                          <td className="py-3 px-4 lg:px-6">
                            <Typography className="text-xs font-extrabold text-[#8B5E3C] truncate">
                              {product.price?.toLocaleString()}₫
                            </Typography>
                          </td>
                          <td className="py-3 px-4 lg:px-6">
                            <Chip
                              value={
                                product.isActive ? "Đang bán" : "Ngưng bán"
                              }
                              className={`text-[10px] font-bold w-fit ${
                                product.isActive
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                              }`}
                              size="sm"
                            />
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-12">
                          <Typography className="text-xs text-gray-400 italic">
                            Chưa có sản phẩm nào
                          </Typography>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* Top Selling Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Card className="shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden h-full">
              {/* Header */}
              <div className="p-5 lg:p-6 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <FireIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Typography className="font-bold text-[#4e342e] tracking-wide">
                      Top bán chạy
                    </Typography>
                    <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                      5 sản phẩm doanh số cao nhất
                    </Typography>
                  </div>
                </div>
              </div>

              {/* List */}
              <CardBody className="p-3 lg:p-4">
                {topSellingProducts.length > 0 ? (
                  <div className="space-y-2">
                    {topSellingProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.08 }}
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] border border-transparent hover:border-[#C89F77]/30 transition-all duration-200"
                      >
                        {/* Rank badge */}
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-xs shadow-sm ${
                            index === 0
                              ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                              : index === 1
                              ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                              : index === 2
                              ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                              : "bg-[#faf6f1] text-[#6d4c41] border border-[#C89F77]/30"
                          }`}
                        >
                          #{index + 1}
                        </div>

                        {/* Image */}
                        <img
                          src={
                            product.imageUrl
                              ? product.imageUrl.startsWith("http")
                                ? product.imageUrl
                                : `http://localhost:8080/api/products/image/${product.imageUrl}`
                              : "https://via.placeholder.com/80"
                          }
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/80";
                          }}
                          className="w-10 h-10 rounded-xl object-cover shadow-md border-2 border-white ring-2 ring-amber-100 flex-shrink-0"
                        />

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Typography className="text-xs font-bold text-[#4e342e] truncate">
                            {product.name || "Sản phẩm"}
                          </Typography>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px]">☕</span>
                            <Typography className="text-[10px] font-semibold text-gray-500">
                              Đã bán {product.soldQuantity} ly
                            </Typography>
                          </div>
                        </div>

                        {/* Revenue */}
                        <Typography className="text-xs font-extrabold text-green-600 flex-shrink-0">
                          {formatCompactPrice(product.revenue)}
                        </Typography>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-3">
                      <span className="text-3xl">☕</span>
                    </div>
                    <Typography className="text-xs text-gray-400 italic">
                      Chưa có dữ liệu bán hàng
                    </Typography>
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* ===== Info Note ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <SparklesIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Ghi chú:</span> Đây là dashboard tổng
            quan của hệ thống Coffee Shop. Dữ liệu được cập nhật tự động theo
            thời gian thực. Vui lòng refresh trang để xem số liệu mới nhất.
          </Typography>
        </motion.div>
      </div>
    </div>
  );
}

export default Home;
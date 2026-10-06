import { useState, useEffect, useMemo } from "react";
import {
  Card,
  Typography,
  Button,
  Chip,
  Avatar,
} from "@material-tailwind/react";
import {
  StarIcon,
  ChatBubbleLeftRightIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  SparklesIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChartBarIcon,
  ChartPieIcon,
  PresentationChartLineIcon,
  TrophyIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  HeartIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  RadialBarChart,
  RadialBar,
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
import { CoffeeLoader } from "@/widgets/loaders";
import Swal from "sweetalert2";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#f97316", "#ef4444"];

// Mock data đánh giá (sau này thay bằng API)
const MOCK_REVIEWS = [
  {
    id: 1,
    customerName: "Lan Anh",
    customerAvatar: null,
    rating: 5,
    content: "Cà phê Latte đậm vị, phục vụ tuyệt vời! Nhân viên rất thân thiện và chu đáo.",
    productName: "Cà phê Latte",
    createdAt: dayjs().subtract(2, "hour").toISOString(),
    status: "PUBLISHED",
    likes: 12,
    replies: 0,
  },
  {
    id: 2,
    customerName: "Nam Nguyễn",
    customerAvatar: null,
    rating: 5,
    content: "Không gian yên tĩnh, rất thích hợp làm việc. Wifi mạnh, ổ cắm đầy đủ.",
    productName: "Cà phê sữa đá",
    createdAt: dayjs().subtract(5, "hour").toISOString(),
    status: "PUBLISHED",
    likes: 8,
    replies: 0,
  },
  {
    id: 3,
    customerName: "Minh Hoàng",
    customerAvatar: null,
    rating: 4,
    content: "Mùi cà phê rang rất đặc trưng, tôi sẽ quay lại. Chỉ hơi đông vào giờ cao điểm.",
    productName: "Cà phê Espresso",
    createdAt: dayjs().subtract(1, "day").toISOString(),
    status: "PUBLISHED",
    likes: 5,
    replies: 1,
  },
  {
    id: 4,
    customerName: "Thu Hà",
    customerAvatar: null,
    rating: 5,
    content: "Bánh ngọt ở đây ngon tuyệt! Nhất định sẽ giới thiệu bạn bè.",
    productName: "Croissant",
    createdAt: dayjs().subtract(1, "day").toISOString(),
    status: "PUBLISHED",
    likes: 15,
    replies: 0,
  },
  {
    id: 5,
    customerName: "Đức Anh",
    customerAvatar: null,
    rating: 3,
    content: "Đồ uống ổn nhưng thời gian chờ hơi lâu. Cần cải thiện tốc độ phục vụ.",
    productName: "Cà phê Mocha",
    createdAt: dayjs().subtract(2, "day").toISOString(),
    status: "PUBLISHED",
    likes: 3,
    replies: 1,
  },
  {
    id: 6,
    customerName: "Mai Linh",
    customerAvatar: null,
    rating: 5,
    content: "Nhân viên dễ thương, đồ uống ngon. Sẽ ủng hộ quán dài dài!",
    productName: "Trà đào cam sả",
    createdAt: dayjs().subtract(3, "day").toISOString(),
    status: "PUBLISHED",
    likes: 9,
    replies: 0,
  },
  {
    id: 7,
    customerName: "Văn Hùng",
    customerAvatar: null,
    rating: 2,
    content: "Cà phê hôm nay hơi nhạt so với lần trước. Mong quán chú ý chất lượng.",
    productName: "Cà phê đen",
    createdAt: dayjs().subtract(4, "day").toISOString(),
    status: "PENDING",
    likes: 1,
    replies: 0,
  },
  {
    id: 8,
    customerName: "Hồng Nhung",
    customerAvatar: null,
    rating: 5,
    content: "Quán đẹp, view xịn, chụp hình sống ảo cực chất! Cà phê cũng ngon.",
    productName: "Cà phê muối",
    createdAt: dayjs().subtract(5, "day").toISOString(),
    status: "PUBLISHED",
    likes: 22,
    replies: 0,
  },
];

const STATUS_CONFIG = {
  PUBLISHED: {
    label: "Đã đăng",
    icon: CheckBadgeIcon,
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
  PENDING: {
    label: "Chờ duyệt",
    icon: ClockIcon,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },
  HIDDEN: {
    label: "Đã ẩn",
    icon: XCircleIcon,
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-600",
  },
};

export function Reviews() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // ==================== FETCH ====================
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReviews(MOCK_REVIEWS);
      setLoading(false);
    }, 1200);
  }, []);

  // ==================== FILTER ====================
  const filteredReviews = useMemo(() => {
    let result = [...reviews];

    // Filter rating
    if (ratingFilter !== "ALL") {
      result = result.filter((r) => r.rating === parseInt(ratingFilter));
    }

    // Filter status
    if (statusFilter !== "ALL") {
      result = result.filter((r) => r.status === statusFilter);
    }

    // Search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (r) =>
          r.customerName?.toLowerCase().includes(term) ||
          r.content?.toLowerCase().includes(term) ||
          r.productName?.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix());
    } else if (sortBy === "oldest") {
      result.sort((a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix());
    } else if (sortBy === "rating-high") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "rating-low") {
      result.sort((a, b) => a.rating - b.rating);
    } else if (sortBy === "likes") {
      result.sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [reviews, ratingFilter, statusFilter, searchTerm, sortBy]);

  // ==================== STATS ====================
  const stats = useMemo(() => {
    const total = reviews.length;
    const avgRating =
      total > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / total
        : 0;

    const published = reviews.filter((r) => r.status === "PUBLISHED").length;
    const pending = reviews.filter((r) => r.status === "PENDING").length;
    const hidden = reviews.filter((r) => r.status === "HIDDEN").length;

    const positive = reviews.filter((r) => r.rating >= 4).length;
    const negative = reviews.filter((r) => r.rating <= 2).length;
    const neutral = total - positive - negative;

    // Tỉ lệ hài lòng
    const satisfactionRate = total > 0 ? (positive / total) * 100 : 0;

    // Phân bố rating
    const ratingDistribution = {
      1: reviews.filter((r) => r.rating === 1).length,
      2: reviews.filter((r) => r.rating === 2).length,
      3: reviews.filter((r) => r.rating === 3).length,
      4: reviews.filter((r) => r.rating === 4).length,
      5: reviews.filter((r) => r.rating === 5).length,
    };

    // Đánh giá hôm nay
    const today = dayjs().format("YYYY-MM-DD");
    const todayReviews = reviews.filter(
      (r) => dayjs(r.createdAt).format("YYYY-MM-DD") === today
    ).length;

    // Tổng lượt thích
    const totalLikes = reviews.reduce((s, r) => s + r.likes, 0);

    // Tổng phản hồi
    const totalReplies = reviews.reduce((s, r) => s + r.replies, 0);

    return {
      total,
      avgRating,
      published,
      pending,
      hidden,
      positive,
      negative,
      neutral,
      satisfactionRate,
      ratingDistribution,
      todayReviews,
      totalLikes,
      totalReplies,
    };
  }, [reviews]);

  // ==================== CHART DATA ====================
  // Rating Distribution (Bar)
  const ratingDistributionData = useMemo(() => {
    return Object.entries(stats.ratingDistribution).map(([rating, count]) => ({
      rating: `${rating}⭐`,
      count,
      ratingNum: parseInt(rating),
    }));
  }, [stats.ratingDistribution]);

  // Status Pie
  const statusPieData = useMemo(() => {
    return [
      { name: "Đã đăng", value: stats.published, color: "#22c55e" },
      { name: "Chờ duyệt", value: stats.pending, color: "#f59e0b" },
      { name: "Đã ẩn", value: stats.hidden, color: "#6b7280" },
    ].filter((d) => d.value > 0);
  }, [stats]);

  // Reviews by day (30 days)
  const dailyReviews = useMemo(() => {
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const date = dayjs().subtract(i, "day");
      const dateStr = date.format("YYYY-MM-DD");
      const dayReviews = reviews.filter(
        (r) => dayjs(r.createdAt).format("YYYY-MM-DD") === dateStr
      );
      const avgRating =
        dayReviews.length > 0
          ? dayReviews.reduce((s, r) => s + r.rating, 0) / dayReviews.length
          : 0;

      result.push({
        date: date.format("DD/MM"),
        reviews: dayReviews.length,
        avgRating: parseFloat(avgRating.toFixed(1)),
      });
    }
    return result;
  }, [reviews]);

  // Radar theo khía cạnh (mock)
  const aspectRadarData = useMemo(() => {
    return [
      { aspect: "Chất lượng", score: 4.6 },
      { aspect: "Phục vụ", score: 4.8 },
      { aspect: "Không gian", score: 4.5 },
      { aspect: "Giá cả", score: 4.2 },
      { aspect: "Tốc độ", score: 3.9 },
      { aspect: "Vệ sinh", score: 4.7 },
    ];
  }, []);

  // Radial - Satisfaction
  const satisfactionRadial = useMemo(() => {
    return [
      {
        name: "Hài lòng",
        value: stats.satisfactionRate,
        fill: "#22c55e",
      },
    ];
  }, [stats.satisfactionRate]);

  // ==================== FORMAT ====================
  const formatDate = (date) => {
    return dayjs(date).fromNow();
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <StarIcon
            key={s}
            className={`w-3.5 h-3.5 ${
              s <= rating
                ? "text-amber-500 fill-amber-500"
                : "text-gray-300 fill-gray-100"
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-amber-600";
    return "text-red-600";
  };

  // ==================== ACTIONS ====================
  const handleApprove = (reviewId) => {
    Swal.fire({
      title: "Duyệt đánh giá?",
      text: "Đánh giá sẽ được hiển thị công khai.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8B5E3C",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Duyệt",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, status: "PUBLISHED" } : r
          )
        );
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Đã duyệt!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleHide = (reviewId) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: "HIDDEN" } : r))
    );
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Đã ẩn đánh giá!",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleDelete = (reviewId) => {
    Swal.fire({
      title: "Xóa đánh giá?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B5E3C",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Đã xóa!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  // ==================== LOADER ====================
  if (loading) {
    return (
      <CoffeeLoader
        title="Đang pha chế đánh giá"
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
              <StarIcon className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <Typography
                variant="h4"
                className="font-extrabold text-[#4e342e] tracking-tight text-2xl lg:text-3xl"
              >
                Đánh Giá & Feedback
              </Typography>
              <Typography className="text-xs lg:text-sm text-[#8B5E3C] font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Lắng nghe khách hàng — Nâng cao chất lượng dịch vụ
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
            >
              <PaperAirplaneIcon className="h-4 w-4" strokeWidth={2.5} />
              Gửi khảo sát
            </Button>
          </div>
        </motion.div>

        {/* ===== KPI CARDS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              title: "Tổng đánh giá",
              value: stats.total,
              unit: "review",
              icon: ChatBubbleLeftRightIcon,
              gradient: "from-[#8B5E3C] to-[#6d4c41]",
              badge: `+${stats.todayReviews} hôm nay`,
            },
            {
              title: "Điểm trung bình",
              value: stats.avgRating.toFixed(1),
              unit: "/ 5",
              icon: StarIcon,
              gradient: "from-amber-500 to-orange-600",
              badge: "Rating",
            },
            {
              title: "Tỉ lệ hài lòng",
              value: `${stats.satisfactionRate.toFixed(0)}%`,
              icon: FaceSmileIcon,
              gradient: "from-green-500 to-emerald-600",
              badge: `${stats.positive} tích cực`,
            },
            {
              title: "Chờ duyệt",
              value: stats.pending,
              unit: "review",
              icon: ClockIcon,
              gradient: "from-blue-500 to-indigo-600",
              badge: `${stats.hidden} đã ẩn`,
            },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
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

        {/* ===== RATING DISTRIBUTION + SATISFACTION ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5"
        >
          {/* Satisfaction Overview */}
          <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg">
                <TrophyIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <Typography className="font-extrabold text-[#4e342e] text-sm">
                  Tổng quan hài lòng
                </Typography>
                <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                  Phân bố theo mức sao
                </Typography>
              </div>
            </div>

            {/* Overall Rating */}
            <div className="flex items-center gap-6 mb-5 p-4 rounded-2xl bg-gradient-to-br from-[#faf6f1] to-[#f5ede3] border border-[#C89F77]/20">
              <div className="text-center">
                <Typography className="text-5xl font-extrabold text-[#4e342e] leading-none">
                  {stats.avgRating.toFixed(1)}
                </Typography>
                <div className="flex items-center justify-center gap-0.5 mt-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <StarIcon
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(stats.avgRating)
                          ? "text-amber-500 fill-amber-500"
                          : "text-gray-300 fill-gray-100"
                      }`}
                    />
                  ))}
                </div>
                <Typography className="text-[10px] font-bold text-gray-500 mt-1.5">
                  {stats.total} đánh giá
                </Typography>
              </div>

              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((r) => {
                  const count = stats.ratingDistribution[r] || 0;
                  const percent = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <button
                      key={r}
                      onClick={() =>
                        setRatingFilter(ratingFilter === r.toString() ? "ALL" : r.toString())
                      }
                      className="w-full group/bar flex items-center gap-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="flex items-center gap-1 w-12">
                        <Typography className="text-xs font-bold text-[#4e342e]">
                          {r}
                        </Typography>
                        <StarIcon className="w-3 h-3 text-amber-500 fill-amber-500" />
                      </div>
                      <div className="flex-1 h-2 rounded-full bg-[#faf6f1] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + (5 - r) * 0.05 }}
                          className={`h-full rounded-full ${
                            r >= 4
                              ? "bg-gradient-to-r from-green-400 to-emerald-500"
                              : r === 3
                              ? "bg-gradient-to-r from-amber-400 to-orange-500"
                              : "bg-gradient-to-r from-red-400 to-rose-500"
                          }`}
                        />
                      </div>
                      <Typography className="text-[10px] font-extrabold text-[#8B5E3C] w-10 text-right">
                        {count}
                      </Typography>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Positive / Neutral / Negative */}
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "Tích cực",
                  value: stats.positive,
                  icon: HandThumbUpIcon,
                  gradient: "from-green-500 to-emerald-600",
                  emoji: "😊",
                },
                {
                  label: "Trung bình",
                  value: stats.neutral,
                  icon: ChatBubbleOvalLeftEllipsisIcon,
                  gradient: "from-amber-500 to-orange-600",
                  emoji: "😐",
                },
                {
                  label: "Tiêu cực",
                  value: stats.negative,
                  icon: HandThumbDownIcon,
                  gradient: "from-red-500 to-rose-600",
                  emoji: "😞",
                },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className={`p-3 rounded-xl bg-gradient-to-br ${s.gradient} relative overflow-hidden`}
                  >
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
                    <Icon className="w-4 h-4 text-white mb-1.5" />
                    <Typography className="text-[9px] font-extrabold text-white/80 uppercase tracking-wider">
                      {s.emoji} {s.label}
                    </Typography>
                    <Typography className="text-lg font-extrabold text-white leading-none mt-0.5">
                      {s.value}
                    </Typography>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Radial Satisfaction */}
          <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <HeartIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <Typography className="font-extrabold text-[#4e342e] text-sm">
                  Điểm hài lòng
                </Typography>
                <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                  Tỷ lệ tích cực
                </Typography>
              </div>
            </div>
            <div className="h-64 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="65%"
                  outerRadius="100%"
                  data={satisfactionRadial}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: "#f5ede3" }}
                    dataKey="value"
                    cornerRadius={15}
                    fill="#22c55e"
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <Typography className="text-4xl font-extrabold text-[#4e342e] leading-none">
                  {stats.satisfactionRate.toFixed(0)}%
                </Typography>
                <Typography className="text-[10px] font-bold text-[#8B5E3C] uppercase tracking-widest mt-1">
                  Hài lòng
                </Typography>
                <div className="flex items-center gap-0.5 mt-1.5">
                  <FaceSmileIcon className="w-4 h-4 text-green-600" />
                  <Typography className="text-[10px] font-bold text-green-600">
                    {stats.positive}/{stats.total}
                  </Typography>
                </div>
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
            Phân tích đánh giá
          </Typography>
        </motion.div>

        {/* ===== CHARTS ROW ===== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Daily Reviews Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="xl:col-span-2"
          >
            <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <PresentationChartLineIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">
                    Xu hướng đánh giá 30 ngày
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    Số lượng & điểm trung bình
                  </Typography>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyReviews}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" vertical={false} />
                    <XAxis
                      dataKey="date"
                      stroke="#a4714b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      yAxisId="left"
                      stroke="#a4714b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#a4714b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 5]}
                    />
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #C89F77",
                        borderRadius: "12px",
                        fontSize: "12px",
                        boxShadow: "0 4px 12px rgba(139, 94, 60, 0.15)",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "11px", color: "#6d4c41" }}
                      iconType="circle"
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="reviews"
                      name="Số đánh giá"
                      stroke="#8B5E3C"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#8B5E3C" }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgRating"
                      name="Điểm TB"
                      stroke="#f59e0b"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: "#f59e0b" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Status Pie */}
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
                    Trạng thái đánh giá
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
                      data={
                        statusPieData.length
                          ? statusPieData
                          : [{ name: "Chưa có", value: 1 }]
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusPieData.map((entry, i) => (
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
                      formatter={(v, n) => [`${v} đánh giá`, n]}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: "10px", color: "#6d4c41" }}
                      iconType="circle"
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ===== ASPECT RADAR ===== */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <ChartBarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">
                    Đánh giá theo khía cạnh
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    Chất lượng dịch vụ
                  </Typography>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={aspectRadarData}>
                    <PolarGrid stroke="#e8d9c7" />
                    <PolarAngleAxis
                      dataKey="aspect"
                      tick={{ fontSize: 10, fill: "#6d4c41" }}
                    />
                    <PolarRadiusAxis
                      tick={{ fontSize: 9, fill: "#a4714b" }}
                      axisLine={false}
                      domain={[0, 5]}
                    />
                    <Radar
                      name="Điểm"
                      dataKey="score"
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
                      formatter={(v) => [`${v}/5`, "Điểm"]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Rating Distribution Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Card className="p-5 rounded-3xl border border-amber-100 shadow-xl bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <StarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <Typography className="font-extrabold text-[#4e342e] text-sm">
                    Phân bố theo số sao
                  </Typography>
                  <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                    1 ⭐ → 5 ⭐
                  </Typography>
                </div>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ratingDistributionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f5ede3" vertical={false} />
                    <XAxis
                      dataKey="rating"
                      stroke="#a4714b"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#a4714b"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ReTooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #C89F77",
                        borderRadius: "12px",
                        fontSize: "12px",
                      }}
                      formatter={(v) => [`${v} đánh giá`, "Số lượng"]}
                      cursor={{ fill: "#faf6f1" }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {ratingDistributionData.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={
                            entry.ratingNum >= 4
                              ? "#22c55e"
                              : entry.ratingNum === 3
                              ? "#f59e0b"
                              : "#ef4444"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* ===== FILTER BAR ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-3"
        >
          <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
          <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
            Danh sách đánh giá
          </Typography>
          <span className="ml-auto text-[10px] font-extrabold text-[#8B5E3C] bg-white border border-[#C89F77]/30 px-2.5 py-1 rounded-lg">
            {filteredReviews.length} đánh giá
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-white border border-amber-100 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-[#8B5E3C]" />
            <Typography className="text-[11px] font-extrabold uppercase tracking-widest text-[#6d4c41]">
              Lọc:
            </Typography>
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-xs font-bold text-[#6d4c41] focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40 cursor-pointer"
          >
            <option value="ALL">⭐ Tất cả mức sao</option>
            <option value="5">5 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="1">1 ⭐</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-xs font-bold text-[#6d4c41] focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40 cursor-pointer"
          >
            <option value="ALL">📋 Tất cả trạng thái</option>
            <option value="PUBLISHED">✅ Đã đăng</option>
            <option value="PENDING">⏳ Chờ duyệt</option>
            <option value="HIDDEN">🚫 Đã ẩn</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-xs font-bold text-[#6d4c41] focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40 cursor-pointer"
          >
            <option value="newest">🆕 Mới nhất</option>
            <option value="oldest">📅 Cũ nhất</option>
            <option value="rating-high">⭐ Sao cao → thấp</option>
            <option value="rating-low">⭐ Sao thấp → cao</option>
            <option value="likes">❤️ Nhiều like</option>
          </select>

          <div className="relative flex-1 min-w-[200px] md:ml-auto">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]" />
            <input
              type="text"
              placeholder="Tìm khách hàng, nội dung, sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-xs font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40"
            />
          </div>
        </motion.div>

        {/* ===== REVIEW CARDS GRID ===== */}
        {filteredReviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-amber-100 shadow-lg p-16"
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-3">
                <span className="text-4xl">⭐</span>
              </div>
              <Typography className="text-sm font-bold text-[#8B5E3C] mb-1">
                Không có đánh giá nào
              </Typography>
              <Typography className="text-xs text-gray-400">
                Thử thay đổi bộ lọc
              </Typography>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredReviews.map((review, i) => {
              const cfg = STATUS_CONFIG[review.status] || STATUS_CONFIG.PUBLISHED;
              const StatusIcon = cfg.icon;

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <Card
                    className={`p-5 rounded-2xl border-2 bg-white shadow-md hover:shadow-xl transition-all duration-300 h-full ${
                      review.rating >= 4
                        ? "border-green-100 hover:border-green-300"
                        : review.rating === 3
                        ? "border-amber-100 hover:border-amber-300"
                        : "border-red-100 hover:border-red-300"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-white text-sm shadow-md flex-shrink-0 ${
                            review.rating >= 4
                              ? "bg-gradient-to-br from-green-500 to-emerald-600"
                              : review.rating === 3
                              ? "bg-gradient-to-br from-amber-500 to-orange-600"
                              : "bg-gradient-to-br from-red-500 to-rose-600"
                          }`}
                        >
                          {review.customerName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <Typography className="text-sm font-extrabold text-[#4e342e] truncate">
                            {review.customerName}
                          </Typography>
                          <Typography className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {formatDate(review.createdAt)}
                          </Typography>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border text-[9px] font-extrabold uppercase tracking-wider whitespace-nowrap ${cfg.bg} ${cfg.border} ${cfg.text}`}
                      >
                        <StatusIcon className="w-3 h-3" strokeWidth={2.5} />
                        {cfg.label}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      {renderStars(review.rating)}
                      <span
                        className={`text-xs font-extrabold ${getRatingColor(
                          review.rating
                        )}`}
                      >
                        {review.rating}.0
                      </span>
                    </div>

                    {/* Content */}
                    <Typography className="text-xs text-gray-700 leading-relaxed mb-3 line-clamp-3">
                      "{review.content}"
                    </Typography>

                    {/* Product tag */}
                    <div className="mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#faf6f1] to-[#f5ede3] border border-[#C89F77]/30">
                        <span className="text-[10px]">☕</span>
                        <Typography className="text-[10px] font-bold text-[#6d4c41] truncate">
                          {review.productName}
                        </Typography>
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-amber-50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <HeartIcon className="w-3.5 h-3.5 text-red-500" />
                          <Typography className="text-[10px] font-bold text-gray-500">
                            {review.likes}
                          </Typography>
                        </div>
                        <div className="flex items-center gap-1">
                          <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 text-blue-500" />
                          <Typography className="text-[10px] font-bold text-gray-500">
                            {review.replies}
                          </Typography>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {review.status === "PENDING" && (
                          <button
                            onClick={() => handleApprove(review.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center bg-green-50 hover:bg-green-500 text-green-600 hover:text-white border border-green-200 transition-all duration-200"
                            title="Duyệt"
                          >
                            <CheckBadgeIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                        )}
                        {review.status === "PUBLISHED" && (
                          <button
                            onClick={() => handleHide(review.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center bg-amber-50 hover:bg-amber-500 text-amber-600 hover:text-white border border-amber-200 transition-all duration-200"
                            title="Ẩn"
                          >
                            <XCircleIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center bg-red-50 hover:bg-red-500 text-red-600 hover:text-white border border-red-200 transition-all duration-200"
                          title="Xóa"
                        >
                          <XCircleIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ===== INFO NOTE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <SparklesIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Ghi chú:</span> Trang Đánh Giá & Feedback
            giúp theo dõi ý kiến khách hàng, phân tích mức độ hài lòng, và quản
            lý đánh giá. Bạn có thể duyệt, ẩn hoặc xóa đánh giá không phù hợp.
            Điểm trung bình và tỉ lệ hài lòng được tính tự động.
          </Typography>
        </motion.div>
      </div>
    </div>
  );
}

export default Reviews;
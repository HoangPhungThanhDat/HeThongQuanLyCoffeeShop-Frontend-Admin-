// src/pages/dashboard/category/components/CategoryStats.jsx
import { Typography } from "@material-tailwind/react";
import {
  FolderIcon,
  CheckBadgeIcon,
  XMarkIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { calcPercent } from "../utils/formatters";

// ==================== STAT CARD ====================
const COLOR_MAP = {
  brown: {
    bg: "from-[#8B5E3C] to-[#6d4c41]",
    shadow: "shadow-[#8B5E3C]/30",
    border: "border-amber-100 hover:border-[#8B5E3C]/30",
    decor: "from-[#f5ede3]",
    progress: "from-[#8B5E3C] to-[#C89F77]",
    badge: "bg-[#faf6f1] border-[#C89F77]/30 text-[#8B5E3C]",
    text: "text-[#4e342e]",
  },
  green: {
    bg: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/30",
    border: "border-green-100 hover:border-green-300",
    decor: "from-green-50",
    progress: "from-green-400 to-emerald-500",
    badge: "bg-green-50 border-green-200 text-green-700",
    text: "text-green-600",
  },
  blue: {
    bg: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/30",
    border: "border-blue-100 hover:border-blue-300",
    decor: "from-blue-50",
    progress: "from-blue-400 to-indigo-500",
    badge: "bg-blue-50 border-blue-200 text-blue-700",
    text: "text-blue-600",
  },
  red: {
    bg: "from-red-500 to-rose-600",
    shadow: "shadow-red-500/30",
    border: "border-red-100 hover:border-red-300",
    decor: "from-red-50",
    progress: "from-red-400 to-rose-500",
    badge: "bg-red-50 border-red-200 text-red-700",
    text: "text-red-600",
  },
};

function StatCard({ icon: Icon, label, value, unit, color = "brown", delay = 0, progress = 100, badgeText }) {
  const c = COLOR_MAP[color];

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden bg-white rounded-2xl p-5 2xl:p-6 shadow-md hover:shadow-2xl border ${c.border} transition-all duration-300`}
    >
      <div
        className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${c.decor} to-transparent rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="relative flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 2xl:w-14 2xl:h-14 rounded-xl bg-gradient-to-br ${c.bg} flex items-center justify-center shadow-lg ${c.shadow} group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
        >
          <Icon className="w-5 h-5 2xl:w-7 2xl:h-7 text-white" strokeWidth={2.2} />
        </div>

        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${c.badge}`}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-current" />
          <Typography className="text-[10px] font-extrabold">
            {badgeText}
          </Typography>
        </div>
      </div>

      <div className="relative">
        <Typography className="text-[10px] 2xl:text-xs font-extrabold uppercase text-gray-400 tracking-[0.15em] mb-1">
          {label}
        </Typography>
        <div className="flex items-end gap-2">
          <Typography className={`text-3xl 2xl:text-4xl font-extrabold leading-none ${c.text}`}>
            {value}
          </Typography>
          <span className="text-[10px] font-semibold text-gray-400 mb-1">
            {unit}
          </span>
        </div>
      </div>

      <div className="relative mt-4 h-1 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay }}
          className={`h-full rounded-full bg-gradient-to-r ${c.progress}`}
        />
      </div>
    </motion.div>
  );
}

// ==================== MAIN ====================
export function CategoryStats({ stats }) {
  const { totalCategories, withDescription, withoutDescription, hasProducts } = stats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5"
    >
      <StatCard
        icon={FolderIcon}
        label="Tổng danh mục"
        value={totalCategories}
        unit="danh mục"
        color="brown"
        delay={0.3}
        progress={100}
        badgeText="+8%"
      />
      <StatCard
        icon={DocumentTextIcon}
        label="Đã mô tả"
        value={withDescription}
        unit="danh mục"
        color="green"
        delay={0.4}
        progress={calcPercent(withDescription, totalCategories)}
        badgeText="Có mô tả"
      />
      <StatCard
        icon={CheckBadgeIcon}
        label="Có sản phẩm"
        value={hasProducts}
        unit="danh mục"
        color="blue"
        delay={0.5}
        progress={calcPercent(hasProducts, totalCategories)}
        badgeText="Đang dùng"
      />
      <StatCard
        icon={XMarkIcon}
        label="Chưa mô tả"
        value={withoutDescription}
        unit="danh mục"
        color="red"
        delay={0.6}
        progress={calcPercent(withoutDescription, totalCategories)}
        badgeText="Thiếu"
      />
    </motion.div>
  );
}

export default CategoryStats;
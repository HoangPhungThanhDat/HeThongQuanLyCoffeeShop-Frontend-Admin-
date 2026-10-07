
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  ShieldCheckIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export const InventoryReportStockStatus = ({
  stats,
  stockFilter,
  onFilterChange,
}) => {
  const cards = [
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
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((s, i) => {
        const Icon = s.icon;
        const isActive = stockFilter === s.filter;

        return (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.06 }}
            whileHover={{ y: -4 }}
            onClick={() => onFilterChange(isActive ? "ALL" : s.filter)}
            className={`group relative overflow-hidden rounded-2xl p-4 shadow-md hover:shadow-xl border-2 transition-all duration-300 text-left ${
              isActive
                ? `bg-gradient-to-br ${s.gradient} border-white/40`
                : "bg-white border-amber-100"
            }`}
          >
            <div className="relative flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isActive ? "bg-white/20" : `bg-gradient-to-br ${s.gradient}`
                }`}
              >
                <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <Typography
                  className={`text-[10px] font-extrabold uppercase tracking-wider ${
                    isActive ? "text-white/80" : "text-gray-400"
                  }`}
                >
                  {s.emoji} {s.label}
                </Typography>
                <Typography
                  className={`text-xl font-extrabold leading-none mt-0.5 ${
                    isActive ? "text-white" : "text-[#4e342e]"
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
  );
};
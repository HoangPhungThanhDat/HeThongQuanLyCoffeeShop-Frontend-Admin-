
import { Typography } from "@material-tailwind/react";
import {
  GiftIcon,
  CheckBadgeIcon,
  ReceiptPercentIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

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

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color = "brown",
  delay = 0,
  progress = 100,
  badgeText,
  badgeIcon: BadgeIcon,
  onClick,
  active,
}) {
  const c = COLOR_MAP[color];

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`group relative overflow-hidden bg-white rounded-2xl p-5 2xl:p-6 shadow-md hover:shadow-2xl border ${c.border} transition-all duration-300 ${
        onClick ? "cursor-pointer" : ""
      } ${active ? "ring-2 ring-offset-2 ring-[#8B5E3C]/40" : ""}`}
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
          {BadgeIcon ? (
            <BadgeIcon className="w-3 h-3" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
          )}
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

export function PromotionsStats({ stats, selectedStatus, onStatusClick }) {
  const {
    totalPromotions,
    runningPromotions,
    activePromotions,
    inactivePromotions,
  } = stats;
  const calc = (val) => (totalPromotions ? (val / totalPromotions) * 100 : 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5"
    >
      <StatCard
        icon={GiftIcon}
        label="Tổng khuyến mãi"
        value={totalPromotions}
        unit="chương trình"
        color="brown"
        delay={0.3}
        progress={100}
        badgeText="Tổng"
        badgeIcon={SparklesIcon}
        onClick={() => onStatusClick("ALL")}
        active={selectedStatus === "ALL"}
      />
      <StatCard
        icon={CheckBadgeIcon}
        label="Đang chạy"
        value={runningPromotions}
        unit="chương trình"
        color="green"
        delay={0.4}
        progress={calc(runningPromotions)}
        badgeText="Đang chạy"
      />
      <StatCard
        icon={ReceiptPercentIcon}
        label="Đang hoạt động"
        value={activePromotions}
        unit="chương trình"
        color="blue"
        delay={0.5}
        progress={calc(activePromotions)}
        badgeText="Hoạt động"
        onClick={() => onStatusClick("ACTIVE")}
        active={selectedStatus === "ACTIVE"}
      />
      <StatCard
        icon={XMarkIcon}
        label="Đã ngừng"
        value={inactivePromotions}
        unit="chương trình"
        color="red"
        delay={0.6}
        progress={calc(inactivePromotions)}
        badgeText="Ngừng"
        onClick={() => onStatusClick("INACTIVE")}
        active={selectedStatus === "INACTIVE"}
      />
    </motion.div>
  );
}

export default PromotionsStats;
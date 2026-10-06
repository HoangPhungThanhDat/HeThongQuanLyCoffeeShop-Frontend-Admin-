
import { Card, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { formatCompact } from "../utils";

export const RevenueGrowthCards = ({ stats, fromDate, toDate }) => {
  const days = dayjs(toDate).diff(fromDate, "day") + 1;
  const prevFrom = dayjs(fromDate).subtract(days, "day").format("DD/MM");
  const prevTo = dayjs(fromDate).subtract(1, "day").format("DD/MM");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {/* Previous period */}
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
              {prevFrom} → {prevTo}
            </Typography>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <BanknotesIcon className="w-6 h-6 text-white" />
          </div>
        </div>
      </Card>

      {/* Growth */}
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
  );
};
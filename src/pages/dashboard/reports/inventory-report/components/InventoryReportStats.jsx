
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  CubeIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/outline";
import { formatCompact } from "../utils";

export const InventoryReportStats = ({ stats }) => {
  const cards = [
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
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((s, i) => {
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
  );
};
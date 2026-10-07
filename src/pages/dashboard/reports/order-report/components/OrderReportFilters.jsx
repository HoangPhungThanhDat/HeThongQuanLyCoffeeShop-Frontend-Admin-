
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { STATUS_CONFIG, TIME_RANGES } from "../constants";

export const OrderReportFilters = ({
  timeRange, setTimeRange,
  statusFilter, setStatusFilter,
  searchTerm, setSearchTerm,
}) => {
  return (
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

      {TIME_RANGES.map((opt) => (
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
  );
};
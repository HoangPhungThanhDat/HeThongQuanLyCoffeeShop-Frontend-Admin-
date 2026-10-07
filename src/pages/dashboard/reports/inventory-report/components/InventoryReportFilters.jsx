
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { SORT_OPTIONS, STOCK_FILTERS } from "../constants";

export const InventoryReportFilters = ({
  categories,
  categoryFilter, setCategoryFilter,
  stockFilter, setStockFilter,
  searchTerm, setSearchTerm,
  sortBy, setSortBy,
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
        {STOCK_FILTERS.map((s) => (
          <option key={s.key} value={s.key}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="px-3 py-2 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-xs font-bold text-[#6d4c41] focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40 cursor-pointer"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.key} value={s.key}>
            {s.label}
          </option>
        ))}
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
  );
};
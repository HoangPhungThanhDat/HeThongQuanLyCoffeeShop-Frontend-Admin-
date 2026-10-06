
import { Button, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { CalendarDaysIcon, FunnelIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { DATE_PRESETS } from "../constants";

export const RevenueDateFilter = ({
  preset,
  fromDate,
  toDate,
  onPresetChange,
  onFromDateChange,
  onToDateChange,
  onApply,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-amber-100 shadow-sm"
    >
      {/* Preset buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 mr-2">
          <FunnelIcon className="w-4 h-4 text-[#8B5E3C]" />
          <Typography className="text-[11px] font-extrabold uppercase tracking-widest text-[#6d4c41]">
            Khoảng thời gian:
          </Typography>
        </div>
        {DATE_PRESETS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => onPresetChange(opt.key)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all duration-200 ${
              preset === opt.key
                ? "bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] text-white shadow-lg shadow-[#8B5E3C]/30"
                : "bg-[#faf6f1] text-[#6d4c41] border border-[#C89F77]/30 hover:border-[#8B5E3C]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Custom date picker */}
      {preset === "custom" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="flex flex-wrap items-end gap-3 pt-3 border-t border-amber-100"
        >
          <div className="flex-1 min-w-[180px]">
            <Typography className="text-[10px] font-extrabold uppercase text-gray-400 tracking-widest mb-1.5">
              Từ ngày
            </Typography>
            <div className="relative">
              <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C] pointer-events-none z-10" />
              <input
                type="date"
                value={fromDate}
                max={toDate}
                onChange={(e) => onFromDateChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-sm font-semibold text-[#4e342e] focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[180px]">
            <Typography className="text-[10px] font-extrabold uppercase text-gray-400 tracking-widest mb-1.5">
              Đến ngày
            </Typography>
            <div className="relative">
              <CalendarDaysIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C] pointer-events-none z-10" />
              <input
                type="date"
                value={toDate}
                min={fromDate}
                max={dayjs().format("YYYY-MM-DD")}
                onChange={(e) => onToDateChange(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30 text-sm font-semibold text-[#4e342e] focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40"
              />
            </div>
          </div>

          <Button
            onClick={onApply}
            className="bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] text-white px-6 py-2.5 rounded-xl normal-case font-bold shadow-md"
          >
            Áp dụng
          </Button>

          <Typography className="text-xs text-[#8B5E3C] font-bold ml-auto">
            📅 {dayjs(fromDate).format("DD/MM/YYYY")} →{" "}
            {dayjs(toDate).format("DD/MM/YYYY")}
          </Typography>
        </motion.div>
      )}

      {/* Display date when not custom */}
      {preset !== "custom" && (
        <div className="flex items-center gap-2 ml-auto px-3 py-2 rounded-xl bg-[#faf6f1] border border-[#C89F77]/30">
          <CalendarDaysIcon className="w-4 h-4 text-[#8B5E3C]" />
          <Typography className="text-xs font-bold text-[#4e342e]">
            {dayjs(fromDate).format("DD/MM/YYYY")} →{" "}
            {dayjs(toDate).format("DD/MM/YYYY")}
          </Typography>
        </div>
      )}
    </motion.div>
  );
};
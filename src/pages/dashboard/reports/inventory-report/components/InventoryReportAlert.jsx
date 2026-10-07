
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { BellAlertIcon } from "@heroicons/react/24/outline";

export const InventoryReportAlert = ({ stats, onViewLow }) => {
  if (stats.outOfStock === 0 && stats.lowStock === 0) return null;

  const isUrgent = stats.outOfStock > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className={`flex items-center gap-3 p-4 rounded-2xl border-2 ${
        isUrgent
          ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-300"
          : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-300"
      }`}
    >
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
          isUrgent ? "bg-red-100" : "bg-amber-100"
        }`}
      >
        <BellAlertIcon
          className={`w-6 h-6 ${isUrgent ? "text-red-600" : "text-amber-600"}`}
          strokeWidth={2.2}
        />
      </div>
      <div className="flex-1">
        <Typography
          className={`text-sm font-extrabold uppercase tracking-wider mb-0.5 ${
            isUrgent ? "text-red-700" : "text-amber-700"
          }`}
        >
          {isUrgent
            ? `⚠️ Cảnh báo: ${stats.outOfStock} sản phẩm đã hết hàng!`
            : `⚠️ Cảnh báo: ${stats.lowStock} sản phẩm sắp hết hàng!`}
        </Typography>
        <Typography
          className={`text-xs leading-relaxed ${
            isUrgent ? "text-red-600" : "text-amber-600"
          }`}
        >
          {isUrgent
            ? `${stats.outOfStock} sản phẩm cần nhập thêm ngay. ${stats.lowStock} sản phẩm khác đang ở mức sắp hết.`
            : "Vui lòng nhập thêm hàng để đảm bảo phục vụ khách hàng."}
        </Typography>
      </div>
      <button
        onClick={onViewLow}
        className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[10px] font-extrabold uppercase tracking-wider transition-all duration-200 hover:scale-105 ${
          isUrgent
            ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
            : "bg-amber-600 text-white border-amber-600 hover:bg-amber-700"
        }`}
      >
        Xem ngay
      </button>
    </motion.div>
  );
};
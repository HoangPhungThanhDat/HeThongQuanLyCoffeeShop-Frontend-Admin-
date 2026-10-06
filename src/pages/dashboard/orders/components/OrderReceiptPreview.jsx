
import { Typography } from "@material-tailwind/react";
import {
  ShoppingCartIcon,
  SparklesIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getStatusConfig } from "../constants/orderStatus";
import { formatPrice } from "../utils/formatters";

/**
 * Preview receipt order — dùng chung create/edit
 */
export function OrderReceiptPreview({
  formData,
  selectedTable,
  selectedEmployee,
  selectedPromotion,
  formattedTotal,
  mode = "create",
  orderId,
}) {
  const statusConfig = getStatusConfig(formData.status);
  const isEditMode = mode === "edit";

  return (
    <>
      <div className="relative group w-full max-w-[300px]">
        {/* Glow */}
        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${statusConfig.gradient} blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300`}
        />

        {/* Receipt Card */}
        <motion.div
          key={formData.status}
          initial={{ scale: 0.95, rotate: -2 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative rounded-2xl bg-white border-2 border-amber-100 shadow-2xl overflow-hidden"
        >
          {/* Top gradient bar */}
          <div className={`h-2 bg-gradient-to-r ${statusConfig.gradient}`} />

          {/* Header */}
          <div className="p-4 bg-gradient-to-br from-[#faf6f1] to-[#f5ede3] border-b border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-md">
                <ShoppingCartIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <Typography className="text-[10px] font-extrabold text-[#8B5E3C]/60 uppercase tracking-widest">
                  Hóa đơn
                </Typography>
                <Typography className="text-xs font-extrabold text-[#4e342e]">
                  {isEditMode ? `Đơn #${orderId}` : "Đơn hàng mới"}
                </Typography>
              </div>
            </div>

            <div className="h-px border-t-2 border-dashed border-[#C89F77]/30 mt-2" />
          </div>

          {/* Body */}
          <div className="p-4 space-y-3">
            {/* Table */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🪑</span>
                <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Bàn
                </Typography>
              </div>
              <Typography className="text-xs font-extrabold text-[#4e342e] truncate max-w-[140px]">
                {selectedTable?.number || "—"}
              </Typography>
            </div>

            {/* Employee */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">👤</span>
                <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Phục vụ
                </Typography>
              </div>
              <Typography className="text-xs font-extrabold text-[#4e342e] truncate max-w-[140px]">
                {selectedEmployee?.fullName || "—"}
              </Typography>
            </div>

            {/* Promotion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🎁</span>
                <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  KM
                </Typography>
              </div>
              <Typography className="text-xs font-extrabold text-[#4e342e] truncate max-w-[140px]">
                {selectedPromotion?.name || "Không"}
              </Typography>
            </div>

            <div className="h-px border-t-2 border-dashed border-[#C89F77]/30 my-2" />

            {/* Status */}
            <div
              className={`flex items-center justify-between p-2 rounded-lg bg-gradient-to-r ${statusConfig.light} border ${statusConfig.border}`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${
                    formData.status === "PENDING" ? "animate-pulse" : ""
                  }`}
                />
                <Typography
                  className={`text-[9px] font-extrabold ${statusConfig.text} uppercase tracking-wider`}
                >
                  {statusConfig.label}
                </Typography>
              </div>
              <span className="text-sm">{statusConfig.emoji}</span>
            </div>

            {/* Total */}
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] shadow-md">
              <Typography className="text-[9px] font-extrabold text-amber-200/80 uppercase tracking-widest text-center">
                Tổng tiền
              </Typography>
              <Typography className="text-base font-extrabold text-white text-center mt-0.5 truncate">
                {formattedTotal || formatPrice(0)}
              </Typography>
            </div>
          </div>

          {/* Bottom wavy edge */}
          <div className="h-2 bg-gradient-to-br from-[#faf6f1] to-[#f5ede3] border-t border-dashed border-[#C89F77]/30" />
        </motion.div>

        {/* Badge */}
        <motion.div
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white z-10"
          animate={{ rotate: isEditMode ? [0, 10, -10, 0] : [0, 15, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          {isEditMode ? (
            <PencilSquareIcon className="h-3.5 w-3.5 text-white" />
          ) : (
            <SparklesIcon className="h-3.5 w-3.5 text-white" />
          )}
        </motion.div>
      </div>

      <div className="mt-4 text-center">
        <Typography className="text-sm font-bold text-[#4e342e]">
          Xem trước hóa đơn
        </Typography>
        <Typography className="text-xs text-gray-500 mt-1">
          Đơn hàng sẽ hiển thị như thế này
        </Typography>
      </div>
    </>
  );
}

export default OrderReceiptPreview;
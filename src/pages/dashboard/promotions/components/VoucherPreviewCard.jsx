
import { Typography } from "@material-tailwind/react";
import {
  GiftIcon,
  SparklesIcon,
  PencilSquareIcon,
  CubeIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { formatDate } from "../utils/formatters";

/**
 * Preview voucher — dùng chung create/edit
 */
export function VoucherPreviewCard({
  name,
  discountDisplay,
  startDate,
  endDate,
  isActive,
  selectedProductsCount = 0,
  mode = "create",
}) {
  const isEditMode = mode === "edit";

  return (
    <>
      <div className="relative group w-full max-w-[300px]">
        {/* Glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#8B5E3C] to-[#C89F77] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />

        {/* Voucher Card */}
        <motion.div
          key={discountDisplay}
          initial={{ scale: 0.95, rotate: -2 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative rounded-2xl bg-gradient-to-br from-[#8B5E3C] via-[#a4714b] to-[#C89F77] shadow-2xl overflow-hidden border-2 border-white/40"
        >
          {/* Decorations */}
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-4 w-20 h-20 rounded-full bg-white/10" />
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
                <GiftIcon className="w-6 h-6 text-white" strokeWidth={2} />
              </div>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                  isActive
                    ? "bg-green-500/90 text-white border border-white/30"
                    : "bg-red-500/90 text-white border border-white/30"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-white ${
                    isActive ? "animate-pulse" : ""
                  }`}
                />
                {isActive ? "Hoạt động" : "Ngừng"}
              </span>
            </div>

            {/* Name */}
            <Typography className="text-[10px] font-bold text-amber-100/80 uppercase tracking-widest mb-1">
              Khuyến mãi
            </Typography>
            <Typography className="text-lg font-extrabold text-white leading-tight mb-4 line-clamp-2 min-h-[2.5rem]">
              {name || "Tên khuyến mãi"}
            </Typography>

            {/* Discount */}
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 mb-4">
              <Typography className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">
                Giảm giá
              </Typography>
              <Typography className="text-3xl font-extrabold text-white leading-none">
                {discountDisplay}
              </Typography>
            </div>

            {/* Dates */}
            <div className="flex items-center gap-2">
              <div className="flex-1 p-2 rounded-xl bg-white/10 border border-white/20">
                <Typography className="text-[8px] font-bold text-white/70 uppercase tracking-wider">
                  Bắt đầu
                </Typography>
                <Typography className="text-xs font-bold text-white mt-0.5">
                  {formatDate(startDate)}
                </Typography>
              </div>
              <div className="flex-1 p-2 rounded-xl bg-white/10 border border-white/20">
                <Typography className="text-[8px] font-bold text-white/70 uppercase tracking-wider">
                  Kết thúc
                </Typography>
                <Typography className="text-xs font-bold text-white mt-0.5">
                  {formatDate(endDate)}
                </Typography>
              </div>
            </div>
          </div>

          {/* Perforated edge */}
          <div
            className="h-3"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 0%, transparent 6px, rgba(255,255,255,0.1) 7px)`,
              backgroundSize: "16px 8px",
              backgroundRepeat: "repeat-x",
            }}
          />
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
          Xem trước voucher
        </Typography>
        <Typography className="text-xs text-gray-500 mt-1">
          {isEditMode
            ? "Voucher sẽ hiển thị như thế này"
            : "Khuyến mãi sẽ hiển thị như thế này"}
        </Typography>
      </div>

      {/* Applied products */}
      {selectedProductsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 w-full max-w-[300px] p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200"
        >
          <div className="flex items-center gap-2 justify-center">
            <CubeIcon className="w-3.5 h-3.5 text-blue-600" />
            <Typography className="text-[10px] font-extrabold text-blue-700 uppercase tracking-wider">
              Áp dụng cho
            </Typography>
          </div>
          <Typography className="text-xs text-blue-700 text-center font-bold mt-1">
            {selectedProductsCount} sản phẩm
          </Typography>
        </motion.div>
      )}
    </>
  );
}

export default VoucherPreviewCard;
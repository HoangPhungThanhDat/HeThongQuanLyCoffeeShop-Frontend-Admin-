
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  GiftIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  CubeIcon,
  XMarkIcon,
  CheckBadgeIcon,
  FingerPrintIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getPromotionStatusConfig } from "./constants/promotionStatus";
import { formatPrice, formatDate } from "./utils/formatters";

// ==================== INFO ITEM ====================
function InfoItem({ icon: Icon, label, value, highlight = false }) {
  return (
    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-amber-100 hover:border-[#8B5E3C]/30 transition-colors duration-200">
      <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#faf6f1] flex items-center justify-center">
        <Icon className="w-3.5 h-3.5 text-[#8B5E3C]" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </Typography>
        <Typography
          className={`text-xs font-semibold truncate ${
            highlight ? "text-[#8B5E3C] font-extrabold" : "text-gray-800"
          }`}
        >
          {value}
        </Typography>
      </div>
    </div>
  );
}

// ==================== MAIN ====================
export function Show({ open, promotion, onClose }) {
  if (!promotion) return null;

  const statusConfig = getPromotionStatusConfig(promotion);
  const StatusIcon = statusConfig.icon;

  const discountDisplay = promotion.discountPercentage
    ? `-${promotion.discountPercentage}%`
    : promotion.discountAmount
    ? `-${formatPrice(promotion.discountAmount)}`
    : "—";

  return (
    <Dialog open={open} handler={onClose} size="lg" className="bg-transparent shadow-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] p-5 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-4 w-20 h-20 rounded-full bg-white/10" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <XMarkIcon className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <div className="relative flex items-center gap-4 z-10">
            <div className="relative flex-shrink-0">
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center shadow-lg border-2 border-white/40`}
              >
                <GiftIcon className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${statusConfig.dot} ${
                  promotion.isActive ? "animate-pulse" : ""
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <Typography className="text-[10px] font-bold text-amber-100 uppercase tracking-widest">
                Chi tiết khuyến mãi
              </Typography>
              <Typography variant="h5" className="text-white font-extrabold tracking-tight truncate">
                {promotion.name}
              </Typography>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20">
                  <FingerPrintIcon className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white">
                    #{promotion.id}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20">
                  <span className="text-[10px] font-extrabold text-white">
                    {discountDisplay}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <DialogBody className="p-5 max-h-[55vh] overflow-y-auto bg-[#faf6f1]">
          <div className="space-y-4">
            {/* Quick stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <FingerPrintIcon className="h-4 w-4 text-[#8B5E3C] mb-1.5" />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Mã KM
                </Typography>
                <Typography className="text-sm font-extrabold text-[#4e342e]">
                  #{promotion.id}
                </Typography>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 shadow-sm">
                <ReceiptPercentIcon className="h-4 w-4 text-purple-100 mb-1.5" />
                <Typography className="text-[9px] font-bold text-purple-100/80 uppercase tracking-wider">
                  Giảm (%)
                </Typography>
                <Typography className="text-sm font-extrabold text-white">
                  {promotion.discountPercentage || 0}%
                </Typography>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] shadow-sm">
                <BanknotesIcon className="h-4 w-4 text-amber-200 mb-1.5" />
                <Typography className="text-[9px] font-bold text-amber-200/80 uppercase tracking-wider">
                  Giảm (VND)
                </Typography>
                <Typography className="text-xs font-extrabold text-white truncate">
                  {formatPrice(promotion.discountAmount || 0)}
                </Typography>
              </div>

              <div className={`p-3 rounded-xl border bg-gradient-to-br ${statusConfig.light} ${statusConfig.border}`}>
                <StatusIcon className={`h-4 w-4 mb-1.5 ${statusConfig.text}`} strokeWidth={2} />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </Typography>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot} ${
                      promotion.isActive ? "animate-pulse" : ""
                    }`}
                  />
                  <Typography className={`text-xs font-extrabold ${statusConfig.text} truncate`}>
                    {statusConfig.label}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Thời gian */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Thời gian áp dụng
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-amber-100">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <CalendarDaysIcon className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Bắt đầu
                    </Typography>
                    <Typography className="text-xs font-semibold text-gray-800">
                      {formatDate(promotion.startDate)}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-amber-100">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                    <CalendarDaysIcon className="h-3.5 w-3.5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Kết thúc
                    </Typography>
                    <Typography className="text-xs font-semibold text-gray-800">
                      {formatDate(promotion.endDate)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Sản phẩm áp dụng */}
            {promotion.products && promotion.products.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                  <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                    Sản phẩm áp dụng
                  </Typography>
                  <span className="ml-auto text-[10px] font-extrabold text-[#8B5E3C] bg-white border border-[#C89F77]/30 px-2 py-0.5 rounded-md">
                    {promotion.products.length}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-amber-100">
                  <div className="grid grid-cols-2 gap-1.5 max-h-[110px] overflow-y-auto pr-1">
                    {promotion.products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#faf6f1] hover:bg-gradient-to-r hover:from-[#8B5E3C]/10 hover:to-[#C89F77]/10 border border-transparent hover:border-[#8B5E3C]/20 transition-all duration-200"
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-md bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center">
                          <CubeIcon className="w-3 h-3 text-white" strokeWidth={2.2} />
                        </div>
                        <Typography className="text-[10px] font-bold text-[#4e342e] truncate flex-1">
                          {product.name || `SP #${product.id}`}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Thông tin chi tiết */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Thông tin chi tiết
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <InfoItem icon={TagIcon} label="Tên khuyến mãi" value={promotion.name} />
                <InfoItem icon={FingerPrintIcon} label="Mã khuyến mãi" value={`#${promotion.id}`} />
                <InfoItem
                  icon={ReceiptPercentIcon}
                  label="Giảm theo %"
                  value={`${promotion.discountPercentage || 0}%`}
                />
                <InfoItem
                  icon={BanknotesIcon}
                  label="Giảm theo VNĐ"
                  value={formatPrice(promotion.discountAmount || 0)}
                  highlight
                />
              </div>
            </div>
          </div>
        </DialogBody>

        {/* FOOTER */}
        <DialogFooter className="bg-white border-t border-amber-100 p-4 flex items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center text-xs">
              ☕
            </div>
            <Typography className="text-xs text-[#6d4c41] font-bold">
              Coffee Shop Admin
            </Typography>
          </div>

          <Button
            onClick={onClose}
            className="ml-auto bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 normal-case font-bold flex items-center gap-2 text-sm"
          >
            <CheckBadgeIcon className="h-4 w-4" strokeWidth={2.5} />
            Đóng
          </Button>
        </DialogFooter>
      </motion.div>
    </Dialog>
  );
}

export default Show;
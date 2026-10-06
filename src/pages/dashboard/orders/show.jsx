
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  ShoppingCartIcon,
  TableCellsIcon,
  UserIcon,
  TagIcon,
  BanknotesIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  XMarkIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  FingerPrintIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getStatusConfig } from "./constants/orderStatus";
import { formatPrice, formatDate } from "./utils/formatters";

// ==================== INFO ITEM ====================
function InfoItem({ icon: Icon, label, value, highlight = false }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-amber-100 hover:border-[#8B5E3C]/30 transition-colors duration-200">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#faf6f1] flex items-center justify-center">
        <Icon className="h-4 w-4 text-[#8B5E3C]" strokeWidth={2} />
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
export function Show({ open, order, onClose }) {
  if (!order) return null;

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;

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
                <ShoppingCartIcon className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${statusConfig.dot} ${
                  order.status === "PENDING" ? "animate-pulse" : ""
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <Typography className="text-[10px] font-bold text-amber-100 uppercase tracking-widest">
                Chi tiết đơn hàng
              </Typography>
              <Typography variant="h5" className="text-white font-extrabold tracking-tight truncate">
                Đơn #{order.id}
              </Typography>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20">
                  <span className="text-[10px]">🪑</span>
                  <span className="text-[10px] font-bold text-white">
                    {order.table?.number || "N/A"}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20">
                  <span className="text-[10px]">{statusConfig.emoji}</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    {statusConfig.label}
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
                  Mã đơn
                </Typography>
                <Typography className="text-sm font-extrabold text-[#4e342e]">
                  #{order.id}
                </Typography>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] shadow-sm">
                <BanknotesIcon className="h-4 w-4 text-amber-200 mb-1.5" />
                <Typography className="text-[9px] font-bold text-amber-200/80 uppercase tracking-wider">
                  Tổng tiền
                </Typography>
                <Typography className="text-xs font-extrabold text-white truncate">
                  {formatPrice(order.totalAmount)}
                </Typography>
              </div>

              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <TableCellsIcon className="h-4 w-4 text-[#8B5E3C] mb-1.5" />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Bàn
                </Typography>
                <Typography className="text-xs font-extrabold text-[#4e342e] truncate">
                  {order.table?.number || "N/A"}
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
                      order.status === "PENDING" ? "animate-pulse" : ""
                    }`}
                  />
                  <Typography className={`text-xs font-extrabold ${statusConfig.text} truncate`}>
                    {statusConfig.label}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Section: Thông tin đơn hàng */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Thông tin đơn hàng
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <InfoItem
                  icon={TableCellsIcon}
                  label="Bàn phục vụ"
                  value={order.table?.number ? `Bàn ${order.table.number}` : "N/A"}
                />
                <InfoItem
                  icon={UserIcon}
                  label="Nhân viên"
                  value={order.employee?.fullName || "N/A"}
                />
                <InfoItem
                  icon={TagIcon}
                  label="Khuyến mãi"
                  value={order.promotion?.name || "Không áp dụng"}
                />
                <InfoItem
                  icon={BanknotesIcon}
                  label="Tổng tiền"
                  value={formatPrice(order.totalAmount)}
                  highlight
                />
              </div>
            </div>

            {/* Section: Ghi chú */}
            {order.notes && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                  <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                    Ghi chú
                  </Typography>
                  <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-amber-100">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#faf6f1] flex items-center justify-center">
                    <DocumentTextIcon className="h-4 w-4 text-[#8B5E3C]" strokeWidth={2} />
                  </div>
                  <Typography className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {order.notes}
                  </Typography>
                </div>
              </div>
            )}

            {/* Section: Lịch sử */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Lịch sử hoạt động
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-100">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center">
                    <CalendarDaysIcon className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Ngày tạo
                    </Typography>
                    <Typography className="text-sm font-semibold text-gray-800">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-100">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#C89F77] to-[#a4714b] flex items-center justify-center">
                    <ArrowPathIcon className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Cập nhật lần cuối
                    </Typography>
                    <Typography className="text-sm font-semibold text-gray-800">
                      {formatDate(order.updatedAt || order.createdAt)}
                    </Typography>
                  </div>
                </div>
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
import { Tooltip, Typography } from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ClockIcon,
  CheckBadgeIcon,
  XCircleIcon,
  FireIcon,
  BanknotesIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function OrderTable({ orders, onShow, onEdit, onDelete }) {
  const formatPrice = (price) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  // ==================== STATUS CONFIG ====================
  const getStatusConfig = (status) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Chờ xác nhận",
          icon: ClockIcon,
          bg: "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-700",
          dot: "bg-amber-500",
        };
      case "CONFIRMED":
        return {
          label: "Đã xác nhận",
          icon: CheckBadgeIcon,
          bg: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700",
          dot: "bg-blue-500",
        };
      case "PREPARING":
        return {
          label: "Đang chuẩn bị",
          icon: FireIcon,
          bg: "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-700",
          dot: "bg-orange-500 animate-pulse",
        };
      case "SERVED":
        return {
          label: "Đã phục vụ",
          icon: TruckIcon,
          bg: "bg-gradient-to-r from-purple-50 to-fuchsia-50 border-purple-200 text-purple-700",
          dot: "bg-purple-500",
        };
      case "PAID":
        return {
          label: "Đã thanh toán",
          icon: BanknotesIcon,
          bg: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700",
          dot: "bg-green-500",
        };
      case "CANCELLED":
        return {
          label: "Đã hủy",
          icon: XCircleIcon,
          bg: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700",
          dot: "bg-red-500",
        };
      default:
        return {
          label: "Không xác định",
          icon: ClockIcon,
          bg: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-700",
          dot: "bg-gray-500",
        };
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-white overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full table-fixed min-w-[1000px]">
            <colgroup>
              <col className="w-[5%]" />   {/* STT */}
              <col className="w-[8%]" />   {/* Mã ĐH */}
              <col className="w-[10%]" />  {/* Bàn */}
              <col className="w-[14%]" />  {/* KM */}
              <col className="w-[12%]" />  {/* Tổng tiền */}
              <col className="w-[13%]" />  {/* Trạng thái */}
              <col className="w-[14%]" />  {/* Ghi chú */}
              <col className="w-[12%]" />  {/* Ngày tạo */}
              <col className="w-[12%]" />  {/* Hành động */}
            </colgroup>

            <thead>
              <tr className="bg-gradient-to-r from-[#faf6f1] via-[#f5ede3] to-[#faf6f1] border-b-2 border-amber-100">
                {[
                  "STT",
                  "Mã ĐH",
                  "Bàn",
                  "Khuyến Mãi",
                  "Tổng Tiền",
                  "Trạng Thái",
                  "Ghi Chú",
                  "Ngày Tạo",
                  "Hành Động",
                ].map((el) => (
                  <th
                    key={el}
                    className={`py-4 px-3 lg:px-5 2xl:px-6 ${
                      el === "Hành Động" ? "text-center" : "text-left"
                    }`}
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] 2xl:text-xs font-extrabold uppercase text-[#6d4c41] tracking-wider whitespace-nowrap"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-4">
                        <span className="text-5xl">🛒</span>
                      </div>
                      <Typography className="text-base text-[#8B5E3C] font-bold mb-1">
                        Chưa có đơn hàng nào
                      </Typography>
                      <Typography className="text-xs text-gray-400">
                        Hãy tạo đơn hàng mới để bắt đầu
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => {
                  const className = `py-4 px-3 lg:px-5 2xl:px-6 align-middle ${
                    index === orders.length - 1
                      ? ""
                      : "border-b border-amber-50"
                  }`;
                  const statusConfig = getStatusConfig(order.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="group hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] transition-all duration-300"
                    >
                      {/* STT */}
                      <td className={className}>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] group-hover:from-[#8B5E3C] group-hover:to-[#6d4c41] transition-all duration-300">
                          <Typography className="text-xs font-bold text-[#6d4c41] group-hover:text-white transition-colors">
                            {index + 1}
                          </Typography>
                        </div>
                      </td>

                      {/* Mã ĐH */}
                      <td className={className}>
                        <Typography className="text-sm font-extrabold text-[#8B5E3C] whitespace-nowrap">
                          #{order.id}
                        </Typography>
                      </td>

                      {/* Bàn */}
                      <td className={className}>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#f5ede3] to-[#faf6f1] border border-[#C89F77]/40 whitespace-nowrap">
                          <span className="text-xs">Bàn #</span>
                          <Typography className="text-xs font-bold text-[#6d4c41] truncate">
                            {order.table?.number || "N/A"}
                          </Typography>
                        </span>
                      </td>

                      {/* Khuyến mãi */}
                      <td className={className}>
                        {order.promotion?.name ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 max-w-full">
                            <span className="text-xs flex-shrink-0">🎁</span>
                            <Typography className="text-xs font-bold text-pink-700 truncate">
                              {order.promotion.name}
                            </Typography>
                          </span>
                        ) : (
                          <Typography className="text-xs text-gray-400 italic">
                            Không có
                          </Typography>
                        )}
                      </td>

                      {/* Tổng tiền */}
                      <td className={className}>
                        <Typography className="text-sm font-extrabold text-[#8B5E3C] whitespace-nowrap">
                          {formatPrice(order.totalAmount)}
                        </Typography>
                      </td>

                      {/* Trạng thái */}
                      <td className={className}>
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap ${statusConfig.bg}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" strokeWidth={2.2} />
                          {statusConfig.label}
                        </span>
                      </td>

                      {/* Ghi chú */}
                      <td className={`${className} min-w-0`}>
                        <Tooltip
                          content={order.notes || "Không có ghi chú"}
                          placement="top"
                        >
                          <Typography className="text-xs text-gray-600 truncate">
                            {order.notes || "—"}
                          </Typography>
                        </Tooltip>
                      </td>

                      {/* Ngày tạo */}
                      <td className={className}>
                        <Typography className="text-xs text-gray-600 whitespace-nowrap">
                          {formatDate(order.createdAt)}
                        </Typography>
                      </td>

                      {/* Hành động */}
                      <td className={`${className} text-center`}>
                        <div className="flex justify-center gap-1.5 xl:gap-2">
                          <Tooltip content="Xem chi tiết" placement="top">
                            <button
                              onClick={() => onShow(order)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-white border-2 border-[#8B5E3C]/20 hover:border-[#8B5E3C] hover:bg-gradient-to-br hover:from-[#8B5E3C] hover:to-[#6d4c41] shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <EyeIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[#8B5E3C] group-hover/btn:text-white transition-colors" />
                            </button>
                          </Tooltip>

                          <Tooltip content="Chỉnh sửa" placement="top">
                            <button
                              onClick={() => onEdit(order)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-white border-2 border-amber-500/30 hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <PencilIcon className="w-4 h-4 xl:w-5 xl:h-5 text-amber-600 group-hover/btn:text-white transition-colors" />
                            </button>
                          </Tooltip>

                          <Tooltip content="Xóa đơn hàng" placement="top">
                            <button
                              onClick={() => onDelete(order.id)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-white border-2 border-red-300 hover:border-red-500 hover:bg-gradient-to-br hover:from-red-500 hover:to-red-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <TrashIcon className="w-4 h-4 xl:w-5 xl:h-5 text-red-500 group-hover/btn:text-white transition-colors" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Stats */}
        {orders.length > 0 && (
          <div className="px-4 lg:px-6 2xl:px-8 py-4 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-2">
            <Typography className="text-xs font-semibold text-[#6d4c41]">
              Tổng cộng:{" "}
              <span className="font-bold text-[#8B5E3C]">{orders.length}</span>{" "}
              đơn hàng
            </Typography>
            <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
              <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {orders.filter((o) => o.status === "PENDING").length} Chờ
              </span>
              <span className="flex items-center gap-1.5 text-orange-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                {orders.filter((o) => o.status === "PREPARING").length} Chuẩn bị
              </span>
              <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {orders.filter((o) => o.status === "PAID").length} Đã TT
              </span>
              <span className="flex items-center gap-1.5 text-red-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {orders.filter((o) => o.status === "CANCELLED").length} Đã hủy
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default OrderTable;
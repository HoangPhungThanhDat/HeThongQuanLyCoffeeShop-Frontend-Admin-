import { Typography, Tooltip } from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  GiftIcon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ClockIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function PromotionsTable({ promotions, onShow, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatCurrency = (value) => {
    if (!value) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  // Status config
  const getStatusConfig = (promotion) => {
    const now = new Date();
    const start = promotion.startDate ? new Date(promotion.startDate) : null;
    const end = promotion.endDate ? new Date(promotion.endDate) : null;

    if (!promotion.isActive) {
      return {
        label: "Đã ngừng",
        emoji: "❌",
        icon: XCircleIcon,
        bg: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700",
        dot: "bg-red-500",
      };
    }

    // Đã hết hạn
    if (end && now > end) {
      return {
        label: "Hết hạn",
        emoji: "⏰",
        icon: ClockIcon,
        bg: "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 text-orange-700",
        dot: "bg-orange-500",
      };
    }

    // Chưa bắt đầu
    if (start && now < start) {
      return {
        label: "Sắp diễn ra",
        emoji: "⏳",
        icon: ClockIcon,
        bg: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700",
        dot: "bg-blue-500",
      };
    }

    // Đang chạy
    return {
      label: "Đang chạy",
      emoji: "🔥",
      icon: CheckBadgeIcon,
      bg: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700",
      dot: "bg-green-500",
    };
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
          <table className="w-full table-fixed min-w-[1200px]">
            <colgroup>
              <col className="w-[5%]" />   {/* STT */}
              <col className="w-[7%]" />   {/* Mã KM */}
              <col className="w-[22%]" />  {/* Tên */}
              <col className="w-[9%]" />   {/* % */}
              <col className="w-[11%]" />  {/* VNĐ */}
              <col className="w-[11%]" />  {/* Bắt đầu */}
              <col className="w-[11%]" />  {/* Kết thúc */}
              <col className="w-[12%]" />  {/* Trạng thái */}
              <col className="w-[12%]" />  {/* Hành động */}
            </colgroup>

            <thead>
              <tr className="bg-gradient-to-r from-[#faf6f1] via-[#f5ede3] to-[#faf6f1] border-b-2 border-amber-100">
                {[
                  "STT",
                  "Mã KM",
                  "Tên Khuyến Mãi",
                  "Giảm (%)",
                  "Giảm (VND)",
                  "Bắt Đầu",
                  "Kết Thúc",
                  "Trạng Thái",
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
              {promotions.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-4">
                        <span className="text-5xl">🎁</span>
                      </div>
                      <Typography className="text-base text-[#8B5E3C] font-bold mb-1">
                        Chưa có khuyến mãi nào
                      </Typography>
                      <Typography className="text-xs text-gray-400">
                        Hãy thêm chương trình khuyến mãi mới
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                promotions.map((promotion, index) => {
                  const className = `py-4 px-3 lg:px-5 2xl:px-6 align-middle ${
                    index === promotions.length - 1
                      ? ""
                      : "border-b border-amber-50"
                  }`;
                  const statusConfig = getStatusConfig(promotion);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.tr
                      key={promotion.id}
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

                      {/* Mã KM */}
                      <td className={className}>
                        <Typography className="text-sm font-extrabold text-[#8B5E3C] whitespace-nowrap">
                          #{promotion.id}
                        </Typography>
                      </td>

                      {/* Tên */}
                      <td className={`${className} min-w-0`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center group-hover:from-[#8B5E3C] group-hover:to-[#6d4c41] transition-all duration-300 shadow-sm">
                            <GiftIcon className="w-4 h-4 text-[#8B5E3C] group-hover:text-white transition-colors" />
                          </div>
                          <Typography className="text-sm font-bold text-[#4e342e] group-hover:text-[#8B5E3C] transition-colors truncate">
                            {promotion.name}
                          </Typography>
                        </div>
                      </td>

                      {/* % */}
                      <td className={className}>
                        {promotion.discountPercentage ? (
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-50 to-fuchsia-50 border border-purple-200 whitespace-nowrap">
                            <Typography className="text-xs font-extrabold text-purple-700">
                              -{promotion.discountPercentage}%
                            </Typography>
                          </span>
                        ) : (
                          <Typography className="text-xs text-gray-400">—</Typography>
                        )}
                      </td>

                      {/* VNĐ */}
                      <td className={className}>
                        {promotion.discountAmount ? (
                          <Typography className="text-xs font-extrabold text-[#8B5E3C] whitespace-nowrap">
                            {formatCurrency(promotion.discountAmount)}
                          </Typography>
                        ) : (
                          <Typography className="text-xs text-gray-400">—</Typography>
                        )}
                      </td>

                      {/* Bắt đầu */}
                      <td className={className}>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 whitespace-nowrap">
                          <CalendarDaysIcon className="w-3 h-3 text-blue-600" />
                          <Typography className="text-xs font-bold text-blue-700">
                            {formatDate(promotion.startDate)}
                          </Typography>
                        </span>
                      </td>

                      {/* Kết thúc */}
                      <td className={className}>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 whitespace-nowrap">
                          <CalendarDaysIcon className="w-3 h-3 text-orange-600" />
                          <Typography className="text-xs font-bold text-orange-700">
                            {formatDate(promotion.endDate)}
                          </Typography>
                        </span>
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

                      {/* Hành động */}
                      <td className={`${className} text-center`}>
                        <div className="flex justify-center gap-1.5 xl:gap-2">
                          <Tooltip content="Xem chi tiết" placement="top">
                            <button
                              onClick={() => onShow(promotion)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-white border-2 border-[#8B5E3C]/20 hover:border-[#8B5E3C] hover:bg-gradient-to-br hover:from-[#8B5E3C] hover:to-[#6d4c41] shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <EyeIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[#8B5E3C] group-hover/btn:text-white transition-colors" />
                            </button>
                          </Tooltip>

                          <Tooltip content="Chỉnh sửa" placement="top">
                            <button
                              onClick={() => onEdit(promotion)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-white border-2 border-amber-500/30 hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <PencilIcon className="w-4 h-4 xl:w-5 xl:h-5 text-amber-600 group-hover/btn:text-white transition-colors" />
                            </button>
                          </Tooltip>

                          <Tooltip content="Xóa khuyến mãi" placement="top">
                            <button
                              onClick={() => onDelete(promotion.id)}
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
        {promotions.length > 0 && (
          <div className="px-4 lg:px-6 2xl:px-8 py-4 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-2">
            <Typography className="text-xs font-semibold text-[#6d4c41]">
              Tổng cộng:{" "}
              <span className="font-bold text-[#8B5E3C]">
                {promotions.length}
              </span>{" "}
              khuyến mãi
            </Typography>
            <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
              <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {promotions.filter((p) => p.isActive).length} Hoạt động
              </span>
              <span className="flex items-center gap-1.5 text-red-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {promotions.filter((p) => !p.isActive).length} Ngừng
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default PromotionsTable;
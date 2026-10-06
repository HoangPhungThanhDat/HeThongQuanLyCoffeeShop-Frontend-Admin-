import { Typography, Tooltip } from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CreditCardIcon,
  DevicePhoneMobileIcon,
  CheckBadgeIcon,
  ClockIcon,
  XCircleIcon,
  HashtagIcon,
  ReceiptPercentIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function BillTable({ bills, onShow, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // ==================== METHOD CONFIG ====================
  const getMethodConfig = (method) => {
    switch (method) {
      case "CASH":
        return {
          label: "Tiền mặt",
          icon: BanknotesIcon,
          bg: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700",
        };
      case "CARD":
        return {
          label: "Thẻ",
          icon: CreditCardIcon,
          bg: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700",
        };
      case "MOBILE":
        return {
          label: "Ví điện tử",
          icon: DevicePhoneMobileIcon,
          bg: "bg-gradient-to-r from-purple-50 to-fuchsia-50 border-purple-200 text-purple-700",
        };
      default:
        return {
          label: method || "N/A",
          icon: BanknotesIcon,
          bg: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-700",
        };
    }
  };

  // ==================== STATUS CONFIG ====================
  const getStatusConfig = (status) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Đã thanh toán",
          icon: CheckBadgeIcon,
          bg: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700",
          dot: "bg-green-500",
        };
      case "PENDING":
        return {
          label: "Chờ thanh toán",
          icon: ClockIcon,
          bg: "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200 text-amber-700",
          dot: "bg-amber-500",
        };
      case "FAILED":
        return {
          label: "Thất bại",
          icon: XCircleIcon,
          bg: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200 text-red-700",
          dot: "bg-red-500",
        };
      default:
        return {
          label: status || "N/A",
          icon: ClockIcon,
          bg: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-700",
          dot: "bg-gray-500",
        };
    }
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
          <table className="w-full table-fixed min-w-[1100px]">
            <colgroup>
              <col className="w-[5%]" />   {/* STT */}
              <col className="w-[10%]" />  {/* Mã HĐ */}
              <col className="w-[13%]" />  {/* Tổng tiền */}
              <col className="w-[13%]" />  {/* Phương thức */}
              <col className="w-[15%]" />  {/* Trạng thái */}
              <col className="w-[15%]" />  {/* Ngày xuất */}
              <col className="w-[15%]" />  {/* Ghi chú */}
              <col className="w-[14%]" />  {/* Hành động */}
            </colgroup>

            <thead>
              <tr className="bg-gradient-to-r from-[#faf6f1] via-[#f5ede3] to-[#faf6f1] border-b-2 border-amber-100">
                {[
                  "STT",
                  "Mã HĐ",
                  "Tổng Tiền",
                  "Phương Thức",
                  "Trạng Thái",
                  "Ngày Xuất",
                  "Ghi Chú",
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
              {bills.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-4">
                        <span className="text-5xl">🧾</span>
                      </div>
                      <Typography className="text-base text-[#8B5E3C] font-bold mb-1">
                        Chưa có hóa đơn nào
                      </Typography>
                      <Typography className="text-xs text-gray-400">
                        Hãy thêm hóa đơn mới để bắt đầu
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                bills.map((bill, index) => {
                  const className = `py-4 px-3 lg:px-5 2xl:px-6 align-middle ${
                    index === bills.length - 1
                      ? ""
                      : "border-b border-amber-50"
                  }`;
                  const methodConfig = getMethodConfig(bill.paymentMethod);
                  const statusConfig = getStatusConfig(bill.paymentStatus);
                  const MethodIcon = methodConfig.icon;
                  const StatusIcon = statusConfig.icon;

                  return (
                    <motion.tr
                      key={bill.id}
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

                      {/* Mã HĐ */}
                      <td className={className}>
                        <Typography className="text-sm font-extrabold text-[#8B5E3C] whitespace-nowrap">
                          #{bill.orderId || "N/A"}
                        </Typography>
                      </td>

                      {/* Tổng tiền */}
                      <td className={className}>
                        <Typography className="text-sm font-extrabold text-[#4e342e] whitespace-nowrap">
                          {formatCurrency(bill.totalAmount)}
                        </Typography>
                      </td>

                      {/* Phương thức */}
                      <td className={className}>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-xs font-bold whitespace-nowrap ${methodConfig.bg}`}
                        >
                          <MethodIcon className="w-3.5 h-3.5" strokeWidth={2.2} />
                          {methodConfig.label}
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

                      {/* Ngày xuất */}
                      <td className={className}>
                        <Typography className="text-xs text-gray-600 whitespace-nowrap">
                          {formatDate(bill.issuedAt)}
                        </Typography>
                      </td>

                      {/* Ghi chú */}
                      <td className={`${className} min-w-0`}>
                        <Tooltip
                          content={bill.notes || "Không có ghi chú"}
                          placement="top"
                        >
                          <Typography className="text-xs text-gray-600 truncate">
                            {bill.notes || "—"}
                          </Typography>
                        </Tooltip>
                      </td>

                      {/* Hành động */}
                      <td className={`${className} text-center`}>
                        <div className="flex justify-center gap-1.5 xl:gap-2">
                          <Tooltip content="Xem chi tiết" placement="top">
                            <button
                              onClick={() => onShow(bill)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-white border-2 border-[#8B5E3C]/20 hover:border-[#8B5E3C] hover:bg-gradient-to-br hover:from-[#8B5E3C] hover:to-[#6d4c41] shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <EyeIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[#8B5E3C] group-hover/btn:text-white transition-colors" />
                            </button>
                          </Tooltip>

                          <Tooltip content="Chỉnh sửa" placement="top">
                            <button
                              onClick={() => onEdit(bill)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-white border-2 border-amber-500/30 hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <PencilIcon className="w-4 h-4 xl:w-5 xl:h-5 text-amber-600 group-hover/btn:text-white transition-colors" />
                            </button>
                          </Tooltip>

                          <Tooltip content="Xóa hóa đơn" placement="top">
                            <button
                              onClick={() => onDelete(bill.id)}
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
        {bills.length > 0 && (
          <div className="px-4 lg:px-6 2xl:px-8 py-4 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-2">
            <Typography className="text-xs font-semibold text-[#6d4c41]">
              Tổng cộng:{" "}
              <span className="font-bold text-[#8B5E3C]">{bills.length}</span>{" "}
              hóa đơn
            </Typography>
            <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
              <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {bills.filter((b) => b.paymentStatus === "COMPLETED").length} Đã
                TT
              </span>
              <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {bills.filter((b) => b.paymentStatus === "PENDING").length} Chờ
              </span>
              <span className="flex items-center gap-1.5 text-red-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {bills.filter((b) => b.paymentStatus === "FAILED").length} Thất
                bại
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default BillTable;
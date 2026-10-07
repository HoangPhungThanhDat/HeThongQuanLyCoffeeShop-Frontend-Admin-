
import { Card, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { STATUS_CONFIG } from "../constants";
import { formatPrice, getPaymentMethodLabel } from "../utils";

export const OrderReportTable = ({ filteredOrders }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="flex items-center gap-3 mt-2"
      >
        <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
        <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
          Danh sách đơn hàng
        </Typography>
        <span className="ml-auto text-[10px] font-extrabold text-[#8B5E3C] bg-white border border-[#C89F77]/30 px-2.5 py-1 rounded-lg">
          {filteredOrders.length} đơn
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed min-w-[900px]">
              <colgroup>
                <col className="w-[7%]" />
                <col className="w-[10%]" />
                <col className="w-[12%]" />
                <col className="w-[18%]" />
                <col className="w-[15%]" />
                <col className="w-[18%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead>
                <tr className="bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] border-b-2 border-amber-100">
                  {["STT", "Mã ĐH", "Ngày tạo", "Trạng thái", "Bàn", "Tổng tiền", "Thanh toán"].map((el) => (
                    <th key={el} className="py-4 px-5 text-left">
                      <Typography className="text-[10px] font-extrabold uppercase text-[#6d4c41] tracking-wider">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-16">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-3">
                          <span className="text-4xl">📋</span>
                        </div>
                        <Typography className="text-sm font-bold text-[#8B5E3C] mb-1">
                          Không có đơn hàng nào
                        </Typography>
                        <Typography className="text-xs text-gray-400">
                          Thử thay đổi bộ lọc hoặc khoảng thời gian
                        </Typography>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.slice(0, 20).map((order, i) => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                    const StatusIcon = cfg.icon;
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.02 }}
                        className="group hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] border-b border-amber-50 transition-all duration-200"
                      >
                        <td className="py-3 px-5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] group-hover:from-[#8B5E3C] group-hover:to-[#6d4c41] flex items-center justify-center text-xs font-bold text-[#6d4c41] group-hover:text-white transition-all duration-300">
                            {i + 1}
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <Typography className="text-sm font-extrabold text-[#8B5E3C] whitespace-nowrap">
                            #{order.id}
                          </Typography>
                        </td>
                        <td className="py-3 px-5">
                          <Typography className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                            {dayjs(order.createdAt).format("DD/MM HH:mm")}
                          </Typography>
                        </td>
                        <td className="py-3 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-extrabold whitespace-nowrap ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                            <StatusIcon className="w-3 h-3" strokeWidth={2.5} />
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-3 px-5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#f5ede3] to-[#faf6f1] border border-[#C89F77]/40">
                            <span className="text-[10px]">🪑</span>
                            <Typography className="text-[10px] font-bold text-[#6d4c41]">
                              {order.table?.number || "N/A"}
                            </Typography>
                          </span>
                        </td>
                        <td className="py-3 px-5">
                          <Typography className="text-sm font-extrabold text-[#4e342e] whitespace-nowrap">
                            {formatPrice(order.totalAmount)}
                          </Typography>
                        </td>
                        <td className="py-3 px-5">
                          <Typography className="text-xs font-bold text-gray-600 truncate">
                            {getPaymentMethodLabel(order.paymentMethod)}
                          </Typography>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {filteredOrders.length > 20 && (
            <div className="p-4 bg-[#faf6f1] border-t border-amber-100 text-center">
              <Typography className="text-[10px] font-bold text-[#6d4c41]">
                Hiển thị 20 / {filteredOrders.length} đơn hàng. Nhấn "Xuất báo cáo" để xem toàn bộ.
              </Typography>
            </div>
          )}
        </Card>
      </motion.div>
    </>
  );
};
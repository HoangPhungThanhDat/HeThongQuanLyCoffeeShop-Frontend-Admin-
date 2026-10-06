
import { Card, Typography, Chip } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { TrophyIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { getImageUrl, handleImageError } from "@/utils/imageHelper";
import { formatPrice } from "../utils";

export const RevenueTopProducts = ({ topProducts, fromDate, toDate }) => {
  return (
    <>
      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
        className="flex items-center gap-3 mt-2"
      >
        <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
        <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
          Top sản phẩm doanh thu
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
          <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                <TrophyIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <Typography className="font-bold text-[#4e342e] tracking-wide">
                  Top 10 sản phẩm doanh thu cao nhất
                </Typography>
                <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                  {dayjs(fromDate).format("DD/MM/YYYY")} →{" "}
                  {dayjs(toDate).format("DD/MM/YYYY")}
                </Typography>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-fixed min-w-[800px]">
              <colgroup>
                <col className="w-[8%]" />
                <col className="w-[42%]" />
                <col className="w-[15%]" />
                <col className="w-[20%]" />
                <col className="w-[15%]" />
              </colgroup>
              <thead>
                <tr className="bg-[#faf6f1] border-b border-amber-100">
                  {["Hạng", "Sản phẩm", "Đã bán", "Doanh thu", "Tỷ lệ"].map(
                    (el) => (
                      <th
                        key={el}
                        className={`py-3 px-5 ${
                          el === "Hạng" ? "text-center" : "text-left"
                        }`}
                      >
                        <Typography className="text-[10px] font-extrabold uppercase text-[#6d4c41] tracking-wider">
                          {el}
                        </Typography>
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {topProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-3">
                          <span className="text-3xl">☕</span>
                        </div>
                        <Typography className="text-xs text-gray-400 italic">
                          Chưa có dữ liệu bán hàng trong khoảng thời gian này
                        </Typography>
                      </div>
                    </td>
                  </tr>
                ) : (
                  topProducts.map((p, i) => {
                    const maxRevenue = topProducts[0]?.revenue || 1;
                    const percent = (p.revenue / maxRevenue) * 100;
                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.05 }}
                        className="group hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] border-b border-amber-50 transition-all duration-200"
                      >
                        <td className="py-4 px-5 text-center">
                          <div
                            className={`inline-flex items-center justify-center w-9 h-9 rounded-xl font-extrabold text-xs shadow-sm ${
                              i === 0
                                ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white"
                                : i === 1
                                ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                                : i === 2
                                ? "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
                                : "bg-[#faf6f1] text-[#6d4c41] border border-[#C89F77]/30"
                            }`}
                          >
                            {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={getImageUrl(p.imageUrl)}
                              alt={p.name}
                              className="w-12 h-12 rounded-xl object-cover shadow-md border-2 border-white ring-2 ring-amber-100 flex-shrink-0 bg-[#faf6f1]"
                              onError={handleImageError}
                            />
                            <div className="min-w-0">
                              <Typography className="text-xs font-extrabold text-[#4e342e] group-hover:text-[#8B5E3C] transition-colors truncate">
                                {p.name}
                              </Typography>
                              <Typography className="text-[10px] text-gray-400">
                                ID: #{p.id}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <Chip
                            value={`${p.quantity} ly`}
                            className="bg-gradient-to-r from-[#faf6f1] to-[#f5ede3] text-[#6d4c41] border border-[#C89F77]/30 text-[10px] font-extrabold w-fit"
                            size="sm"
                          />
                        </td>
                        <td className="py-4 px-5">
                          <Typography className="text-sm font-extrabold text-green-600 truncate">
                            {formatPrice(p.revenue)}
                          </Typography>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-[#faf6f1] overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percent}%` }}
                                transition={{
                                  duration: 0.8,
                                  delay: 0.7 + i * 0.05,
                                }}
                                className="h-full rounded-full bg-gradient-to-r from-[#8B5E3C] to-[#C89F77]"
                              />
                            </div>
                            <Typography className="text-[10px] font-extrabold text-[#8B5E3C] w-8 text-right">
                              {percent.toFixed(0)}%
                            </Typography>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </>
  );
};

import { Card, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { Pagination } from "@/widgets/pagination";
import { getStockConfig } from "../constants";
import { formatPrice, formatCompact } from "../utils";

export const InventoryReportTable = ({
  filteredProducts,
  paginatedProducts,
  page, pageSize, totalPages, totalElements,
  onPageChange,
}) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex items-center gap-3 mt-2"
      >
        <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
        <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
          Danh sách sản phẩm
        </Typography>
        <span className="ml-auto text-[10px] font-extrabold text-[#8B5E3C] bg-white border border-[#C89F77]/30 px-2.5 py-1 rounded-lg">
          {filteredProducts.length} sản phẩm
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.55 }}
      >
        <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-fixed min-w-[1000px]">
              <colgroup>
                <col className="w-[5%]" />
                <col className="w-[28%]" />
                <col className="w-[15%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[14%]" />
                <col className="w-[14%]" />
              </colgroup>
              <thead>
                <tr className="bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] border-b-2 border-amber-100">
                  {[
                    "STT",
                    "Sản phẩm",
                    "Danh mục",
                    "Tồn kho",
                    "Giá bán",
                    "Giá trị tồn",
                    "Trạng thái",
                  ].map((el) => (
                    <th key={el} className="py-4 px-4 text-left">
                      <Typography className="text-[10px] font-extrabold uppercase text-[#6d4c41] tracking-wider">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-16">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-3">
                          <span className="text-4xl">📦</span>
                        </div>
                        <Typography className="text-sm font-bold text-[#8B5E3C] mb-1">
                          Không có sản phẩm nào
                        </Typography>
                        <Typography className="text-xs text-gray-400">
                          Thử thay đổi bộ lọc
                        </Typography>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedProducts.map((p, i) => {
                    const cfg = getStockConfig(p.stockQuantity || 0);
                    const stockValue = (p.price || 0) * (p.stockQuantity || 0);
                    return (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 + i * 0.02 }}
                        className="group hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] border-b border-amber-50 transition-all duration-200"
                      >
                        <td className="py-3 px-4">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] group-hover:from-[#8B5E3C] group-hover:to-[#6d4c41] flex items-center justify-center text-xs font-bold text-[#6d4c41] group-hover:text-white transition-all duration-300">
                            {page * pageSize + i + 1}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={p.imageUrl || "https://via.placeholder.com/150"}
                              alt={p.name}
                              className="w-11 h-11 rounded-xl object-cover shadow-md border-2 border-white ring-2 ring-amber-100 flex-shrink-0"
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
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#f5ede3] to-[#faf6f1] border border-[#C89F77]/40 max-w-full">
                            <span className="text-[10px]">📁</span>
                            <Typography className="text-[10px] font-bold text-[#6d4c41] truncate">
                              {p.category?.name || "N/A"}
                            </Typography>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-full border text-[11px] font-extrabold ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                            {p.stockQuantity || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Typography className="text-xs font-extrabold text-[#8B5E3C] whitespace-nowrap">
                            {formatPrice(p.price)}
                          </Typography>
                        </td>
                        <td className="py-3 px-4">
                          <Typography className="text-xs font-extrabold text-green-600 whitespace-nowrap">
                            {formatCompact(stockValue)}
                          </Typography>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border text-[10px] font-extrabold whitespace-nowrap ${cfg.bg} ${cfg.border} ${cfg.text}`}>
                            <span>{cfg.emoji}</span>
                            {cfg.label}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={onPageChange}
            itemLabel="sản phẩm"
          />
        </Card>
      </motion.div>
    </>
  );
};
import { Typography, Tooltip } from "@material-tailwind/react";
import {
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FolderIcon,
  DocumentTextIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function CategoryTable({ categories, onShow, onEdit, onDelete }) {
  // Description badge
  const getDescBadge = (description) => {
    if (!description || description.trim() === "") {
      return {
        bg: "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200 text-gray-500",
        icon: "—",
        label: "Chưa có mô tả",
      };
    }
    return {
      bg: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700",
      icon: "✓",
      label: description,
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
          <table className="w-full table-fixed min-w-[800px]">
            <colgroup>
              <col className="w-[6%]" />   {/* STT */}
              <col className="w-[28%]" />  {/* Tên DM */}
              <col className="w-[46%]" />  {/* Mô tả */}
              <col className="w-[20%]" />  {/* Hành động */}
            </colgroup>

            <thead>
              <tr className="bg-gradient-to-r from-[#faf6f1] via-[#f5ede3] to-[#faf6f1] border-b-2 border-amber-100">
                {["STT", "Tên Danh Mục", "Mô tả", "Hành Động"].map((el) => (
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
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-16">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-4">
                        <span className="text-5xl">📁</span>
                      </div>
                      <Typography className="text-base text-[#8B5E3C] font-bold mb-1">
                        Chưa có danh mục nào
                      </Typography>
                      <Typography className="text-xs text-gray-400">
                        Hãy thêm danh mục mới để bắt đầu
                      </Typography>
                    </div>
                  </td>
                </tr>
              ) : (
                categories.map((category, index) => {
                  const className = `py-4 px-3 lg:px-5 2xl:px-6 align-middle ${
                    index === categories.length - 1
                      ? ""
                      : "border-b border-amber-50"
                  }`;
                  const descBadge = getDescBadge(category.description);

                  return (
                    <motion.tr
                      key={category.id}
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

                      {/* Tên danh mục */}
                      <td className={className}>
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center group-hover:from-[#8B5E3C] group-hover:to-[#6d4c41] transition-all duration-300 shadow-sm">
                            <FolderIcon className="w-4 h-4 text-[#8B5E3C] group-hover:text-white transition-colors" />
                          </div>
                          <Typography className="text-sm font-bold text-[#4e342e] group-hover:text-[#8B5E3C] transition-colors truncate">
                            {category.name}
                          </Typography>
                        </div>
                      </td>

                      {/* Mô tả */}
                      <td className={`${className} min-w-0`}>
                        <Tooltip
                          content={category.description || "Không có mô tả"}
                          placement="top"
                        >
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold whitespace-nowrap max-w-full ${descBadge.bg}`}
                          >
                            <span className="flex-shrink-0">
                              {category.description ? (
                                <DocumentTextIcon className="w-3 h-3" />
                              ) : (
                                <DocumentIcon className="w-3 h-3" />
                              )}
                            </span>
                            <span className="truncate">
                              {category.description || "Chưa có mô tả"}
                            </span>
                          </span>
                        </Tooltip>
                      </td>

                      {/* Hành động */}
                      <td className={`${className} text-center`}>
                        <div className="flex justify-center gap-1.5 xl:gap-2">
                          {/* Xem */}
                          <Tooltip content="Xem chi tiết" placement="top">
                            <button
                              onClick={() => onShow(category)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-white border-2 border-[#8B5E3C]/20 hover:border-[#8B5E3C] hover:bg-gradient-to-br hover:from-[#8B5E3C] hover:to-[#6d4c41] shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <EyeIcon className="w-4 h-4 xl:w-5 xl:h-5 text-[#8B5E3C] group-hover/btn:text-white transition-colors" />
                            </button>
                          </Tooltip>

                          {/* Sửa */}
                          <Tooltip content="Chỉnh sửa" placement="top">
                            <button
                              onClick={() => onEdit(category)}
                              className="group/btn inline-flex items-center justify-center w-9 h-9 xl:w-10 xl:h-10 rounded-xl bg-white border-2 border-amber-500/30 hover:border-amber-500 hover:bg-gradient-to-br hover:from-amber-500 hover:to-amber-600 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
                            >
                              <PencilIcon className="w-4 h-4 xl:w-5 xl:h-5 text-amber-600 group-hover/btn:text-white transition-colors" />
                            </button>
                          </Tooltip>

                          {/* Xóa */}
                          <Tooltip content="Xóa danh mục" placement="top">
                            <button
                              onClick={() => onDelete(category.id)}
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

        {/* Footer with stats */}
        {categories.length > 0 && (
          <div className="px-4 lg:px-6 2xl:px-8 py-4 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] border-t border-amber-100 flex flex-col sm:flex-row items-center justify-between gap-2">
            <Typography className="text-xs font-semibold text-[#6d4c41]">
              Tổng cộng:{" "}
              <span className="font-bold text-[#8B5E3C]">
                {categories.length}
              </span>{" "}
              danh mục
            </Typography>
            <div className="flex items-center gap-4 text-xs flex-wrap justify-center">
              <span className="flex items-center gap-1.5 text-green-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {
                  categories.filter(
                    (c) => c.description && c.description.trim() !== ""
                  ).length
                }{" "}
                Có mô tả
              </span>
              <span className="flex items-center gap-1.5 text-gray-500 font-semibold">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                {
                  categories.filter(
                    (c) => !c.description || c.description.trim() === ""
                  ).length
                }{" "}
                Chưa mô tả
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default CategoryTable;
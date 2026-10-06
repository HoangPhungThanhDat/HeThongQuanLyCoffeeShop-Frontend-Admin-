
import { Typography } from "@material-tailwind/react";
import { UsersIcon, SparklesIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getStatusConfig } from "../constants/tableConfig";

/**
 * Preview card bàn — dùng chung create/edit/show
 * @param {object} props
 * @param {string} props.number - Số/tên bàn
 * @param {string|number} props.capacity - Số ghế
 * @param {string} props.status - FREE | OCCUPIED | RESERVED
 * @param {"create"|"edit"} [props.mode] - Chế độ (mặc định create)
 * @param {boolean} [props.showSteam] - Có hiệu ứng steam không (chỉ khi OCCUPIED)
 */
export function TablePreviewCard({
  number,
  capacity,
  status = "FREE",
  mode = "create",
  showSteam = true,
}) {
  const statusConfig = getStatusConfig(status);
  const isEditMode = mode === "edit";
  const isOccupied = status === "OCCUPIED";

  return (
    <>
      <div className="relative group">
        {/* Glow effect */}
        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${statusConfig.gradient} blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-300`}
        />

        {/* Bàn preview */}
        <motion.div
          key={status}
          initial={{ scale: 0.9, rotate: -3 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-white flex flex-col items-center justify-center"
        >
          {/* Wood top bar */}
          <div
            className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${statusConfig.gradient}`}
          />

          {/* Steam (nếu đang dùng) */}
          {isOccupied && showSteam && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-0.5">
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-0.5 h-3 rounded-full bg-[#8B5E3C]/40"
                  animate={{ y: [0, -6, 0], opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                />
              ))}
            </div>
          )}

          {/* Icon bàn */}
          <div
            className={`w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br ${statusConfig.gradient} flex items-center justify-center shadow-lg mb-2 border-2 border-white/30 relative`}
          >
            <div className="absolute inset-1 rounded-full border border-white/20" />
            <span className="text-3xl lg:text-4xl drop-shadow-md">
              {statusConfig.emoji}
            </span>
          </div>

          {/* Số bàn */}
          <Typography className="text-base lg:text-lg font-extrabold text-[#4e342e] leading-none">
            {number || "Bàn ?"}
          </Typography>

          {/* Số ghế */}
          <div className="flex items-center gap-1 mt-1 bg-[#faf6f1] px-2 py-0.5 rounded-full border border-[#C89F77]/30">
            <UsersIcon className="w-2.5 h-2.5 text-[#8B5E3C]" />
            <Typography className="text-[9px] font-bold text-[#6d4c41]">
              {capacity || "?"} chỗ
            </Typography>
          </div>

          {/* Status badge */}
          <div
            className={`absolute bottom-0 left-0 right-0 bg-gradient-to-r ${statusConfig.light} border-t ${statusConfig.border} py-1.5 px-2`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
              <Typography
                className={`text-[9px] font-extrabold ${statusConfig.text} uppercase tracking-wider`}
              >
                {statusConfig.label}
              </Typography>
            </div>
          </div>
        </motion.div>

        {/* Badge: edit hoặc sparkle */}
        <motion.div
          className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white"
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
          Xem trước bàn
        </Typography>
        <Typography className="text-xs text-gray-500 mt-1">
          Bàn sẽ hiển thị như thế này
        </Typography>
      </div>
    </>
  );
}

export default TablePreviewCard;
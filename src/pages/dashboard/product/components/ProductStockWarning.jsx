
import { Typography } from "@material-tailwind/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getStockConfig, STOCK_THRESHOLD } from "../constants/stockConfig";

/**
 * Cảnh báo tồn kho — dùng chung create/edit/show
 */
export function ProductStockWarning({ quantity, variant = "form" }) {
  const numQty = Number(quantity) || 0;

  // Chỉ hiện khi có quantity và dưới ngưỡng
  if (!quantity || numQty >= STOCK_THRESHOLD.LOW) return null;

  const config = getStockConfig(numQty);
  const isOut = numQty === STOCK_THRESHOLD.OUT;

  // Variant show (không có motion)
  if (variant === "show") {
    return (
      <div
        className={`flex items-start gap-3 p-3 rounded-xl border ${
          isOut
            ? "bg-red-50 border-red-200"
            : "bg-orange-50 border-orange-200"
        }`}
      >
        <ExclamationTriangleIcon
          className={`h-4 w-4 flex-shrink-0 mt-0.5 ${
            isOut ? "text-red-600" : "text-orange-600"
          }`}
          strokeWidth={2}
        />
        <Typography
          className={`text-xs font-semibold ${
            isOut ? "text-red-700" : "text-orange-700"
          }`}
        >
          {config.message}
        </Typography>
      </div>
    );
  }

  // Variant form (có motion)
  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mt-3 flex items-start gap-3 p-3 rounded-xl border ${
        isOut
          ? "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
          : "bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200"
      }`}
    >
      <ExclamationTriangleIcon
        className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
          isOut ? "text-red-600" : "text-orange-600"
        }`}
      />
      <Typography
        className={`text-xs font-semibold ${
          isOut ? "text-red-700" : "text-orange-700"
        }`}
      >
        {isOut
          ? "Sản phẩm sẽ được đánh dấu HẾT HÀNG!"
          : `Số lượng còn ít (${numQty}), sản phẩm sẽ được đánh dấu SẮP HẾT!`}
      </Typography>
    </motion.div>
  );
}

export default ProductStockWarning;
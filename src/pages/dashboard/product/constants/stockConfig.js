

/**
 * Ngưỡng cảnh báo tồn kho
 */
export const STOCK_THRESHOLD = {
    LOW: 10, // < 10 = sắp hết
    OUT: 0, // = 0 = hết hàng
  };
  
  /**
   * Lấy config hiển thị cho stock quantity
   */
  export function getStockConfig(qty) {
    const numQty = Number(qty) || 0;
  
    if (numQty === STOCK_THRESHOLD.OUT) {
      return {
        status: "OUT_OF_STOCK",
        label: "Hết hàng",
        shortLabel: "Hết",
        emoji: "⚠️",
        bg: "bg-red-50",
        border: "border-red-200",
        text: "text-red-700",
        dot: "bg-red-500",
        message: "Sản phẩm đã hết hàng. Vui lòng nhập thêm!",
      };
    }
  
    if (numQty < STOCK_THRESHOLD.LOW) {
      return {
        status: "LOW_STOCK",
        label: "Sắp hết hàng",
        shortLabel: "Sắp hết",
        emoji: "📦",
        bg: "bg-orange-50",
        border: "border-orange-200",
        text: "text-orange-700",
        dot: "bg-orange-500",
        message: `Sản phẩm chỉ còn ${numQty} trong kho. Cần nhập thêm sớm!`,
      };
    }
  
    return {
      status: "IN_STOCK",
      label: "Còn hàng",
      shortLabel: "Còn",
      emoji: "📦",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      dot: "bg-blue-500",
      message: "",
    };
  }
  
  /**
   * Check có phải sản phẩm sắp hết hàng không
   */
  export function isLowStock(qty) {
    const numQty = Number(qty) || 0;
    return numQty > 0 && numQty < STOCK_THRESHOLD.LOW;
  }
  
  /**
   * Check có phải sản phẩm hết hàng không
   */
  export function isOutOfStock(qty) {
    return Number(qty) === STOCK_THRESHOLD.OUT;
  }
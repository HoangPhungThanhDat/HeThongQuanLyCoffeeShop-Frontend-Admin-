

export const getStockConfig = (qty) => {
  if (qty === 0) {
    return {
      label: "Hết hàng",
      emoji: "🚨",
      color: "#dc2626",
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      level: "out",
    };
  }
  if (qty < 10) {
    return {
      label: "Sắp hết",
      emoji: "⚠️",
      color: "#f59e0b",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      level: "low",
    };
  }
  if (qty < 30) {
    return {
      label: "Trung bình",
      emoji: "📦",
      color: "#3b82f6",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      level: "medium",
    };
  }
  return {
    label: "Đầy đủ",
    emoji: "✅",
    color: "#22c55e",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
    level: "high",
  };
};

export const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#dc2626"];

export const SORT_OPTIONS = [
  { key: "stock", label: "⬆️ Tồn kho (ít → nhiều)" },
  { key: "name", label: "🔤 Tên (A → Z)" },
  { key: "value", label: "💰 Giá trị tồn (cao → thấp)" },
];

export const STOCK_FILTERS = [
  { key: "ALL", label: "📦 Tất cả trạng thái" },
  { key: "OUT", label: "🚨 Hết hàng" },
  { key: "LOW", label: "⚠️ Sắp hết" },
  { key: "MEDIUM", label: "📦 Trung bình" },
  { key: "HIGH", label: "✅ Đầy đủ" },
];

export const PAGE_SIZE = 20;
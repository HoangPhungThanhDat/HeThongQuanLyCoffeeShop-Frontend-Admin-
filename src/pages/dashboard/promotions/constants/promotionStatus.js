
import {
    CheckBadgeIcon,
    ClockIcon,
    XCircleIcon,
  } from "@heroicons/react/24/outline";
  
  /**
   * Trạng thái khuyến mãi được tính động dựa vào isActive + startDate + endDate
   */
  export function getPromotionStatusConfig(promotion) {
    const now = new Date();
    const start = promotion?.startDate ? new Date(promotion.startDate) : null;
    const end = promotion?.endDate ? new Date(promotion.endDate) : null;
  
    if (!promotion?.isActive) {
      return {
        label: "Đã ngừng",
        shortLabel: "Ngừng",
        icon: XCircleIcon,
        gradient: "from-red-400 via-red-500 to-rose-600",
        light: "from-red-50 to-rose-50",
        border: "border-red-200",
        text: "text-red-700",
        dot: "bg-red-500",
        statColor: "red",
      };
    }
  
    if (end && now > end) {
      return {
        label: "Hết hạn",
        shortLabel: "Hết hạn",
        icon: ClockIcon,
        gradient: "from-orange-400 via-orange-500 to-red-500",
        light: "from-orange-50 to-amber-50",
        border: "border-orange-200",
        text: "text-orange-700",
        dot: "bg-orange-500",
        statColor: "orange",
      };
    }
  
    if (start && now < start) {
      return {
        label: "Sắp diễn ra",
        shortLabel: "Sắp tới",
        icon: ClockIcon,
        gradient: "from-blue-400 via-blue-500 to-indigo-600",
        light: "from-blue-50 to-indigo-50",
        border: "border-blue-200",
        text: "text-blue-700",
        dot: "bg-blue-500",
        statColor: "blue",
      };
    }
  
    return {
      label: "Đang chạy",
      shortLabel: "Đang chạy",
      icon: CheckBadgeIcon,
      gradient: "from-green-400 via-green-500 to-emerald-600",
      light: "from-green-50 to-emerald-50",
      border: "border-green-200",
      text: "text-green-700",
      dot: "bg-green-500",
      statColor: "green",
    };
  }
  
  /**
   * Options cho status filter (đơn giản, không dựa vào date)
   */
  export const PROMOTION_FILTER_OPTIONS = [
    { value: "ALL", label: "🎁 Tất cả" },
    { value: "ACTIVE", label: "✅ Đang hoạt động" },
    { value: "INACTIVE", label: "❌ Đã ngừng" },
  ];
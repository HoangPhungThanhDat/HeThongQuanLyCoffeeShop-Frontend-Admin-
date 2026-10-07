
import {
  ClockIcon,
  CheckCircleIcon,
  FireIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

export const STATUS_CONFIG = {
  PENDING: {
    label: "Chờ xác nhận",
    icon: ClockIcon,
    color: "#f59e0b",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },
  CONFIRMED: {
    label: "Đã xác nhận",
    icon: CheckCircleIcon,
    color: "#3b82f6",
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  PREPARING: {
    label: "Đang chuẩn bị",
    icon: FireIcon,
    color: "#f97316",
    bg: "bg-orange-50",
    border: "border-orange-200",
    text: "text-orange-700",
  },
  SERVED: {
    label: "Đã phục vụ",
    icon: ClipboardDocumentListIcon,
    color: "#8b5cf6",
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  PAID: {
    label: "Đã thanh toán",
    icon: CurrencyDollarIcon,
    color: "#22c55e",
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-700",
  },
  CANCELLED: {
    label: "Đã hủy",
    icon: XCircleIcon,
    color: "#ef4444",
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-700",
  },
};

export const PIE_COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#f97316",
  "#8b5cf6",
  "#22c55e",
  "#ef4444",
];

export const TIME_RANGES = [
  { key: "today", label: "Hôm nay" },
  { key: "week", label: "Tuần" },
  { key: "month", label: "Tháng" },
  { key: "year", label: "Năm" },
  { key: "all", label: "Tất cả" },
];

import {
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ArrowRightOnRectangleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

export const ACTION_CONFIG = {
  CREATE: {
    label: "Tạo mới", icon: PlusCircleIcon,
    gradient: "from-green-500 to-emerald-600",
    bg: "bg-green-50", border: "border-green-200",
    text: "text-green-700", color: "#22c55e",
  },
  UPDATE: {
    label: "Cập nhật", icon: PencilSquareIcon,
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50", border: "border-blue-200",
    text: "text-blue-700", color: "#3b82f6",
  },
  DELETE: {
    label: "Xóa", icon: TrashIcon,
    gradient: "from-red-500 to-rose-600",
    bg: "bg-red-50", border: "border-red-200",
    text: "text-red-700", color: "#ef4444",
  },
  VIEW: {
    label: "Xem", icon: EyeIcon,
    gradient: "from-cyan-500 to-blue-600",
    bg: "bg-cyan-50", border: "border-cyan-200",
    text: "text-cyan-700", color: "#06b6d4",
  },
  LOGIN: {
    label: "Đăng nhập", icon: ArrowRightOnRectangleIcon,
    gradient: "from-purple-500 to-fuchsia-600",
    bg: "bg-purple-50", border: "border-purple-200",
    text: "text-purple-700", color: "#8b5cf6",
  },
  LOGOUT: {
    label: "Đăng xuất", icon: ArrowRightOnRectangleIcon,
    gradient: "from-gray-500 to-gray-700",
    bg: "bg-gray-50", border: "border-gray-200",
    text: "text-gray-700", color: "#6b7280",
  },
  SECURITY: {
    label: "Bảo mật", icon: ShieldCheckIcon,
    gradient: "from-amber-500 to-orange-600",
    bg: "bg-amber-50", border: "border-amber-200",
    text: "text-amber-700", color: "#f59e0b",
  },
};

export const LEVEL_CONFIG = {
  INFO: {
    label: "Thông tin", color: "#3b82f6",
    bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200",
  },
  SUCCESS: {
    label: "Thành công", color: "#22c55e",
    bg: "bg-green-50", text: "text-green-700", border: "border-green-200",
  },
  WARNING: {
    label: "Cảnh báo", color: "#f59e0b",
    bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200",
  },
  ERROR: {
    label: "Lỗi", color: "#ef4444",
    bg: "bg-red-50", text: "text-red-700", border: "border-red-200",
  },
};

export const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];

export const PAGE_SIZE = 20;
export const AUTO_REFRESH_INTERVAL = 30000;
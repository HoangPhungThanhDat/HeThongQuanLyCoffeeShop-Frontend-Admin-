
import {
    CheckCircleIcon,
    UsersIcon,
    ClockIcon,
  } from "@heroicons/react/24/outline";
  
  /**
   * Config cho status của bàn — Tông Cafe ấm
   */
  export const TABLE_STATUSES = {
    FREE: {
      value: "FREE",
      label: "Trống",
      emoji: "☕",
      icon: CheckCircleIcon,
      description: "Sẵn sàng phục vụ",
      // Tailwind classes
      gradient: "from-[#C89F77] via-[#B8895E] to-[#a4714b]",
      light: "from-[#faf6f1] to-[#f5ede3]",
      border: "border-[#C89F77]/50",
      text: "text-[#6d4c41]",
      dot: "bg-[#C89F77]",
      // Cho stats card (nếu cần)
      statColor: "green",
      statGradient: "from-green-500 to-emerald-600",
      statLight: "from-green-50 to-emerald-50",
      statBorder: "border-green-200",
      statText: "text-green-700",
    },
    OCCUPIED: {
      value: "OCCUPIED",
      label: "Đang dùng",
      emoji: "🫖",
      icon: UsersIcon,
      description: "Có khách đang ngồi",
      gradient: "from-[#4e342e] via-[#5d3a2f] to-[#6d4c41]",
      light: "from-[#f5ede3] to-[#e8d9c7]",
      border: "border-[#8B5E3C]/60",
      text: "text-[#4e342e]",
      dot: "bg-[#4e342e]",
      statColor: "red",
      statGradient: "from-red-500 to-rose-600",
      statLight: "from-red-50 to-rose-50",
      statBorder: "border-red-200",
      statText: "text-red-700",
    },
    RESERVED: {
      value: "RESERVED",
      label: "Đã đặt",
      emoji: "🕰️",
      icon: ClockIcon,
      description: "Khách đã đặt trước",
      gradient: "from-[#D4A574] via-[#c99862] to-[#b8895e]",
      light: "from-[#faf0e0] to-[#f5e6cc]",
      border: "border-[#D4A574]/60",
      text: "text-[#8B5E3C]",
      dot: "bg-[#D4A574]",
      statColor: "yellow",
      statGradient: "from-yellow-500 to-amber-600",
      statLight: "from-yellow-50 to-amber-50",
      statBorder: "border-yellow-200",
      statText: "text-yellow-700",
    },
  };
  
  export const TABLE_STATUS_OPTIONS = Object.values(TABLE_STATUSES);
  
  export const getStatusConfig = (status) =>
    TABLE_STATUSES[status] || TABLE_STATUSES.FREE;
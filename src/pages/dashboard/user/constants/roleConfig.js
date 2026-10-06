
import {
    ShieldCheckIcon,
    UserCircleIcon,
    UsersIcon,
  } from "@heroicons/react/24/outline";
  
  export const USER_ROLES = {
    ADMIN: {
      value: "ADMIN",
      label: "Quản trị viên",
      shortLabel: "Admin",
      emoji: "👑",
      icon: ShieldCheckIcon,
      // Tailwind classes
      bg: "bg-[#8B5E3C]",
      gradient: "from-amber-500 to-orange-600",
      light: "from-amber-50 to-orange-50",
      border: "border-amber-200",
      text: "text-amber-700",
      dot: "bg-amber-500",
      badge: "bg-amber-50 border-amber-200 text-amber-700",
    },
    EMPLOYEE: {
      value: "EMPLOYEE",
      label: "Nhân viên",
      shortLabel: "Nhân viên",
      emoji: "👤",
      icon: UserCircleIcon,
      bg: "bg-[#C89F77]",
      gradient: "from-blue-500 to-indigo-600",
      light: "from-blue-50 to-indigo-50",
      border: "border-blue-200",
      text: "text-blue-700",
      dot: "bg-blue-500",
      badge: "bg-blue-50 border-blue-200 text-blue-700",
    },
    USER: {
      value: "USER",
      label: "Khách hàng",
      shortLabel: "Khách hàng",
      emoji: "🧑",
      icon: UsersIcon,
      bg: "bg-gray-500",
      gradient: "from-gray-400 to-gray-600",
      light: "from-gray-50 to-gray-100",
      border: "border-gray-200",
      text: "text-gray-700",
      dot: "bg-gray-500",
      badge: "bg-gray-50 border-gray-200 text-gray-700",
    },
  };
  
  // Role có thể chọn khi tạo/sửa user
  export const SELECTABLE_ROLES = [USER_ROLES.ADMIN, USER_ROLES.EMPLOYEE];
  
  export const getRoleConfig = (role) => {
    const key = role?.toUpperCase();
    return USER_ROLES[key] || USER_ROLES.USER;
  };
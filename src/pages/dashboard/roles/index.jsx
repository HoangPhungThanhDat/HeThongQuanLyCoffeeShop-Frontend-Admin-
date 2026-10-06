import { useState, useEffect, useMemo } from "react";
import {
  Card,
  Typography,
  Button,
  Avatar,
  Chip,
  Switch,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Tooltip,
} from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheckIcon,
  UserGroupIcon,
  KeyIcon,
  LockClosedIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
  PencilSquareIcon,
  PlusCircleIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  SparklesIcon,
  FingerPrintIcon,
  EyeIcon,
  DocumentTextIcon,
  Squares2X2Icon,
  ShoppingBagIcon,
  ClipboardDocumentListIcon,
  RectangleStackIcon,
  GiftIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  UsersIcon,
  StarIcon,
  EnvelopeIcon,
  BanknotesIcon,
  CubeIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import { CoffeeLoader } from "@/widgets/loaders";
import Swal from "sweetalert2";

// ==================== ROLE CONFIG ====================
const ROLE_CONFIG = {
  ADMIN: {
    label: "Quản trị viên",
    emoji: "👑",
    gradient: "from-[#8B5E3C] to-[#6d4c41]",
    bg: "bg-gradient-to-br from-[#faf6f1] to-[#f5ede3]",
    border: "border-[#C89F77]/40",
    text: "text-[#8B5E3C]",
    description: "Toàn quyền quản lý hệ thống",
    color: "#8B5E3C",
  },
  MANAGER: {
    label: "Quản lý",
    emoji: "🎯",
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-gradient-to-br from-blue-50 to-indigo-50",
    border: "border-blue-200",
    text: "text-blue-700",
    description: "Quản lý cửa hàng, nhân viên, đơn hàng",
    color: "#3b82f6",
  },
  EMPLOYEE: {
    label: "Nhân viên",
    emoji: "👤",
    gradient: "from-green-500 to-emerald-600",
    bg: "bg-gradient-to-br from-green-50 to-emerald-50",
    border: "border-green-200",
    text: "text-green-700",
    description: "Xử lý đơn hàng, phục vụ khách hàng",
    color: "#22c55e",
  },
  USER: {
    label: "Khách hàng",
    emoji: "🧑",
    gradient: "from-gray-400 to-gray-600",
    bg: "bg-gradient-to-br from-gray-50 to-gray-100",
    border: "border-gray-200",
    text: "text-gray-700",
    description: "Xem sản phẩm, đặt hàng",
    color: "#6b7280",
  },
};

// ==================== PERMISSION GROUPS ====================
const PERMISSION_GROUPS = [
  {
    id: "dashboard",
    label: "Trang chủ",
    icon: Squares2X2Icon,
    gradient: "from-[#8B5E3C] to-[#6d4c41]",
    permissions: [
      { id: "dashboard.view", label: "Xem dashboard" },
      { id: "dashboard.export", label: "Xuất báo cáo" },
    ],
  },
  {
    id: "users",
    label: "Quản lý thành viên",
    icon: UserGroupIcon,
    gradient: "from-blue-500 to-indigo-600",
    permissions: [
      { id: "users.view", label: "Xem danh sách" },
      { id: "users.create", label: "Thêm mới" },
      { id: "users.edit", label: "Chỉnh sửa" },
      { id: "users.delete", label: "Xóa" },
    ],
  },
  {
    id: "products",
    label: "Quản lý sản phẩm",
    icon: ShoppingBagIcon,
    gradient: "from-amber-500 to-orange-600",
    permissions: [
      { id: "products.view", label: "Xem danh sách" },
      { id: "products.create", label: "Thêm mới" },
      { id: "products.edit", label: "Chỉnh sửa" },
      { id: "products.delete", label: "Xóa" },
      { id: "products.import", label: "Nhập kho" },
    ],
  },
  {
    id: "categories",
    label: "Quản lý danh mục",
    icon: Squares2X2Icon,
    gradient: "from-purple-500 to-fuchsia-600",
    permissions: [
      { id: "categories.view", label: "Xem danh sách" },
      { id: "categories.create", label: "Thêm mới" },
      { id: "categories.edit", label: "Chỉnh sửa" },
      { id: "categories.delete", label: "Xóa" },
    ],
  },
  {
    id: "tables",
    label: "Quản lý bàn",
    icon: RectangleStackIcon,
    gradient: "from-cyan-500 to-blue-600",
    permissions: [
      { id: "tables.view", label: "Xem sơ đồ" },
      { id: "tables.create", label: "Thêm bàn" },
      { id: "tables.edit", label: "Chỉnh sửa" },
      { id: "tables.delete", label: "Xóa" },
    ],
  },
  {
    id: "orders",
    label: "Quản lý đơn hàng",
    icon: ClipboardDocumentListIcon,
    gradient: "from-green-500 to-emerald-600",
    permissions: [
      { id: "orders.view", label: "Xem đơn hàng" },
      { id: "orders.create", label: "Tạo đơn" },
      { id: "orders.edit", label: "Chỉnh sửa" },
      { id: "orders.cancel", label: "Hủy đơn" },
      { id: "orders.delete", label: "Xóa" },
    ],
  },
  {
    id: "promotions",
    label: "Quản lý khuyến mãi",
    icon: GiftIcon,
    gradient: "from-pink-500 to-rose-600",
    permissions: [
      { id: "promotions.view", label: "Xem KM" },
      { id: "promotions.create", label: "Thêm KM" },
      { id: "promotions.edit", label: "Chỉnh sửa" },
      { id: "promotions.delete", label: "Xóa" },
    ],
  },
  {
    id: "bills",
    label: "Quản lý hóa đơn",
    icon: BanknotesIcon,
    gradient: "from-teal-500 to-cyan-600",
    permissions: [
      { id: "bills.view", label: "Xem hóa đơn" },
      { id: "bills.create", label: "Tạo hóa đơn" },
      { id: "bills.edit", label: "Chỉnh sửa" },
      { id: "bills.print", label: "In hóa đơn" },
    ],
  },
  {
    id: "reports",
    label: "Báo cáo",
    icon: ChartBarIcon,
    gradient: "from-indigo-500 to-purple-600",
    permissions: [
      { id: "reports.view", label: "Xem báo cáo" },
      { id: "reports.export", label: "Xuất dữ liệu" },
    ],
  },
  {
    id: "system",
    label: "Hệ thống",
    icon: Cog6ToothIcon,
    gradient: "from-red-500 to-rose-600",
    permissions: [
      { id: "system.settings", label: "Cài đặt hệ thống" },
      { id: "system.roles", label: "Phân quyền" },
      { id: "system.logs", label: "Xem logs" },
      { id: "system.backup", label: "Sao lưu" },
    ],
  },
];

// ==================== MOCK DATA ====================
const MOCK_ROLE_PERMISSIONS = {
  ADMIN: PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.id)),
  MANAGER: [
    "dashboard.view",
    "users.view",
    "users.create",
    "users.edit",
    "products.view",
    "products.create",
    "products.edit",
    "products.import",
    "categories.view",
    "categories.create",
    "categories.edit",
    "tables.view",
    "tables.create",
    "tables.edit",
    "orders.view",
    "orders.create",
    "orders.edit",
    "orders.cancel",
    "promotions.view",
    "promotions.create",
    "promotions.edit",
    "bills.view",
    "bills.create",
    "bills.edit",
    "bills.print",
    "reports.view",
    "reports.export",
  ],
  EMPLOYEE: [
    "dashboard.view",
    "tables.view",
    "orders.view",
    "orders.create",
    "orders.edit",
    "bills.view",
    "bills.create",
    "bills.print",
    "products.view",
    "categories.view",
  ],
  USER: ["dashboard.view", "products.view"],
};

const MOCK_USERS = [
  { id: 1, fullName: "Hoàng Phùng Thành Đạt", username: "admin", role: "ADMIN", avatar: "H", email: "admin@coffeeshop.vn", isActive: true },
  { id: 2, fullName: "Nguyễn Văn A", username: "manager1", role: "MANAGER", avatar: "A", email: "manager@coffeeshop.vn", isActive: true },
  { id: 3, fullName: "Trần Thị B", username: "employee1", role: "EMPLOYEE", avatar: "B", email: "employee1@coffeeshop.vn", isActive: true },
  { id: 4, fullName: "Lê Văn C", username: "employee2", role: "EMPLOYEE", avatar: "C", email: "employee2@coffeeshop.vn", isActive: true },
  { id: 5, fullName: "Phạm Thị D", username: "customer1", role: "USER", avatar: "D", email: "customer1@gmail.com", isActive: true },
  { id: 6, fullName: "Vũ Văn E", username: "customer2", role: "USER", avatar: "E", email: "customer2@gmail.com", isActive: false },
];

export function Roles() {
  const [loading, setLoading] = useState(true);
  const [rolePermissions, setRolePermissions] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedRole, setSelectedRole] = useState("ADMIN");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPermissions, setEditingPermissions] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // ==================== FETCH ====================
  useEffect(() => {
    setTimeout(() => {
      setRolePermissions(MOCK_ROLE_PERMISSIONS);
      setUsers(MOCK_USERS);
      setLoading(false);
    }, 1200);
  }, []);

  // ==================== STATS ====================
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const totalRoles = Object.keys(ROLE_CONFIG).length;
    const totalPermissions = PERMISSION_GROUPS.reduce(
      (s, g) => s + g.permissions.length,
      0
    );
    const activeUsers = users.filter((u) => u.isActive).length;

    return { totalUsers, totalRoles, totalPermissions, activeUsers };
  }, [users]);

  // ==================== FILTER USERS ====================
  const filteredUsers = useMemo(() => {
    let result = [...users];
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (u) =>
          u.fullName?.toLowerCase().includes(term) ||
          u.username?.toLowerCase().includes(term) ||
          u.email?.toLowerCase().includes(term)
      );
    }
    return result;
  }, [users, searchTerm]);

  const usersInSelectedRole = useMemo(
    () => users.filter((u) => u.role === selectedRole),
    [users, selectedRole]
  );

  // ==================== HANDLERS ====================
  const handleTogglePermission = (permId) => {
    setEditingPermissions((prev) => {
      const current = prev || rolePermissions[selectedRole] || [];
      const updated = current.includes(permId)
        ? current.filter((p) => p !== permId)
        : [...current, permId];
      return updated;
    });
    setHasChanges(true);
  };

  const handleToggleGroup = (groupId, allPerms) => {
    setEditingPermissions((prev) => {
      const current = prev || rolePermissions[selectedRole] || [];
      const allSelected = allPerms.every((p) => current.includes(p));
      const updated = allSelected
        ? current.filter((p) => !allPerms.includes(p))
        : [...new Set([...current, ...allPerms])];
      return updated;
    });
    setHasChanges(true);
  };

  const handleSavePermissions = () => {
    Swal.fire({
      title: "Lưu thay đổi?",
      text: `Cập nhật quyền cho vai trò ${ROLE_CONFIG[selectedRole]?.label}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8B5E3C",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Lưu",
      cancelButtonText: "Hủy",
    }).then((r) => {
      if (r.isConfirmed) {
        setRolePermissions((prev) => ({
          ...prev,
          [selectedRole]: editingPermissions,
        }));
        setEditingPermissions(null);
        setHasChanges(false);
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Đã lưu quyền!",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleReset = () => {
    setEditingPermissions(null);
    setHasChanges(false);
  };

  // ==================== LOADER ====================
  if (loading) {
    return (
      <CoffeeLoader
        title="Đang pha chế phân quyền"
        subtitle="Vui lòng chờ trong giây lát"
      />
    );
  }

  const currentPermissions =
    editingPermissions || rolePermissions[selectedRole] || [];

  // ==================== MAIN RENDER ====================
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6">

        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg shadow-[#8B5E3C]/30 flex-shrink-0"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <ShieldCheckIcon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </motion.div>
            <div>
              <Typography
                variant="h4"
                className="font-extrabold text-[#4e342e] tracking-tight text-2xl lg:text-3xl"
              >
                Phân Quyền Hệ Thống
              </Typography>
              <Typography className="text-xs lg:text-sm text-[#8B5E3C] font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Quản lý vai trò và quyền truy cập
              </Typography>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outlined"
              className="flex items-center justify-center gap-2 border-2 border-[#8B5E3C]/40 text-[#6d4c41] hover:bg-[#faf6f1] hover:border-[#8B5E3C] rounded-xl normal-case font-bold px-4 py-2.5"
              onClick={() => window.location.reload()}
            >
              <ArrowPathIcon className="h-4 w-4" strokeWidth={2.5} />
            </Button>
            <Button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] shadow-lg shadow-[#8B5E3C]/30 rounded-xl normal-case font-bold px-5 py-2.5 flex-1 md:flex-none">
              <PlusCircleIcon className="h-4 w-4" strokeWidth={2.5} />
              Thêm vai trò
            </Button>
          </div>
        </motion.div>

        {/* ===== KPI CARDS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            {
              title: "Tổng người dùng",
              value: stats.totalUsers,
              unit: "người",
              icon: UsersIcon,
              gradient: "from-[#8B5E3C] to-[#6d4c41]",
              badge: `${stats.activeUsers} active`,
            },
            {
              title: "Vai trò",
              value: stats.totalRoles,
              unit: "vai trò",
              icon: ShieldCheckIcon,
              gradient: "from-blue-500 to-indigo-600",
              badge: "Roles",
            },
            {
              title: "Quyền hạn",
              value: stats.totalPermissions,
              unit: "quyền",
              icon: KeyIcon,
              gradient: "from-green-500 to-emerald-600",
              badge: "Permissions",
            },
            {
              title: "Nhóm quyền",
              value: PERMISSION_GROUPS.length,
              unit: "nhóm",
              icon: Squares2X2Icon,
              gradient: "from-purple-500 to-fuchsia-600",
              badge: "Groups",
            },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden bg-white rounded-2xl p-5 shadow-md hover:shadow-2xl border border-amber-100 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#f5ede3] to-transparent rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#faf6f1] border border-[#C89F77]/30">
                    <Typography className="text-[9px] font-extrabold text-[#8B5E3C] uppercase">
                      {s.badge}
                    </Typography>
                  </div>
                </div>
                <div className="relative">
                  <Typography className="text-[10px] font-extrabold uppercase text-gray-400 tracking-[0.15em] mb-1">
                    {s.title}
                  </Typography>
                  <div className="flex items-end gap-2">
                    <Typography className="text-2xl font-extrabold text-[#4e342e] leading-none">
                      {s.value}
                    </Typography>
                    <span className="text-[10px] font-semibold text-gray-400 mb-1">
                      {s.unit}
                    </span>
                  </div>
                </div>
                <div className="relative mt-4 h-1 rounded-full bg-[#faf6f1] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    className={`h-full rounded-full bg-gradient-to-r ${s.gradient}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===== SECTION: ROLES ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
          <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
            Vai trò hệ thống
          </Typography>
        </motion.div>

        {/* ===== ROLE CARDS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {Object.entries(ROLE_CONFIG).map(([key, cfg], i) => {
            const isActive = selectedRole === key;
            const userCount = users.filter((u) => u.role === key).length;
            const permCount = (rolePermissions[key] || []).length;
            const totalPerm = stats.totalPermissions;
            const percent = (permCount / totalPerm) * 100;

            return (
              <motion.button
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06 }}
                whileHover={{ y: -4 }}
                onClick={() => {
                  setSelectedRole(key);
                  setEditingPermissions(null);
                  setHasChanges(false);
                }}
                className={`group relative overflow-hidden rounded-2xl p-5 shadow-md hover:shadow-2xl border-2 transition-all duration-300 text-left ${
                  isActive
                    ? `${cfg.bg} ${cfg.border} border-[#8B5E3C] shadow-lg`
                    : "bg-white border-amber-100"
                }`}
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#f5ede3] to-transparent rounded-full -translate-y-12 translate-x-12 opacity-60" />

                <div className="relative flex items-center gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-lg text-xl`}
                  >
                    {cfg.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className={`text-sm font-extrabold ${cfg.text}`}>
                      {cfg.label}
                    </Typography>
                    <Typography className="text-[10px] text-gray-500 font-medium">
                      {cfg.description}
                    </Typography>
                  </div>
                  {isActive && (
                    <CheckCircleIcon className="w-4 h-4 text-[#8B5E3C] flex-shrink-0" strokeWidth={2.5} />
                  )}
                </div>

                {/* Stats */}
                <div className="relative grid grid-cols-2 gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-white/60 border border-white/80">
                    <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Người dùng
                    </Typography>
                    <Typography className="text-sm font-extrabold text-[#4e342e]">
                      {userCount}
                    </Typography>
                  </div>
                  <div className="p-2 rounded-lg bg-white/60 border border-white/80">
                    <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Quyền
                    </Typography>
                    <Typography className="text-sm font-extrabold text-[#4e342e]">
                      {permCount}
                    </Typography>
                  </div>
                </div>

                {/* Progress */}
                <div className="relative">
                  <div className="h-1.5 rounded-full bg-white/60 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.06 }}
                      className={`h-full rounded-full bg-gradient-to-r ${cfg.gradient}`}
                    />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ===== PERMISSION MATRIX ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ROLE_CONFIG[selectedRole].gradient} flex items-center justify-center shadow-lg`}>
                    <ShieldCheckIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Typography className="font-extrabold text-[#4e342e] text-sm">
                      Quyền của vai trò: {ROLE_CONFIG[selectedRole].label}
                    </Typography>
                    <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                      {currentPermissions.length} / {stats.totalPermissions} quyền được cấp
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <>
                      <Button
                        size="sm"
                        variant="outlined"
                        className="border-2 border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg normal-case font-bold px-3 py-2 text-[10px]"
                        onClick={handleReset}
                      >
                        Hủy thay đổi
                      </Button>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] rounded-lg normal-case font-bold px-4 py-2 text-[10px] flex items-center gap-1.5"
                        onClick={handleSavePermissions}
                      >
                        <CheckCircleIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                        Lưu thay đổi
                      </Button>
                    </>
                  )}
                  {!hasChanges && (
                    <Chip
                      value={`${currentPermissions.length} quyền`}
                      className="bg-[#faf6f1] text-[#6d4c41] border border-[#C89F77]/30 text-[10px] font-extrabold uppercase"
                      size="sm"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Permission Grid */}
            <div className="p-5 lg:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {PERMISSION_GROUPS.map((group) => {
                  const Icon = group.icon;
                  const allPerms = group.permissions.map((p) => p.id);
                  const allSelected = allPerms.every((p) =>
                    currentPermissions.includes(p)
                  );
                  const someSelected = allPerms.some((p) =>
                    currentPermissions.includes(p)
                  );
                  const selectedCount = allPerms.filter((p) =>
                    currentPermissions.includes(p)
                  ).length;

                  return (
                    <div
                      key={group.id}
                      className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                        someSelected
                          ? "border-[#C89F77]/40 bg-gradient-to-br from-[#faf6f1] to-[#fffaf5]"
                          : "border-amber-100 bg-white"
                      }`}
                    >
                      {/* Group Header */}
                      <div className="flex items-center justify-between p-3 border-b border-amber-100">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br ${group.gradient} flex items-center justify-center shadow-sm ${
                              someSelected ? "opacity-100" : "opacity-60"
                            } transition-opacity`}
                          >
                            <Icon className="w-4 h-4 text-white" strokeWidth={2.2} />
                          </div>
                          <div className="min-w-0">
                            <Typography className="text-xs font-extrabold text-[#4e342e] truncate">
                              {group.label}
                            </Typography>
                            <Typography className="text-[10px] text-gray-500">
                              {selectedCount}/{allPerms.length} quyền
                            </Typography>
                          </div>
                        </div>
                        <Switch
                          checked={allSelected}
                          onChange={() => handleToggleGroup(group.id, allPerms)}
                          className="checked:bg-[#8B5E3C]"
                        />
                      </div>

                      {/* Permission List */}
                      <div className="p-2 space-y-1">
                        {group.permissions.map((perm) => {
                          const isGranted = currentPermissions.includes(perm.id);
                          return (
                            <label
                              key={perm.id}
                              className={`flex items-center justify-between gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                                isGranted
                                  ? "bg-white border border-[#C89F77]/30"
                                  : "hover:bg-white border border-transparent"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {isGranted ? (
                                  <CheckCircleIcon
                                    className="w-4 h-4 text-green-600 flex-shrink-0"
                                    strokeWidth={2.5}
                                  />
                                ) : (
                                  <XCircleIcon
                                    className="w-4 h-4 text-gray-300 flex-shrink-0"
                                    strokeWidth={2.5}
                                  />
                                )}
                                <Typography
                                  className={`text-[11px] font-bold truncate ${
                                    isGranted ? "text-[#4e342e]" : "text-gray-400"
                                  }`}
                                >
                                  {perm.label}
                                </Typography>
                              </div>
                              <Switch
                                checked={isGranted}
                                onChange={() => handleTogglePermission(perm.id)}
                                className="checked:bg-[#8B5E3C] !w-9 !h-5"
                              />
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* ===== USERS IN ROLE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center gap-3 mt-2"
        >
          <div className="w-1 h-6 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
          <Typography className="font-extrabold text-[#4e342e] text-lg tracking-tight">
            Người dùng vai trò {ROLE_CONFIG[selectedRole].label}
          </Typography>
          <span className="ml-auto text-[10px] font-extrabold text-[#8B5E3C] bg-white border border-[#C89F77]/30 px-2.5 py-1 rounded-lg">
            {usersInSelectedRole.length} người
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
            {/* Search bar */}
            <div className="p-4 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]" />
                <input
                  type="text"
                  placeholder="Tìm người dùng trong vai trò này..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white border border-[#C89F77]/30 text-xs font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40"
                />
              </div>
            </div>

            {/* Users list */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              {usersInSelectedRole.length === 0 ? (
                <div className="md:col-span-2 text-center py-12">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-3">
                    <UsersIcon className="w-8 h-8 text-[#C89F77]" />
                  </div>
                  <Typography className="text-sm font-bold text-[#8B5E3C] mb-1">
                    Chưa có người dùng nào
                  </Typography>
                  <Typography className="text-xs text-gray-400 mb-3">
                    Vai trò này chưa được gán cho người dùng nào
                  </Typography>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] rounded-lg normal-case font-bold flex items-center gap-1.5 mx-auto"
                  >
                    <UserPlusIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                    Thêm người dùng
                  </Button>
                </div>
              ) : (
                usersInSelectedRole.map((user, i) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#faf6f1] border border-amber-100 hover:border-[#C89F77]/40 hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${ROLE_CONFIG[user.role].gradient} flex items-center justify-center text-white text-sm font-extrabold shadow-md`}
                      >
                        {user.avatar}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          user.isActive ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Typography className="text-xs font-extrabold text-[#4e342e] truncate">
                        {user.fullName}
                      </Typography>
                      <Typography className="text-[10px] text-gray-500 truncate">
                        @{user.username} · {user.email}
                      </Typography>
                    </div>
                    <Tooltip content="Xem chi tiết" placement="top">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-[#C89F77]/30 hover:bg-[#8B5E3C] text-[#6d4c41] hover:text-white transition-all duration-200">
                        <EyeIcon className="w-4 h-4" strokeWidth={2.2} />
                      </button>
                    </Tooltip>
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </motion.div>

        {/* ===== INFO NOTE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <ExclamationTriangleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Lưu ý:</span> Thay đổi quyền hạn sẽ ảnh
            hưởng đến tất cả người dùng có vai trò này. Vai trò{" "}
            <span className="font-bold">Quản trị viên</span> có toàn quyền và
            không nên chỉnh sửa. Nhấn "Lưu thay đổi" để áp dụng.
          </Typography>
        </motion.div>

        {/* ===== FOOTER ===== */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-amber-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center text-xs">
              ☕
            </div>
            <Typography className="text-xs text-[#6d4c41] font-bold">
              Coffee Shop Admin © 2025
            </Typography>
          </div>
          <Typography className="text-[10px] text-gray-400 font-medium">
            {stats.totalRoles} vai trò · {stats.totalPermissions} quyền hạn
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default Roles;
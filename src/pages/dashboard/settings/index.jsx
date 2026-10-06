import { useState } from "react";
import {
  Card,
  Typography,
  Button,
  Switch,
  Input,
  Textarea,
  Select,
  Option,
  Chip,
  Avatar,
} from "@material-tailwind/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cog6ToothIcon,
  PaintBrushIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  CreditCardIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ClockIcon,
  CurrencyDollarIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  BellAlertIcon,
  EnvelopeOpenIcon,
  DeviceTabletIcon,
  KeyIcon,
  LockClosedIcon,
  FingerPrintIcon,
  UserGroupIcon,
  DocumentTextIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  CloudArrowUpIcon,
  TrashIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  PhotoIcon,
  CameraIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

export function Settings() {
  const [activeTab, setActiveTab] = useState("general");

  // ==================== STATES ====================
  const [generalSettings, setGeneralSettings] = useState({
    shopName: "Coffee Shop",
    email: "contact@coffeeshop.vn",
    phone: "0123 456 789",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    taxCode: "0312345678",
    currency: "VND",
    language: "vi",
    timezone: "Asia/Ho_Chi_Minh",
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    primaryColor: "#8B5E3C",
    fontSize: "medium",
    compactMode: false,
    animations: true,
    soundEffects: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotif: true,
    orderNotif: true,
    stockNotif: true,
    reviewNotif: false,
    reportNotif: true,
    soundNotif: true,
    desktopNotif: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    sessionTimeout: "30",
    ipWhitelist: false,
    loginAlerts: true,
    autoBackup: true,
    backupFrequency: "daily",
  });

  // ==================== TABS ====================
  const tabs = [
    { key: "general", label: "Chung", icon: Cog6ToothIcon, gradient: "from-[#8B5E3C] to-[#6d4c41]" },
    { key: "appearance", label: "Giao diện", icon: PaintBrushIcon, gradient: "from-purple-500 to-fuchsia-600" },
    { key: "notifications", label: "Thông báo", icon: BellIcon, gradient: "from-amber-500 to-orange-600" },
    { key: "security", label: "Bảo mật", icon: ShieldCheckIcon, gradient: "from-green-500 to-emerald-600" },
  ];

  // ==================== HANDLERS ====================
  const handleSave = () => {
    Swal.fire({
      title: "Lưu thay đổi?",
      text: "Các thay đổi sẽ được áp dụng ngay lập tức.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#8B5E3C",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Lưu ngay",
      cancelButtonText: "Hủy",
    }).then((r) => {
      if (r.isConfirmed) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Đã lưu thay đổi!",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleReset = () => {
    Swal.fire({
      title: "Khôi phục mặc định?",
      text: "Tất cả cài đặt sẽ trở về mặc định ban đầu!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B5E3C",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Khôi phục",
      cancelButtonText: "Hủy",
    });
  };

  const handleBackup = () => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Đang sao lưu dữ liệu...",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6">

        {/* ===== PAGE HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg shadow-[#8B5E3C]/30 flex-shrink-0"
              animate={{ rotate: [0, 90, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Cog6ToothIcon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </motion.div>
            <div>
              <Typography
                variant="h4"
                className="font-extrabold text-[#4e342e] tracking-tight text-2xl lg:text-3xl"
              >
                Cài Đặt Hệ Thống
              </Typography>
              <Typography className="text-xs lg:text-sm text-[#8B5E3C] font-medium flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Tùy chỉnh hệ thống theo nhu cầu của bạn
              </Typography>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <Button
              variant="outlined"
              className="flex items-center justify-center gap-2 border-2 border-[#8B5E3C]/40 text-[#6d4c41] hover:bg-[#faf6f1] hover:border-[#8B5E3C] rounded-xl normal-case font-bold px-4 py-2.5"
              onClick={handleReset}
            >
              <ArrowPathIcon className="h-4 w-4" strokeWidth={2.5} />
              Khôi phục
            </Button>
            <Button
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] shadow-lg shadow-[#8B5E3C]/30 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl normal-case font-bold flex-1 md:flex-none px-6 py-2.5 text-sm"
              onClick={handleSave}
            >
              <CheckCircleIcon className="h-4 w-4" strokeWidth={2.5} />
              Lưu thay đổi
            </Button>
          </div>
        </motion.div>

        {/* ===== MAIN LAYOUT: SIDEBAR TABS + CONTENT ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

          {/* ===== SIDEBAR TABS ===== */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-3 rounded-3xl border border-amber-100 shadow-xl bg-white sticky top-4">
              <div className="px-3 py-2 mb-2">
                <Typography className="text-[10px] font-extrabold uppercase text-gray-400 tracking-widest">
                  Danh mục cài đặt
                </Typography>
              </div>
              <ul className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;
                  return (
                    <li key={tab.key}>
                      <button
                        onClick={() => setActiveTab(tab.key)}
                        className={`group relative w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
                          isActive
                            ? `bg-gradient-to-r ${tab.gradient} shadow-lg`
                            : "hover:bg-[#faf6f1] border border-transparent hover:border-[#C89F77]/20"
                        }`}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white/80 rounded-r-full" />
                        )}
                        <div
                          className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? "bg-white/20"
                              : "bg-[#f5ede3] group-hover:bg-[#8B5E3C]"
                          }`}
                        >
                          <Icon
                            className={`w-4.5 h-4.5 transition-colors duration-300 ${
                              isActive
                                ? "text-white"
                                : "text-[#8B5E3C] group-hover:text-white"
                            }`}
                            strokeWidth={2.2}
                          />
                        </div>
                        <Typography
                          className={`flex-1 text-left text-sm font-bold transition-colors duration-300 ${
                            isActive
                              ? "text-white"
                              : "text-[#4e342e] group-hover:text-[#8B5E3C]"
                          }`}
                        >
                          {tab.label}
                        </Typography>
                        {!isActive && (
                          <svg
                            className="w-3.5 h-3.5 text-[#C89F77] opacity-0 group-hover:opacity-100 transition-opacity"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Footer info */}
              <div className="mt-4 p-3 rounded-xl bg-gradient-to-br from-[#faf6f1] to-[#f5ede3] border border-[#C89F77]/20">
                <div className="flex items-center gap-2 mb-1.5">
                  <SparklesIcon className="w-3.5 h-3.5 text-[#8B5E3C]" />
                  <Typography className="text-[10px] font-extrabold text-[#8B5E3C] uppercase tracking-wider">
                    Phiên bản
                  </Typography>
                </div>
                <Typography className="text-xs font-extrabold text-[#4e342e]">
                  Coffee Shop Admin v2.5.1
                </Typography>
                <Typography className="text-[10px] text-gray-500 mt-0.5">
                  Cập nhật lần cuối: 14/09/2026
                </Typography>
              </div>
            </Card>
          </motion.div>

          {/* ===== CONTENT AREA ===== */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="min-w-0"
          >
            <AnimatePresence mode="wait">
              {/* ==================== GENERAL TAB ==================== */}
              {activeTab === "general" && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  {/* Shop Info */}
                  <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
                    <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg">
                          <BuildingOfficeIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography className="font-extrabold text-[#4e342e] text-sm">
                            Thông tin cửa hàng
                          </Typography>
                          <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                            Thông tin cơ bản về quán cà phê của bạn
                          </Typography>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 lg:p-6">
                      {/* Logo + Name */}
                      <div className="flex flex-col sm:flex-row items-start gap-6 mb-6">
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg text-4xl">
                            ☕
                          </div>
                          <label className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-white hover:bg-[#8B5E3C] text-[#8B5E3C] hover:text-white border-2 border-white shadow-md cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-110">
                            <CameraIcon className="w-4 h-4" strokeWidth={2.2} />
                            <input type="file" accept="image/*" className="hidden" />
                          </label>
                        </div>
                        <div className="flex-1">
                          <Typography className="text-sm font-extrabold text-[#4e342e] mb-1">
                            Logo cửa hàng
                          </Typography>
                          <Typography className="text-xs text-gray-500 mb-3 leading-relaxed">
                            Upload logo (PNG, JPG, SVG). Kích thước tối đa 2MB.
                            Kích thước khuyến nghị 512x512px.
                          </Typography>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outlined"
                              className="border-2 border-[#8B5E3C]/40 text-[#6d4c41] rounded-lg normal-case font-bold flex items-center gap-1.5 px-3 py-1.5 text-[10px]"
                            >
                              <CloudArrowUpIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Tải lên
                            </Button>
                            <Button
                              size="sm"
                              variant="text"
                              className="text-red-500 hover:bg-red-50 rounded-lg normal-case font-bold flex items-center gap-1.5 px-3 py-1.5 text-[10px]"
                            >
                              <TrashIcon className="w-3.5 h-3.5" strokeWidth={2.5} />
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Form grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative md:col-span-2">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                            <BuildingOfficeIcon className="h-5 w-5 text-[#8B5E3C]" />
                          </div>
                          <Input
                            label="Tên cửa hàng *"
                            value={generalSettings.shopName}
                            onChange={(e) =>
                              setGeneralSettings((p) => ({ ...p, shopName: e.target.value }))
                            }
                            className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                            labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                          />
                        </div>

                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                            <EnvelopeIcon className="h-5 w-5 text-[#8B5E3C]" />
                          </div>
                          <Input
                            label="Email liên hệ"
                            type="email"
                            value={generalSettings.email}
                            onChange={(e) =>
                              setGeneralSettings((p) => ({ ...p, email: e.target.value }))
                            }
                            className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                            labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                          />
                        </div>

                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                            <PhoneIcon className="h-5 w-5 text-[#8B5E3C]" />
                          </div>
                          <Input
                            label="Số điện thoại"
                            value={generalSettings.phone}
                            onChange={(e) =>
                              setGeneralSettings((p) => ({ ...p, phone: e.target.value }))
                            }
                            className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                            labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                          />
                        </div>

                        <div className="relative md:col-span-2">
                          <div className="absolute left-3 top-3 z-10 pointer-events-none">
                            <MapPinIcon className="h-5 w-5 text-[#8B5E3C]" />
                          </div>
                          <Textarea
                            label="Địa chỉ"
                            value={generalSettings.address}
                            onChange={(e) =>
                              setGeneralSettings((p) => ({ ...p, address: e.target.value }))
                            }
                            className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                            labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                            rows={2}
                          />
                        </div>

                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                            <DocumentTextIcon className="h-5 w-5 text-[#8B5E3C]" />
                          </div>
                          <Input
                            label="Mã số thuế"
                            value={generalSettings.taxCode}
                            onChange={(e) =>
                              setGeneralSettings((p) => ({ ...p, taxCode: e.target.value }))
                            }
                            className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                            labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                          />
                        </div>

                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                            <CurrencyDollarIcon className="h-5 w-5 text-[#8B5E3C]" />
                          </div>
                          <Select
                            label="Đơn vị tiền tệ"
                            value={generalSettings.currency}
                            onChange={(v) =>
                              setGeneralSettings((p) => ({ ...p, currency: v }))
                            }
                            className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                            labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                            menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                          >
                            <Option value="VND">🇻🇳 VND - Việt Nam Đồng</Option>
                            <Option value="USD">🇺🇸 USD - Đô la Mỹ</Option>
                            <Option value="EUR">🇪🇺 EUR - Euro</Option>
                          </Select>
                        </div>

                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                            <LanguageIcon className="h-5 w-5 text-[#8B5E3C]" />
                          </div>
                          <Select
                            label="Ngôn ngữ"
                            value={generalSettings.language}
                            onChange={(v) =>
                              setGeneralSettings((p) => ({ ...p, language: v }))
                            }
                            className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                            labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                            menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                          >
                            <Option value="vi">🇻🇳 Tiếng Việt</Option>
                            <Option value="en">🇺🇸 English</Option>
                            <Option value="jp">🇯🇵 日本語</Option>
                          </Select>
                        </div>

                        <div className="relative md:col-span-2">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                            <ClockIcon className="h-5 w-5 text-[#8B5E3C]" />
                          </div>
                          <Select
                            label="Múi giờ"
                            value={generalSettings.timezone}
                            onChange={(v) =>
                              setGeneralSettings((p) => ({ ...p, timezone: v }))
                            }
                            className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                            labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                            menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                          >
                            <Option value="Asia/Ho_Chi_Minh">🇻🇳 (GMT+7) Hồ Chí Minh</Option>
                            <Option value="Asia/Bangkok">🇹🇭 (GMT+7) Bangkok</Option>
                            <Option value="Asia/Singapore">🇸🇬 (GMT+8) Singapore</Option>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Business Hours */}
                  <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
                    <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <ClockIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography className="font-extrabold text-[#4e342e] text-sm">
                            Giờ mở cửa
                          </Typography>
                          <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                            Thời gian hoạt động của quán
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 lg:p-6 space-y-3">
                      {[
                        { day: "Thứ 2 - Thứ 6", open: "07:00", close: "22:00", active: true },
                        { day: "Thứ 7", open: "07:00", close: "23:00", active: true },
                        { day: "Chủ nhật", open: "08:00", close: "22:00", active: true },
                      ].map((row, i) => (
                        <div
                          key={i}
                          className="flex flex-wrap items-center gap-3 p-3 rounded-xl bg-[#faf6f1] border border-amber-100 hover:border-[#C89F77]/30 transition-colors"
                        >
                          <div className="flex-1 min-w-[140px]">
                            <Typography className="text-xs font-extrabold text-[#4e342e]">
                              {row.day}
                            </Typography>
                          </div>
                          <Input
                            type="time"
                            value={row.open}
                            className="!w-28 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-lg text-xs"
                            labelProps={{ className: "hidden" }}
                          />
                          <span className="text-xs font-bold text-gray-400">→</span>
                          <Input
                            type="time"
                            value={row.close}
                            className="!w-28 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-lg text-xs"
                            labelProps={{ className: "hidden" }}
                          />
                          <Switch defaultChecked={row.active} className="checked:bg-[#8B5E3C]" />
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ==================== APPEARANCE TAB ==================== */}
              {activeTab === "appearance" && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  {/* Theme */}
                  <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
                    <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-fuchsia-600 flex items-center justify-center shadow-lg">
                          <PaintBrushIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography className="font-extrabold text-[#4e342e] text-sm">
                            Chủ đề hiển thị
                          </Typography>
                          <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                            Chọn giao diện bạn yêu thích
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 lg:p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                          {
                            value: "light",
                            label: "Sáng",
                            icon: SunIcon,
                            gradient: "from-amber-400 to-orange-500",
                            preview: "bg-[#faf6f1]",
                          },
                          {
                            value: "dark",
                            label: "Tối",
                            icon: MoonIcon,
                            gradient: "from-slate-700 to-gray-900",
                            preview: "bg-gray-900",
                          },
                          {
                            value: "system",
                            label: "Hệ thống",
                            icon: ComputerDesktopIcon,
                            gradient: "from-blue-500 to-indigo-600",
                            preview: "bg-gradient-to-br from-gray-100 to-gray-800",
                          },
                        ].map((t) => {
                          const Icon = t.icon;
                          const isActive = appearanceSettings.theme === t.value;
                          return (
                            <button
                              key={t.value}
                              onClick={() =>
                                setAppearanceSettings((p) => ({ ...p, theme: t.value }))
                              }
                              className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 text-left overflow-hidden ${
                                isActive
                                  ? "border-[#8B5E3C] bg-[#faf6f1] shadow-lg"
                                  : "border-amber-100 hover:border-[#C89F77]/40 bg-white"
                              }`}
                            >
                              {/* Preview */}
                              <div
                                className={`w-full h-20 rounded-xl mb-3 ${t.preview} border border-gray-200 shadow-inner relative overflow-hidden`}
                              >
                                <div className="absolute top-2 left-2 right-2 h-2 rounded-full bg-white/50" />
                                <div className="absolute top-5 left-2 w-12 h-1.5 rounded-full bg-white/40" />
                                <div className="absolute bottom-2 left-2 right-2 h-6 rounded-lg bg-white/30" />
                              </div>

                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${t.gradient} flex items-center justify-center shadow-sm`}
                                >
                                  <Icon className="w-4 h-4 text-white" strokeWidth={2.2} />
                                </div>
                                <Typography
                                  className={`text-xs font-extrabold ${
                                    isActive ? "text-[#8B5E3C]" : "text-[#4e342e]"
                                  }`}
                                >
                                  {t.label}
                                </Typography>
                                {isActive && (
                                  <CheckCircleIcon
                                    className="w-4 h-4 text-[#8B5E3C] ml-auto"
                                    strokeWidth={2.5}
                                  />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </Card>

                  {/* Primary Color */}
                  <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
                    <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg">
                          <SparklesIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography className="font-extrabold text-[#4e342e] text-sm">
                            Màu chủ đạo
                          </Typography>
                          <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                            Màu sắc thương hiệu của bạn
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 lg:p-6">
                      <div className="flex flex-wrap gap-3 mb-4">
                        {[
                          { name: "Nâu cafe", value: "#8B5E3C" },
                          { name: "Nâu đậm", value: "#6d4c41" },
                          { name: "Nâu nhạt", value: "#C89F77" },
                          { name: "Xanh lá", value: "#22c55e" },
                          { name: "Xanh dương", value: "#3b82f6" },
                          { name: "Tím", value: "#8b5cf6" },
                          { name: "Đỏ", value: "#ef4444" },
                          { name: "Cam", value: "#f59e0b" },
                        ].map((color) => {
                          const isActive =
                            appearanceSettings.primaryColor === color.value;
                          return (
                            <button
                              key={color.value}
                              onClick={() =>
                                setAppearanceSettings((p) => ({
                                  ...p,
                                  primaryColor: color.value,
                                }))
                              }
                              title={color.name}
                              className={`group relative w-12 h-12 rounded-xl border-4 transition-all duration-300 ${
                                isActive
                                  ? "border-[#4e342e] scale-110 shadow-lg"
                                  : "border-white shadow-md hover:scale-105"
                              }`}
                              style={{ backgroundColor: color.value }}
                            >
                              {isActive && (
                                <CheckCircleIcon
                                  className="w-5 h-5 text-white absolute inset-0 m-auto"
                                  strokeWidth={3}
                                />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-3 p-3 rounded-xl bg-[#faf6f1] border border-amber-100">
                        <div
                          className="w-8 h-8 rounded-lg shadow-sm"
                          style={{
                            backgroundColor: appearanceSettings.primaryColor,
                          }}
                        />
                        <div className="flex-1">
                          <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                            Mã màu hiện tại
                          </Typography>
                          <Typography className="text-xs font-extrabold text-[#4e342e]">
                            {appearanceSettings.primaryColor}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Display Options */}
                  <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
                    <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                          <DevicePhoneMobileIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography className="font-extrabold text-[#4e342e] text-sm">
                            Tùy chọn hiển thị
                          </Typography>
                          <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                            Cá nhân hóa trải nghiệm
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 lg:p-6 space-y-3">
                      {[
                        {
                          key: "compactMode",
                          icon: DeviceTabletIcon,
                          label: "Chế độ thu gọn",
                          description: "Giảm khoảng cách giữa các phần tử",
                        },
                        {
                          key: "animations",
                          icon: SparklesIcon,
                          label: "Hiệu ứng động",
                          description: "Bật/tắt các animation chuyển động",
                        },
                        {
                          key: "soundEffects",
                          icon: BellAlertIcon,
                          label: "Âm thanh",
                          description: "Âm thanh khi thực hiện hành động",
                        },
                      ].map((opt) => {
                        const Icon = opt.icon;
                        const value = appearanceSettings[opt.key];
                        return (
                          <div
                            key={opt.key}
                            className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#faf6f1] border border-amber-100 hover:border-[#C89F77]/30 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white border border-[#C89F77]/30 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-[#8B5E3C]" strokeWidth={2.2} />
                              </div>
                              <div className="min-w-0">
                                <Typography className="text-xs font-extrabold text-[#4e342e]">
                                  {opt.label}
                                </Typography>
                                <Typography className="text-[10px] text-gray-500 truncate">
                                  {opt.description}
                                </Typography>
                              </div>
                            </div>
                            <Switch
                              checked={value}
                              onChange={() =>
                                setAppearanceSettings((p) => ({
                                  ...p,
                                  [opt.key]: !p[opt.key],
                                }))
                              }
                              className="checked:bg-[#8B5E3C]"
                            />
                          </div>
                        );
                      })}

                      {/* Font size */}
                      <div className="p-3 rounded-xl bg-[#faf6f1] border border-amber-100">
                        <Typography className="text-xs font-extrabold text-[#4e342e] mb-2">
                          Cỡ chữ
                        </Typography>
                        <div className="flex gap-2">
                          {[
                            { value: "small", label: "Nhỏ", size: "text-xs" },
                            { value: "medium", label: "Vừa", size: "text-sm" },
                            { value: "large", label: "Lớn", size: "text-base" },
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() =>
                                setAppearanceSettings((p) => ({
                                  ...p,
                                  fontSize: opt.value,
                                }))
                              }
                              className={`flex-1 py-2 rounded-lg text-xs font-extrabold uppercase tracking-wider transition-all ${
                                appearanceSettings.fontSize === opt.value
                                  ? "bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] text-white shadow-md"
                                  : "bg-white text-[#6d4c41] border border-[#C89F77]/30"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ==================== NOTIFICATIONS TAB ==================== */}
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
                    <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
                          <BellAlertIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography className="font-extrabold text-[#4e342e] text-sm">
                            Loại thông báo
                          </Typography>
                          <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                            Chọn những thông báo bạn muốn nhận
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 lg:p-6 space-y-3">
                      {[
                        {
                          key: "emailNotif",
                          icon: EnvelopeOpenIcon,
                          label: "Thông báo qua Email",
                          description: "Nhận thông báo quan trọng qua email",
                          gradient: "from-blue-500 to-indigo-600",
                        },
                        {
                          key: "orderNotif",
                          icon: ShoppingCartIcon,
                          label: "Đơn hàng mới",
                          description: "Thông báo khi có đơn hàng mới",
                          gradient: "from-green-500 to-emerald-600",
                        },
                        {
                          key: "stockNotif",
                          icon: ExclamationTriangleIcon,
                          label: "Cảnh báo tồn kho",
                          description: "Thông báo khi hàng sắp hết",
                          gradient: "from-red-500 to-rose-600",
                        },
                        {
                          key: "reviewNotif",
                          icon: StarIcon,
                          label: "Đánh giá mới",
                          description: "Thông báo khi có đánh giá mới",
                          gradient: "from-amber-500 to-orange-600",
                        },
                        {
                          key: "reportNotif",
                          icon: DocumentTextIcon,
                          label: "Báo cáo định kỳ",
                          description: "Nhận báo cáo doanh thu tuần/tháng",
                          gradient: "from-purple-500 to-fuchsia-600",
                        },
                        {
                          key: "soundNotif",
                          icon: BellIcon,
                          label: "Âm thanh thông báo",
                          description: "Phát âm thanh khi có thông báo",
                          gradient: "from-cyan-500 to-blue-600",
                        },
                        {
                          key: "desktopNotif",
                          icon: ComputerDesktopIcon,
                          label: "Thông báo Desktop",
                          description: "Hiện popup trên màn hình máy tính",
                          gradient: "from-[#8B5E3C] to-[#6d4c41]",
                        },
                      ].map((opt) => {
                        const Icon = opt.icon;
                        const value = notificationSettings[opt.key];
                        return (
                          <div
                            key={opt.key}
                            className={`flex items-center justify-between gap-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                              value
                                ? "bg-gradient-to-r from-[#faf6f1] to-[#fffaf5] border-[#C89F77]/40"
                                : "bg-white border-amber-100"
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br ${opt.gradient} flex items-center justify-center shadow-md ${
                                  value ? "opacity-100" : "opacity-50"
                                } transition-opacity`}
                              >
                                <Icon className="w-5 h-5 text-white" strokeWidth={2.2} />
                              </div>
                              <div className="min-w-0">
                                <Typography className="text-sm font-extrabold text-[#4e342e]">
                                  {opt.label}
                                </Typography>
                                <Typography className="text-[11px] text-gray-500 truncate">
                                  {opt.description}
                                </Typography>
                              </div>
                            </div>
                            <Switch
                              checked={value}
                              onChange={() =>
                                setNotificationSettings((p) => ({
                                  ...p,
                                  [opt.key]: !p[opt.key],
                                }))
                              }
                              className="checked:bg-[#8B5E3C]"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* ==================== SECURITY TAB ==================== */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-5"
                >
                  {/* Change Password */}
                  <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
                    <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg">
                          <KeyIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography className="font-extrabold text-[#4e342e] text-sm">
                            Đổi mật khẩu
                          </Typography>
                          <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                            Cập nhật mật khẩu định kỳ để bảo mật
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 lg:p-6 space-y-4">
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                          <LockClosedIcon className="h-5 w-5 text-[#8B5E3C]" />
                        </div>
                        <Input
                          type="password"
                          label="Mật khẩu hiện tại"
                          className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                          labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                          <KeyIcon className="h-5 w-5 text-[#8B5E3C]" />
                        </div>
                        <Input
                          type="password"
                          label="Mật khẩu mới"
                          className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                          labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                          <CheckCircleIcon className="h-5 w-5 text-[#8B5E3C]" />
                        </div>
                        <Input
                          type="password"
                          label="Xác nhận mật khẩu mới"
                          className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                          labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        />
                      </div>
                      <Button className="bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] rounded-xl normal-case font-bold w-full py-3 flex items-center justify-center gap-2">
                        <CheckCircleIcon className="w-4 h-4" strokeWidth={2.5} />
                        Cập nhật mật khẩu
                      </Button>
                    </div>
                  </Card>

                  {/* Security Options */}
                  <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
                    <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                          <ShieldCheckIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography className="font-extrabold text-[#4e342e] text-sm">
                            Bảo mật nâng cao
                          </Typography>
                          <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                            Tăng cường bảo vệ tài khoản
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 lg:p-6 space-y-3">
                      {[
                        {
                          key: "twoFactor",
                          icon: FingerPrintIcon,
                          label: "Xác thực 2 lớp (2FA)",
                          description: "Bảo mật tài khoản với mã OTP",
                        },
                        {
                          key: "ipWhitelist",
                          icon: GlobeAltIcon,
                          label: "Danh sách IP cho phép",
                          description: "Chỉ cho phép đăng nhập từ IP tin cậy",
                        },
                        {
                          key: "loginAlerts",
                          icon: BellAlertIcon,
                          label: "Cảnh báo đăng nhập",
                          description: "Thông báo khi có đăng nhập lạ",
                        },
                      ].map((opt) => {
                        const Icon = opt.icon;
                        const value = securitySettings[opt.key];
                        return (
                          <div
                            key={opt.key}
                            className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#faf6f1] border border-amber-100 hover:border-[#C89F77]/30 transition-colors"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-white border border-[#C89F77]/30 flex items-center justify-center shadow-sm">
                                <Icon className="w-5 h-5 text-[#8B5E3C]" strokeWidth={2.2} />
                              </div>
                              <div className="min-w-0">
                                <Typography className="text-sm font-extrabold text-[#4e342e]">
                                  {opt.label}
                                </Typography>
                                <Typography className="text-[11px] text-gray-500 truncate">
                                  {opt.description}
                                </Typography>
                              </div>
                            </div>
                            <Switch
                              checked={value}
                              onChange={() =>
                                setSecuritySettings((p) => ({
                                  ...p,
                                  [opt.key]: !p[opt.key],
                                }))
                              }
                              className="checked:bg-[#8B5E3C]"
                            />
                          </div>
                        );
                      })}

                      {/* Session timeout */}
                      <div className="p-4 rounded-xl bg-[#faf6f1] border border-amber-100">
                        <Typography className="text-sm font-extrabold text-[#4e342e] mb-1">
                          Tự động đăng xuất
                        </Typography>
                        <Typography className="text-[11px] text-gray-500 mb-3">
                          Thời gian tự động đăng xuất khi không hoạt động
                        </Typography>
                        <Select
                          value={securitySettings.sessionTimeout}
                          onChange={(v) =>
                            setSecuritySettings((p) => ({ ...p, sessionTimeout: v }))
                          }
                          className="!border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                          menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                        >
                          <Option value="15">15 phút</Option>
                          <Option value="30">30 phút</Option>
                          <Option value="60">1 giờ</Option>
                          <Option value="120">2 giờ</Option>
                          <Option value="480">8 giờ</Option>
                        </Select>
                      </div>
                    </div>
                  </Card>

                  {/* Backup */}
                  <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
                    <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-[#faf6f1] to-[#fffaf5]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <CloudArrowUpIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <Typography className="font-extrabold text-[#4e342e] text-sm">
                            Sao lưu dữ liệu
                          </Typography>
                          <Typography className="text-[10px] text-[#8B5E3C] font-medium">
                            Bảo vệ dữ liệu quan trọng
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 lg:p-6 space-y-4">
                      <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#faf6f1] border border-amber-100">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-white border border-[#C89F77]/30 flex items-center justify-center">
                            <CloudArrowUpIcon className="w-5 h-5 text-[#8B5E3C]" strokeWidth={2.2} />
                          </div>
                          <div>
                            <Typography className="text-sm font-extrabold text-[#4e342e]">
                              Tự động sao lưu
                            </Typography>
                            <Typography className="text-[11px] text-gray-500">
                              Sao lưu dữ liệu định kỳ
                            </Typography>
                          </div>
                        </div>
                        <Switch
                          checked={securitySettings.autoBackup}
                          onChange={() =>
                            setSecuritySettings((p) => ({
                              ...p,
                              autoBackup: !p.autoBackup,
                            }))
                          }
                          className="checked:bg-[#8B5E3C]"
                        />
                      </div>

                      {securitySettings.autoBackup && (
                        <Select
                          label="Tần suất sao lưu"
                          value={securitySettings.backupFrequency}
                          onChange={(v) =>
                            setSecuritySettings((p) => ({ ...p, backupFrequency: v }))
                          }
                          className="!border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                          labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                          menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                        >
                          <Option value="hourly">Mỗi giờ</Option>
                          <Option value="daily">Hàng ngày</Option>
                          <Option value="weekly">Hàng tuần</Option>
                          <Option value="monthly">Hàng tháng</Option>
                        </Select>
                      )}

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={handleBackup}
                          className="flex-1 bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] rounded-xl normal-case font-bold py-3 flex items-center justify-center gap-2"
                        >
                          <CloudArrowUpIcon className="w-4 h-4" strokeWidth={2.5} />
                          Sao lưu ngay
                        </Button>
                        <Button
                          variant="outlined"
                          className="flex-1 border-2 border-[#8B5E3C]/40 text-[#6d4c41] hover:bg-[#faf6f1] hover:border-[#8B5E3C] rounded-xl normal-case font-bold py-3 flex items-center justify-center gap-2"
                        >
                          <ArrowDownTrayIcon className="w-4 h-4" strokeWidth={2.5} />
                          Tải xuống
                        </Button>
                      </div>

                      {/* Last backup */}
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                        <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0" strokeWidth={2.2} />
                        <div className="min-w-0">
                          <Typography className="text-[10px] font-extrabold text-green-700 uppercase tracking-wider">
                            Sao lưu gần nhất
                          </Typography>
                          <Typography className="text-xs font-bold text-green-800">
                            14/09/2026 lúc 03:00 sáng
                          </Typography>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* ===== INFO NOTE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <InformationCircleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Ghi chú:</span> Các thay đổi trong trang
            Cài đặt sẽ được lưu tự động khi bạn nhấn nút "Lưu thay đổi". Nếu
            muốn khôi phục về mặc định, nhấn nút "Khôi phục". Sao lưu dữ liệu
            định kỳ để tránh mất mát thông tin quan trọng.
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
            Phiên bản v2.5.1 • Cập nhật 14/09/2026
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default Settings;
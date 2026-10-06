
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  ShieldCheckIcon,
  ClockIcon,
  CalendarDaysIcon,
  XMarkIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  FingerPrintIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { getRoleConfig } from "./constants/roleConfig";
import { formatDate } from "./utils/formatters";

// ==================== INFO ITEM ====================
function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-100 hover:border-[#8B5E3C]/40 hover:shadow-md transition-all duration-200">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#faf6f1] flex items-center justify-center">
        <Icon className="h-4 w-4 text-[#8B5E3C]" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </Typography>
        <Typography className="text-sm font-semibold text-gray-800 truncate">
          {value}
        </Typography>
      </div>
    </div>
  );
}

// ==================== MAIN ====================
export function Show({ open, user, onClose }) {
  if (!user) return null;

  const roleConfig = getRoleConfig(user.role);

  return (
    <Dialog open={open} handler={onClose} size="md" className="bg-transparent shadow-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <DialogHeader className="relative bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] p-5 m-0 rounded-none block">
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10" />
          <div className="absolute -bottom-12 -left-4 w-20 h-20 rounded-full bg-white/10" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-20 p-1.5 rounded-lg bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <XMarkIcon className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <div className="relative flex items-center gap-4 z-10">
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/90 shadow-lg bg-[#f5ede3]">
                <img
                  src={user.imageUrl || "https://via.placeholder.com/150"}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
                  user.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <Typography className="text-[10px] font-bold text-amber-100 uppercase tracking-widest">
                Hồ sơ người dùng
              </Typography>
              <Typography variant="h5" className="text-white font-extrabold tracking-tight truncate">
                {user.fullName}
              </Typography>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-xs text-white/85 font-medium">
                  @{user.username}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${roleConfig.bg} border border-white/30`}
                >
                  <span className="text-[10px]">{roleConfig.emoji}</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wide">
                    {roleConfig.label}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* BODY */}
        <DialogBody className="p-5 max-h-[60vh] overflow-y-auto bg-[#faf6f1]">
          <div className="space-y-4">
            {/* Quick stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <FingerPrintIcon className="h-4 w-4 text-[#8B5E3C] mb-1.5" />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  ID
                </Typography>
                <Typography className="text-base font-extrabold text-[#4e342e]">
                  #{user.id}
                </Typography>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  user.isActive
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <ClockIcon
                  className={`h-4 w-4 mb-1.5 ${
                    user.isActive ? "text-green-600" : "text-red-600"
                  }`}
                />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Trạng thái
                </Typography>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      user.isActive ? "bg-green-500 animate-pulse" : "bg-red-500"
                    }`}
                  />
                  <Typography
                    className={`text-xs font-extrabold ${
                      user.isActive ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {user.isActive ? "Hoạt động" : "Vô hiệu"}
                  </Typography>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <ShieldCheckIcon className="h-4 w-4 text-[#8B5E3C] mb-1.5" />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Vai trò
                </Typography>
                <Typography className="text-xs font-extrabold text-[#4e342e] truncate">
                  {roleConfig.emoji} {roleConfig.shortLabel}
                </Typography>
              </div>

              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <PhoneIcon className="h-4 w-4 text-[#8B5E3C] mb-1.5" />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Điện thoại
                </Typography>
                <Typography className="text-xs font-extrabold text-[#4e342e] truncate">
                  {user.phone || "Chưa có"}
                </Typography>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Thông tin chi tiết
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <InfoItem icon={IdentificationIcon} label="Họ và tên" value={user.fullName} />
                <InfoItem icon={UserCircleIcon} label="Tên đăng nhập" value={`@${user.username}`} />
                <InfoItem icon={EnvelopeIcon} label="Email" value={user.email} />
                <InfoItem
                  icon={PhoneIcon}
                  label="Số điện thoại"
                  value={user.phone || "Chưa cập nhật"}
                />
              </div>
            </div>

            {/* Lịch sử */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Lịch sử hoạt động
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-100">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-sm">
                    <CalendarDaysIcon className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Ngày tạo
                    </Typography>
                    <Typography className="text-sm font-semibold text-gray-800">
                      {formatDate(user.createdAt)}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-100">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#C89F77] to-[#a4714b] flex items-center justify-center shadow-sm">
                    <ArrowPathIcon className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Cập nhật lần cuối
                    </Typography>
                    <Typography className="text-sm font-semibold text-gray-800">
                      {formatDate(user.updatedAt)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>

        {/* FOOTER */}
        <DialogFooter className="bg-white border-t border-amber-100 p-4 flex items-center justify-between gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center text-xs">
              ☕
            </div>
            <Typography className="text-xs text-[#6d4c41] font-bold">
              Coffee Shop Admin
            </Typography>
          </div>

          <Button
            onClick={onClose}
            className="ml-auto bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#8B5E3C]/30 transition-all duration-300 hover:scale-105 active:scale-95 normal-case font-bold flex items-center gap-2 text-sm"
          >
            <CheckBadgeIcon className="h-4 w-4" strokeWidth={2.5} />
            Đóng
          </Button>
        </DialogFooter>
      </motion.div>
    </Dialog>
  );
}

export default Show;

import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Select,
  Option,
  Switch,
  Typography,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  LockClosedIcon,
  EnvelopeIcon,
  PhoneIcon,
  IdentificationIcon,
  XMarkIcon,
  PencilSquareIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useUserForm } from "./hooks/useUserForm";
import { UserAvatarUpload } from "./components/UserAvatarUpload";
import { getRoleConfig, SELECTABLE_ROLES } from "./constants/roleConfig";

export function Edit({ open, user, onClose, onSuccess }) {
  const {
    formData,
    errors,
    imagePreview,
    showPassword,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleImageChange,
    removeImage,
    setShowPassword,
    handleSubmit,
    handleClose,
  } = useUserForm({
    id: user?.id,
    initialData: user,
    onClose,
    onSuccess,
  });

  if (!user) return null;

  const roleConfig = getRoleConfig(user?.role);

  return (
    <Dialog open={open} handler={handleClose} size="xl" className="bg-transparent shadow-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <DialogHeader className="relative bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] p-6 m-0 rounded-none overflow-hidden block">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative flex items-center gap-4 w-full z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg flex-shrink-0">
              <PencilSquareIcon className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <Typography variant="h4" className="text-white font-extrabold tracking-tight text-xl lg:text-2xl">
                Cập Nhật Người Dùng
              </Typography>
              <Typography variant="small" className="text-white/85 font-medium">
                Chỉnh sửa thông tin tài khoản #{user?.id} ☕
              </Typography>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0 disabled:opacity-50"
            >
              <XMarkIcon className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
        </DialogHeader>

        {/* BODY */}
        <DialogBody className="p-0 max-h-[70vh] overflow-y-auto bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3]">
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
              {/* CỘT TRÁI */}
              <div className="flex flex-col items-center">
                <UserAvatarUpload
                  imagePreview={imagePreview}
                  onImageChange={handleImageChange}
                  onRemove={removeImage}
                  isActive={formData.isActive}
                  disabled={isSubmitting}
                />
              </div>

              {/* CỘT PHẢI */}
              <div className="space-y-5">
                {/* Current User Banner */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-[#f5ede3] to-[#faf6f1] border-2 border-[#C89F77]/30">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center flex-shrink-0 shadow-md">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-xs font-extrabold uppercase text-[#8B5E3C] tracking-widest">
                      Đang chỉnh sửa
                    </Typography>
                    <Typography className="text-sm font-bold text-[#4e342e] truncate">
                      {user?.fullName}{" "}
                      <span className="text-[#8B5E3C]/70 font-medium">· @{user?.username}</span>
                    </Typography>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#C89F77]/30">
                    <span className="text-xs">{roleConfig.emoji}</span>
                    <Typography className="text-[10px] font-extrabold text-[#8B5E3C] uppercase tracking-wider">
                      {roleConfig.shortLabel}
                    </Typography>
                  </div>
                </div>

                {/* Thông tin đăng nhập */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Thông tin đăng nhập
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        label="Username (không thể đổi)"
                        name="username"
                        value={formData.username}
                        className="!pl-10 !bg-gray-100/70 !border-gray-200 !rounded-xl"
                        labelProps={{ className: "!text-gray-400 font-medium" }}
                        disabled
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                        <LockClosedIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <KeyIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        type={showPassword ? "text" : "password"}
                        label="Mật khẩu mới"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.password}
                        className="!pl-10 !pr-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 hover:text-[#8B5E3C] transition-colors"
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-5 w-5" />
                        ) : (
                          <EyeIcon className="h-5 w-5" />
                        )}
                      </button>
                      {errors.password && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.password[0]}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>

                {/* Thông tin cá nhân */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Thông tin cá nhân
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative md:col-span-2">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <IdentificationIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        label="Họ và tên *"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.fullName}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        required
                      />
                      {errors.fullName && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.fullName[0]}
                        </Typography>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        label="Email *"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.email}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        required
                      />
                      {errors.email && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.email[0]}
                        </Typography>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        label="Số điện thoại"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.phone}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                      />
                      {errors.phone && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.phone[0]}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>

                {/* Phân quyền & trạng thái */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Phân quyền & trạng thái
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Select
                        label="Vai trò *"
                        value={formData.role}
                        onChange={(value) => handleSelectChange("role", value)}
                        disabled={isSubmitting}
                        error={!!errors.role}
                        className="!border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        {SELECTABLE_ROLES.map((r) => (
                          <Option key={r.value} value={r.value}>
                            {r.emoji} {r.label}
                          </Option>
                        ))}
                      </Select>
                      {errors.role && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.role[0]}
                        </Typography>
                      )}
                    </div>

                    <div
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 ${
                        formData.isActive
                          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                          : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            formData.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                          }`}
                        />
                        <div>
                          <Typography
                            className={`text-xs font-bold ${
                              formData.isActive ? "text-green-700" : "text-gray-600"
                            }`}
                          >
                            {formData.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                          </Typography>
                        </div>
                      </div>
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => handleSwitchChange("isActive", e.target.checked)}
                        disabled={isSubmitting}
                        className="checked:bg-[#8B5E3C]"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <InformationCircleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
                  <Typography className="text-xs text-[#6d4c41] leading-relaxed">
                    <span className="font-bold">Lưu ý:</span> Để trống ô{" "}
                    <span className="font-bold">Mật khẩu mới</span> nếu bạn không muốn
                    thay đổi mật khẩu hiện tại. Các trường có dấu{" "}
                    <span className="text-red-500 font-bold">*</span> là bắt buộc.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>

        {/* FOOTER */}
        <DialogFooter className="bg-white border-t border-amber-100 p-4 lg:p-5 gap-3 flex items-center justify-between">
          <Typography className="text-xs text-gray-400 font-medium hidden sm:block">
            ☕ Coffee Shop Admin Panel
          </Typography>
          <div className="flex gap-3 ml-auto">
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 px-6 rounded-xl normal-case font-bold transition-all duration-200 disabled:opacity-50"
            >
              Hủy Bỏ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white px-8 rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#8B5E3C]/30 transition-all duration-300 hover:scale-105 active:scale-95 normal-case font-bold disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" strokeWidth={2.5} />
                  Cập Nhật
                </span>
              )}
            </Button>
          </div>
        </DialogFooter>
      </motion.div>
    </Dialog>
  );
}

export default Edit;
// src/pages/dashboard/promotions/edit.jsx
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Checkbox,
  Typography,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  PencilSquareIcon,
  TagIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  CubeIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  GiftIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { usePromotionForm } from "./hooks/usePromotionForm";
import { VoucherPreviewCard } from "./components/VoucherPreviewCard";
import { ProductSelector } from "./components/ProductSelector";

export function Edit({ open, promotion, products = [], onClose, onSuccess }) {
  const {
    formData,
    errors,
    changes,
    selectedProducts,
    discountDisplay,
    isSubmitting,
    canSubmit,
    handleInputChange,
    handleToggleActive,
    handleProductToggle,
    handleSelectAllProducts,
    handleClearProducts,
    handleSubmit,
    handleClose,
  } = usePromotionForm({
    id: promotion?.id,
    initialData: promotion,
    onClose,
    onSuccess,
  });

  if (!promotion) return null;

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
                Cập Nhật Khuyến Mãi
              </Typography>
              <Typography variant="small" className="text-white/85 font-medium">
                Chỉnh sửa khuyến mãi #{promotion?.id} ☕
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
        <DialogBody className="p-0 max-h-[72vh] overflow-y-auto bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3]">
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 lg:gap-8">
              {/* CỘT TRÁI */}
              <div className="flex flex-col items-center">
                <VoucherPreviewCard
                  name={formData.name}
                  discountDisplay={discountDisplay}
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  isActive={formData.isActive}
                  selectedProductsCount={selectedProducts.length}
                  mode="edit"
                />

                {/* Change indicator */}
                {changes.hasChanges ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 w-full max-w-[300px] p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200"
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <Typography className="text-[10px] font-extrabold text-orange-700 uppercase tracking-wider">
                        Có thay đổi chưa lưu
                      </Typography>
                    </div>
                  </motion.div>
                ) : (
                  <div className="mt-4 w-full max-w-[300px] p-3 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
                    <div className="flex items-center gap-2 justify-center">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      <Typography className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                        Chưa có thay đổi
                      </Typography>
                    </div>
                  </div>
                )}
              </div>

              {/* CỘT PHẢI */}
              <div className="space-y-5">
                {/* Current Promotion Banner */}
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-[#f5ede3] to-[#faf6f1] border-2 border-[#C89F77]/30">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center flex-shrink-0 shadow-md">
                    <GiftIcon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-xs font-extrabold uppercase text-[#8B5E3C] tracking-widest">
                      Đang chỉnh sửa
                    </Typography>
                    <Typography className="text-sm font-bold text-[#4e342e] truncate">
                      {promotion?.name}{" "}
                      <span className="text-[#8B5E3C]/70 font-medium">
                        · #{promotion?.id}
                      </span>
                    </Typography>
                  </div>
                </div>

                {/* Section: Thông tin */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Thông tin khuyến mãi
                    </Typography>
                  </div>

                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                      <TagIcon className="h-5 w-5 text-[#8B5E3C]" />
                    </div>
                    <Input
                      label="Tên khuyến mãi *"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      error={!!errors.name}
                      className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                      labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                      required
                    />
                    {changes.nameChanged && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                        <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                          Đã sửa
                        </span>
                      </div>
                    )}
                    {errors.name && (
                      <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                        {errors.name[0]}
                      </Typography>
                    )}
                  </div>
                </div>

                {/* Section: Giảm giá */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Mức giảm giá
                    </Typography>
                    <span className="ml-auto text-[10px] font-semibold text-gray-400">
                      * Ít nhất 1 trong 2
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <ReceiptPercentIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        type="number"
                        label="Giảm theo %"
                        name="discountPercentage"
                        min="0"
                        max="100"
                        value={formData.discountPercentage}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.discountPercentage}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                      />
                      {changes.percentChanged && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                          <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                            Đã sửa
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <BanknotesIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        type="number"
                        label="Giảm theo VNĐ"
                        name="discountAmount"
                        min="0"
                        step="1000"
                        value={formData.discountAmount}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.discountAmount}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                      />
                      {changes.amountChanged && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                          <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                            Đã sửa
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {errors.discountPercentage && (
                    <Typography className="text-[10px] text-red-500 mt-2 ml-1 font-semibold">
                      {errors.discountPercentage[0]}
                    </Typography>
                  )}
                </div>

                {/* Section: Thời gian */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Thời gian áp dụng
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <CalendarDaysIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        type="date"
                        label="Ngày bắt đầu *"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.startDate}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        required
                      />
                      {changes.startChanged && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                          <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                            Đã sửa
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <CalendarDaysIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        type="date"
                        label="Ngày kết thúc *"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.endDate}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        required
                      />
                      {changes.endChanged && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                          <span className="text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                            Đã sửa
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {errors.endDate && (
                    <Typography className="text-[10px] text-red-500 mt-2 ml-1 font-semibold">
                      {errors.endDate[0]}
                    </Typography>
                  )}
                </div>

                {/* Section: Trạng thái */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Trạng thái
                    </Typography>
                    {changes.statusChanged && (
                      <span className="ml-auto text-[10px] font-extrabold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md">
                        Đã sửa
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                      formData.isActive
                        ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                        : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
                    }`}
                    onClick={() => !isSubmitting && handleToggleActive()}
                  >
                    <Checkbox
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      name="isActive"
                      disabled={isSubmitting}
                      className="hover:before:opacity-0"
                      containerProps={{ className: "-ml-2.5" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            formData.isActive
                              ? "bg-green-500 animate-pulse"
                              : "bg-gray-400"
                          }`}
                        />
                        <Typography
                          className={`text-xs font-extrabold ${
                            formData.isActive ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          {formData.isActive ? "Đang hoạt động" : "Đã ngừng"}
                        </Typography>
                      </div>
                      <Typography className="text-[10px] text-gray-500 mt-0.5">
                        {formData.isActive
                          ? "Khuyến mãi đang được áp dụng"
                          : "Khuyến mãi bị ẩn khỏi khách hàng"}
                      </Typography>
                    </div>
                    <CheckCircleIcon
                      className={`w-5 h-5 ${
                        formData.isActive ? "text-green-600" : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>

                {/* Section: Sản phẩm */}
                {products.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                      <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                        Sản phẩm áp dụng
                      </Typography>
                      <span
                        className={`ml-auto text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                          changes.productsChanged
                            ? "text-orange-600 bg-orange-50 border-orange-200"
                            : "text-[#8B5E3C] bg-[#faf6f1] border-[#C89F77]/30"
                        }`}
                      >
                        Đã chọn: {selectedProducts.length}
                        {changes.productsChanged && " · Đã sửa"}
                      </span>
                    </div>

                    <ProductSelector
                      products={products}
                      selectedProducts={selectedProducts}
                      onToggle={handleProductToggle}
                      onSelectAll={handleSelectAllProducts}
                      onClearAll={handleClearProducts}
                      disabled={isSubmitting}
                    />
                  </div>
                )}

                {/* Section: Trạng thái thay đổi */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Trạng thái thay đổi
                    </Typography>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    {[
                      { key: "nameChanged", icon: TagIcon, label: "Tên" },
                      { key: "discountChanged", icon: ReceiptPercentIcon, label: "Giảm giá" },
                      { key: "datesChanged", icon: CalendarDaysIcon, label: "Thời gian" },
                      { key: "statusChanged", icon: CheckCircleIcon, label: "Trạng thái" },
                      { key: "productsChanged", icon: CubeIcon, label: "Sản phẩm" },
                    ].map(({ key, icon: Icon, label }) => {
                      const changed = changes[key];
                      return (
                        <div
                          key={key}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all duration-300 ${
                            changed
                              ? "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
                              : "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              changed ? "bg-orange-100" : "bg-green-100"
                            }`}
                          >
                            <Icon
                              className={`w-3.5 h-3.5 ${
                                changed ? "text-orange-600" : "text-green-600"
                              }`}
                            />
                          </div>
                          <div className="min-w-0">
                            <Typography
                              className={`text-[9px] font-bold uppercase tracking-wider ${
                                changed ? "text-orange-700" : "text-green-700"
                              }`}
                            >
                              {label}
                            </Typography>
                            <Typography
                              className={`text-[10px] font-extrabold ${
                                changed ? "text-orange-700" : "text-green-700"
                              }`}
                            >
                              {changed ? "● Đã sửa" : "✓ Không đổi"}
                            </Typography>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <InformationCircleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
                  <Typography className="text-xs text-[#6d4c41] leading-relaxed">
                    <span className="font-bold">Lưu ý:</span> Các trường có dấu{" "}
                    <span className="text-red-500 font-bold">*</span> là bắt buộc.
                    Thay đổi sẽ được áp dụng sau khi bạn nhấn "Cập nhật".
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
              disabled={isSubmitting || !canSubmit}
              className={`px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 normal-case font-bold flex items-center gap-2 ${
                canSubmit
                  ? "bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white hover:shadow-[#8B5E3C]/30 hover:scale-105 active:scale-95"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } disabled:opacity-50 disabled:hover:scale-100`}
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
                  <CheckBadgeIcon className="h-5 w-5" strokeWidth={2.5} />
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

import { useMemo } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Select,
  Option,
  Input,
  Button,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  PlusCircleIcon,
  TableCellsIcon,
  UserIcon,
  TagIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useOrderForm } from "./hooks/useOrderForm";
import { OrderReceiptPreview } from "./components/OrderReceiptPreview";
import { ORDER_STATUS_OPTIONS } from "./constants/orderStatus";
import { formatPrice } from "./utils/formatters";

export function Create({ open, onClose, onSuccess, tables, employees, promotions }) {
  const {
    formData,
    errors,
    formattedTotal,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleClose,
  } = useOrderForm({ onClose, onSuccess });

  // ============ DATA HELPERS ============
  const selectedTable = useMemo(
    () => tables?.find((t) => t.id?.toString() === formData.tableId?.toString()),
    [tables, formData.tableId]
  );
  const selectedEmployee = useMemo(
    () =>
      employees?.find((e) => e.id?.toString() === formData.employeeId?.toString()),
    [employees, formData.employeeId]
  );
  const selectedPromotion = useMemo(
    () =>
      promotions?.find(
        (p) => p.id?.toString() === formData.promotionId?.toString()
      ),
    [promotions, formData.promotionId]
  );

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
              <PlusCircleIcon className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <Typography variant="h4" className="text-white font-extrabold tracking-tight text-xl lg:text-2xl">
                Thêm Đơn Hàng Mới
              </Typography>
              <Typography variant="small" className="text-white/85 font-medium">
                Tạo đơn hàng mới cho quán Coffee Shop ☕
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
                <OrderReceiptPreview
                  formData={formData}
                  selectedTable={selectedTable}
                  selectedEmployee={selectedEmployee}
                  selectedPromotion={selectedPromotion}
                  formattedTotal={formattedTotal}
                  mode="create"
                />

                {/* Status legend */}
                <div className="mt-4 w-full max-w-[300px] p-3 rounded-xl bg-gradient-to-br from-[#f5ede3] to-[#faf6f1] border border-[#C89F77]/30">
                  <Typography className="text-[10px] font-extrabold text-[#8B5E3C] uppercase tracking-widest text-center mb-2">
                    🎨 Trạng thái đơn
                  </Typography>
                  <div className="grid grid-cols-2 gap-1.5">
                    {ORDER_STATUS_OPTIONS.map((s) => (
                      <div key={s.value} className="flex items-center gap-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                        <Typography className={`text-[9px] font-bold ${s.text}`}>
                          {s.shortLabel}
                        </Typography>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CỘT PHẢI */}
              <div className="space-y-5">
                {/* Section: Đơn hàng */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Thông tin đơn hàng
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <TableCellsIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Select
                        label="Chọn bàn *"
                        value={formData.tableId?.toString() || ""}
                        onChange={(val) => handleSelectChange("tableId", val)}
                        disabled={isSubmitting}
                        error={!!errors.tableId}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        {tables?.map((t) => (
                          <Option key={t.id} value={t.id.toString()}>
                            🪑 Bàn {t.number} · {t.capacity} chỗ
                          </Option>
                        ))}
                      </Select>
                      {errors.tableId && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.tableId[0]}
                        </Typography>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <UserIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Select
                        label="Chọn nhân viên *"
                        value={formData.employeeId?.toString() || ""}
                        onChange={(val) => handleSelectChange("employeeId", val)}
                        disabled={isSubmitting}
                        error={!!errors.employeeId}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        {employees?.map((e) => (
                          <Option key={e.id} value={e.id.toString()}>
                            👤 {e.fullName}
                          </Option>
                        ))}
                      </Select>
                      {errors.employeeId && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.employeeId[0]}
                        </Typography>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section: Khuyến mãi & Thanh toán */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Khuyến mãi & Thanh toán
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <TagIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Select
                        label="Khuyến mãi (tùy chọn)"
                        value={formData.promotionId?.toString() || ""}
                        onChange={(val) => handleSelectChange("promotionId", val)}
                        disabled={isSubmitting}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        <Option value="">Không áp dụng</Option>
                        {promotions?.map((promo) => (
                          <Option key={promo.id} value={promo.id.toString()}>
                            🎁 {promo.name}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        type="number"
                        label="Tổng tiền (VNĐ) *"
                        name="totalAmount"
                        min="0"
                        step="1000"
                        value={formData.totalAmount}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.totalAmount}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                      />
                      {errors.totalAmount && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.totalAmount[0]}
                        </Typography>
                      )}
                    </div>
                  </div>

                  {/* Promotion detail */}
                  {selectedPromotion && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200"
                    >
                      <ReceiptPercentIcon className="h-5 w-5 text-pink-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <Typography className="text-xs font-extrabold text-pink-700">
                          🎁 {selectedPromotion.name}
                        </Typography>
                        {selectedPromotion.discountValue && (
                          <Typography className="text-[10px] text-pink-600 mt-0.5">
                            Giảm {selectedPromotion.discountValue}
                            {selectedPromotion.discountType === "PERCENT" ? "%" : "đ"}
                          </Typography>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Price preview */}
                  {formattedTotal && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] shadow-md"
                    >
                      <div className="flex items-center gap-2">
                        <BanknotesIcon className="h-4 w-4 text-amber-200" />
                        <Typography className="text-[10px] font-extrabold text-amber-200 uppercase tracking-widest">
                          Tổng tiền
                        </Typography>
                      </div>
                      <Typography className="text-base font-extrabold text-white">
                        {formattedTotal}
                      </Typography>
                    </motion.div>
                  )}
                </div>

                {/* Section: Trạng thái & Ghi chú */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Trạng thái & Ghi chú
                    </Typography>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <ClipboardDocumentListIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Select
                        label="Trạng thái đơn hàng *"
                        value={formData.status}
                        onChange={(val) => handleSelectChange("status", val)}
                        disabled={isSubmitting}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                      >
                        {ORDER_STATUS_OPTIONS.map((s) => (
                          <Option key={s.value} value={s.value}>
                            {s.emoji} {s.label}
                          </Option>
                        ))}
                      </Select>
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-3 z-10 pointer-events-none">
                        <DocumentTextIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Textarea
                        label="Ghi chú đơn hàng"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        rows={3}
                      />
                      <div className="mt-1 text-right">
                        <Typography
                          className={`text-[10px] font-semibold ${
                            formData.notes.length > 200 ? "text-orange-500" : "text-gray-400"
                          }`}
                        >
                          {formData.notes.length} ký tự
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <InformationCircleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
                  <Typography className="text-xs text-[#6d4c41] leading-relaxed">
                    <span className="font-bold">Lưu ý:</span> Bàn, nhân viên và tổng
                    tiền là bắt buộc. Khuyến mãi và ghi chú là tùy chọn. Sau khi
                    tạo, đơn hàng sẽ xuất hiện ở đầu danh sách.
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
                  Tạo đơn hàng
                </span>
              )}
            </Button>
          </div>
        </DialogFooter>
      </motion.div>
    </Dialog>
  );
}

export default Create;
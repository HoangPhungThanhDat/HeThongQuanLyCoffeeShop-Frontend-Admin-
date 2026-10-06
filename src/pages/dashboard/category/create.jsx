// src/pages/dashboard/category/create.jsx
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import {
  XMarkIcon,
  PlusCircleIcon,
  TagIcon,
  DocumentTextIcon,
  FolderIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useCategoryForm } from "./hooks/useCategoryForm";

export function Create({ open, onClose, onSuccess }) {
  const {
    formData,
    errors,
    isSubmitting,
    hasDescription,
    handleInputChange,
    handleSubmit,
    handleClose,
  } = useCategoryForm({ onClose, onSuccess });

  return (
    <Dialog open={open} handler={handleClose} size="lg" className="bg-transparent shadow-none">
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
                Thêm Danh Mục Mới
              </Typography>
              <Typography variant="small" className="text-white/85 font-medium">
                Tạo danh mục sản phẩm mới cho Coffee Shop ☕
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
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 lg:gap-8">
              {/* CỘT TRÁI */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#8B5E3C] to-[#C89F77] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
                  <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-[#8B5E3C] via-[#6d4c41] to-[#4e342e] flex flex-col items-center justify-center gap-2">
                    <FolderIcon className="h-14 w-14 lg:h-16 lg:w-16 text-white/90" strokeWidth={1.8} />
                    <Typography className="text-[10px] font-bold text-white/80 uppercase tracking-widest">
                      Danh mục
                    </Typography>
                  </div>
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <SparklesIcon className="h-3.5 w-3.5 text-white" />
                  </motion.div>
                </div>

                <div className="mt-4 text-center">
                  <Typography className="text-sm font-bold text-[#4e342e]">Xem trước</Typography>
                  <Typography className="text-xs text-gray-500 mt-1">
                    Danh mục sẽ hiển thị như thế này
                  </Typography>
                </div>

                {formData.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 w-full p-4 rounded-2xl bg-white border-2 border-[#C89F77]/30 shadow-md"
                  >
                    <Typography className="text-[10px] font-extrabold text-[#8B5E3C]/60 uppercase tracking-widest text-center mb-2">
                      Tên hiển thị
                    </Typography>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center flex-shrink-0">
                        <FolderIcon className="w-4 h-4 text-white" />
                      </div>
                      <Typography className="text-sm font-bold text-[#4e342e] truncate">
                        {formData.name}
                      </Typography>
                    </div>
                  </motion.div>
                )}

                <div className="mt-3 w-full p-3 rounded-xl bg-gradient-to-br from-[#f5ede3] to-[#faf6f1] border border-[#C89F77]/30">
                  <Typography className="text-[10px] font-extrabold text-[#8B5E3C] uppercase tracking-widest text-center mb-1">
                    💡 Gợi ý
                  </Typography>
                  <Typography className="text-[10px] text-[#6d4c41]/80 text-center leading-relaxed">
                    Đặt tên ngắn gọn, dễ nhớ để khách hàng dễ tìm kiếm
                  </Typography>
                </div>
              </div>

              {/* CỘT PHẢI */}
              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Thông tin danh mục
                    </Typography>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <TagIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        label="Tên danh mục *"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.name}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        required
                      />
                      {errors.name && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.name[0]}
                        </Typography>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-3 z-10 pointer-events-none">
                        <DocumentTextIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Textarea
                        label="Mô tả danh mục"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.description}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        rows={4}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <div>
                          {errors.description && (
                            <Typography className="text-[10px] text-red-500 font-semibold">
                              {errors.description[0]}
                            </Typography>
                          )}
                        </div>
                        <Typography
                          className={`text-[10px] font-semibold ${
                            formData.description.length > 200 ? "text-orange-500" : "text-gray-400"
                          }`}
                        >
                          {formData.description.length} ký tự
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Trạng thái form
                    </Typography>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${
                        formData.name.trim()
                          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                          : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          formData.name.trim() ? "bg-green-100" : "bg-gray-200"
                        }`}
                      >
                        <TagIcon
                          className={`w-4 h-4 ${
                            formData.name.trim() ? "text-green-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <Typography
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            formData.name.trim() ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          Tên danh mục
                        </Typography>
                        <Typography
                          className={`text-xs font-extrabold ${
                            formData.name.trim() ? "text-green-700" : "text-gray-500"
                          }`}
                        >
                          {formData.name.trim() ? "✓ Đã nhập" : "Chưa nhập"}
                        </Typography>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300 ${
                        hasDescription
                          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                          : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          hasDescription ? "bg-green-100" : "bg-orange-100"
                        }`}
                      >
                        <DocumentTextIcon
                          className={`w-4 h-4 ${
                            hasDescription ? "text-green-600" : "text-orange-600"
                          }`}
                        />
                      </div>
                      <div className="min-w-0">
                        <Typography
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            hasDescription ? "text-green-700" : "text-orange-700"
                          }`}
                        >
                          Mô tả
                        </Typography>
                        <Typography
                          className={`text-xs font-extrabold ${
                            hasDescription ? "text-green-700" : "text-orange-700"
                          }`}
                        >
                          {hasDescription ? "✓ Đã nhập" : "Khuyến khích"}
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <InformationCircleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
                  <Typography className="text-xs text-[#6d4c41] leading-relaxed">
                    <span className="font-bold">Lưu ý:</span> Tên danh mục là bắt buộc. Mô tả giúp
                    khách hàng hiểu rõ hơn về danh mục sản phẩm. Nên đặt tên ngắn gọn, dễ tìm kiếm.
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
                  Thêm danh mục
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
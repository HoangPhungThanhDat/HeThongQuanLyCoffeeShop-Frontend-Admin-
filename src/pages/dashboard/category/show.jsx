// src/pages/dashboard/category/show.jsx
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from "@material-tailwind/react";
import {
  FolderIcon,
  TagIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  XMarkIcon,
  CheckBadgeIcon,
  ArrowPathIcon,
  SparklesIcon,
  FingerPrintIcon,
  Squares2X2Icon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { formatDate, hasDescription as checkHasDescription } from "./utils/formatters";

function InfoRow({ icon: Icon, label, value, highlight = false }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-100 hover:border-[#8B5E3C]/30 transition-colors duration-200">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#faf6f1] flex items-center justify-center">
        <Icon className="h-4 w-4 text-[#8B5E3C]" strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
          {label}
        </Typography>
        <Typography
          className={`text-sm font-semibold truncate ${
            highlight ? "text-[#8B5E3C] font-extrabold" : "text-gray-800"
          }`}
        >
          {value}
        </Typography>
      </div>
    </div>
  );
}

export function Show({ open, category, onClose }) {
  if (!category) return null;

  const hasDesc = checkHasDescription(category);

  return (
    <Dialog open={open} handler={onClose} size="lg" className="bg-transparent shadow-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <div className="relative bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] p-5 overflow-hidden">
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
              <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/90 shadow-lg bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm flex items-center justify-center">
                <FolderIcon className="w-10 h-10 text-white" strokeWidth={1.8} />
              </div>
              <motion.div
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <SparklesIcon className="h-2.5 w-2.5 text-white" />
              </motion.div>
            </div>

            <div className="flex-1 min-w-0">
              <Typography className="text-[10px] font-bold text-amber-100 uppercase tracking-widest">
                Chi tiết danh mục
              </Typography>
              <Typography variant="h5" className="text-white font-extrabold tracking-tight truncate">
                {category.name}
              </Typography>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/15 border border-white/20">
                  <FingerPrintIcon className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white">#{category.id}</span>
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border ${
                    hasDesc ? "bg-white/15 border-white/20" : "bg-orange-500/30 border-orange-200/40"
                  }`}
                >
                  <DocumentTextIcon className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white">
                    {hasDesc ? "Có mô tả" : "Chưa mô tả"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <DialogBody className="p-5 max-h-[55vh] overflow-y-auto bg-[#faf6f1]">
          <div className="space-y-4">
            {/* Quick stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <FingerPrintIcon className="h-4 w-4 text-[#8B5E3C] mb-1.5" />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  ID
                </Typography>
                <Typography className="text-sm font-extrabold text-[#4e342e]">
                  #{category.id}
                </Typography>
              </div>

              <div className="p-3 rounded-xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] shadow-sm">
                <TagIcon className="h-4 w-4 text-amber-200 mb-1.5" />
                <Typography className="text-[9px] font-bold text-amber-200/80 uppercase tracking-wider">
                  Tên danh mục
                </Typography>
                <Typography className="text-xs font-extrabold text-white truncate">
                  {category.name.length} ký tự
                </Typography>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  hasDesc ? "bg-green-50 border-green-200" : "bg-orange-50 border-orange-200"
                }`}
              >
                <DocumentTextIcon
                  className={`h-4 w-4 mb-1.5 ${hasDesc ? "text-green-600" : "text-orange-600"}`}
                />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Mô tả
                </Typography>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      hasDesc ? "bg-green-500 animate-pulse" : "bg-orange-500"
                    }`}
                  />
                  <Typography
                    className={`text-xs font-extrabold ${
                      hasDesc ? "text-green-700" : "text-orange-700"
                    }`}
                  >
                    {hasDesc ? "Đã có" : "Chưa có"}
                  </Typography>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-amber-100">
                <DocumentDuplicateIcon className="h-4 w-4 text-[#8B5E3C] mb-1.5" />
                <Typography className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  Độ dài mô tả
                </Typography>
                <Typography className="text-xs font-extrabold text-[#4e342e] truncate">
                  {category.description?.length || 0} ký tự
                </Typography>
              </div>
            </div>

            {/* Mô tả */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Mô tả danh mục
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-amber-100">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#faf6f1] flex items-center justify-center">
                  <DocumentTextIcon className="h-4 w-4 text-[#8B5E3C]" strokeWidth={2} />
                </div>
                <Typography
                  className={`text-sm leading-relaxed ${
                    hasDesc ? "text-gray-700" : "text-gray-400 italic"
                  }`}
                >
                  {category.description || "Danh mục này chưa có mô tả"}
                </Typography>
              </div>
            </div>

            {/* Chi tiết */}
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-1 h-4 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                <Typography className="text-[11px] font-extrabold uppercase text-[#6d4c41] tracking-widest">
                  Thông tin chi tiết
                </Typography>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-200 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <InfoRow icon={FingerPrintIcon} label="ID Danh mục" value={`#${category.id}`} />
                <InfoRow icon={TagIcon} label="Tên danh mục" value={category.name} highlight />
                <InfoRow
                  icon={DocumentTextIcon}
                  label="Trạng thái mô tả"
                  value={hasDesc ? "Đã có mô tả" : "Chưa có mô tả"}
                />
                <InfoRow
                  icon={Squares2X2Icon}
                  label="Số ký tự mô tả"
                  value={`${category.description?.length || 0} ký tự`}
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
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center">
                    <CalendarDaysIcon className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Ngày tạo
                    </Typography>
                    <Typography className="text-sm font-semibold text-gray-800">
                      {formatDate(category.createdAt)}
                    </Typography>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-amber-100">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gradient-to-br from-[#C89F77] to-[#a4714b] flex items-center justify-center">
                    <ArrowPathIcon className="h-4 w-4 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Cập nhật lần cuối
                    </Typography>
                    <Typography className="text-sm font-semibold text-gray-800">
                      {formatDate(category.updatedAt)}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* Note */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#8B5E3C]/10 flex items-center justify-center">
                <SparklesIcon className="h-4 w-4 text-[#8B5E3C]" />
              </div>
              <Typography className="text-xs text-[#6d4c41] leading-relaxed">
                <span className="font-bold">Ghi chú:</span> Đây là thông tin chi tiết của danh mục
                trong hệ thống Coffee Shop. Để thay đổi thông tin, vui lòng sử dụng chức năng chỉnh
                sửa.
              </Typography>
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
            className="ml-auto bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 normal-case font-bold flex items-center gap-2 text-sm"
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
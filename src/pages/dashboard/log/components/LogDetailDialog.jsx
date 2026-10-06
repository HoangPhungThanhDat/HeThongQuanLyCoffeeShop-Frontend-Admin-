
import {
  Dialog, DialogBody, DialogFooter,
  Button, Typography,
} from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  EyeIcon, XMarkIcon, CheckCircleIcon,
  GlobeAltIcon, ComputerDesktopIcon, ClockIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { ACTION_CONFIG, LEVEL_CONFIG } from "../constants";

export const LogDetailDialog = ({ selectedLog, open, onClose }) => {
  if (!selectedLog) return null;

  return (
    <Dialog
      open={open}
      handler={onClose}
      size="md"
      className="bg-transparent shadow-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] p-5">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 hover:scale-110"
          >
            <XMarkIcon className="h-4 w-4" strokeWidth={2.5} />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
              {(() => {
                const ActionIcon = ACTION_CONFIG[selectedLog.action]?.icon || EyeIcon;
                return <ActionIcon className="w-6 h-6 text-white" strokeWidth={2} />;
              })()}
            </div>
            <div>
              <Typography className="text-[10px] font-bold text-amber-100 uppercase tracking-widest">
                Chi tiết hoạt động
              </Typography>
              <Typography variant="h5" className="text-white font-extrabold tracking-tight">
                {ACTION_CONFIG[selectedLog.action]?.label || "—"} ·{" "}
                {selectedLog.targetName || selectedLog.target || "—"}
              </Typography>
            </div>
          </div>
        </div>

        {/* Body */}
        <DialogBody className="p-5 max-h-[60vh] overflow-y-auto bg-[#faf6f1] space-y-4">
          <div className="p-4 rounded-xl bg-white border border-amber-100">
            <Typography className="text-[10px] font-extrabold uppercase text-gray-400 tracking-widest mb-3">
              Người thực hiện
            </Typography>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ACTION_CONFIG[selectedLog.action]?.gradient || "from-gray-400 to-gray-600"} flex items-center justify-center text-white text-lg font-extrabold shadow-md`}>
                {selectedLog.user.avatar || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <Typography className="text-sm font-extrabold text-[#4e342e]">
                  {selectedLog.user.fullName || "Không xác định"}
                </Typography>
                <Typography className="text-xs text-gray-500">
                  @{selectedLog.user.username || "unknown"} ·{" "}
                  {selectedLog.user.role || "GUEST"}
                </Typography>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white border border-amber-100">
              <Typography className="text-[9px] font-extrabold uppercase text-gray-400 tracking-widest mb-1">
                Hành động
              </Typography>
              <Typography className="text-xs font-extrabold text-[#8B5E3C]">
                {ACTION_CONFIG[selectedLog.action]?.label || "—"}
              </Typography>
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-100">
              <Typography className="text-[9px] font-extrabold uppercase text-gray-400 tracking-widest mb-1">
                Mức độ
              </Typography>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold ${LEVEL_CONFIG[selectedLog.level]?.bg || "bg-gray-50"} ${LEVEL_CONFIG[selectedLog.level]?.text || "text-gray-700"} border ${LEVEL_CONFIG[selectedLog.level]?.border || "border-gray-200"}`}>
                {LEVEL_CONFIG[selectedLog.level]?.label || "—"}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-amber-100">
            <Typography className="text-[10px] font-extrabold uppercase text-gray-400 tracking-widest mb-2">
              Mô tả
            </Typography>
            <Typography className="text-xs text-gray-700 leading-relaxed mb-2">
              {selectedLog.description || "—"}
            </Typography>
            {selectedLog.details && (
              <Typography className="text-xs font-semibold text-[#8B5E3C] bg-[#faf6f1] p-2 rounded-lg border border-[#C89F77]/20 whitespace-pre-wrap">
                {selectedLog.details}
              </Typography>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white border border-amber-100">
              <Typography className="text-[9px] font-extrabold uppercase text-gray-400 tracking-widest mb-1">
                Địa chỉ IP
              </Typography>
              <div className="flex items-center gap-1.5">
                <GlobeAltIcon className="w-3.5 h-3.5 text-[#8B5E3C]" />
                <Typography className="text-xs font-bold text-[#4e342e]">
                  {selectedLog.ip}
                </Typography>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white border border-amber-100">
              <Typography className="text-[9px] font-extrabold uppercase text-gray-400 tracking-widest mb-1">
                Thời gian
              </Typography>
              <div className="flex items-center gap-1.5">
                <ClockIcon className="w-3.5 h-3.5 text-[#8B5E3C]" />
                <Typography className="text-xs font-bold text-[#4e342e]">
                  {dayjs(selectedLog.createdAt).format("HH:mm:ss DD/MM/YYYY")}
                </Typography>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white border border-amber-100">
            <Typography className="text-[9px] font-extrabold uppercase text-gray-400 tracking-widest mb-1">
              Thiết bị
            </Typography>
            <div className="flex items-center gap-1.5">
              <ComputerDesktopIcon className="w-3.5 h-3.5 text-[#8B5E3C] flex-shrink-0" />
              <Typography className="text-xs font-bold text-[#4e342e] break-all">
                {selectedLog.device}
              </Typography>
            </div>
          </div>
        </DialogBody>

        {/* Footer */}
        <DialogFooter className="bg-white border-t border-amber-100 p-4 flex items-center justify-between gap-3">
          <Typography className="text-xs text-gray-400 font-medium">
            Log ID: #{selectedLog.id}
          </Typography>
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 normal-case font-bold flex items-center gap-2 text-sm"
          >
            <CheckCircleIcon className="h-4 w-4" strokeWidth={2.5} />
            Đóng
          </Button>
        </DialogFooter>
      </motion.div>
    </Dialog>
  );
};
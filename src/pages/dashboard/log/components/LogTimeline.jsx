// src/pages/dashboard/log/components/LogTimeline.jsx
import { Card, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  EyeIcon,
  ChevronRightIcon,
  GlobeAltIcon,
  ComputerDesktopIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Pagination } from "@/widgets/pagination";
import dayjs from "dayjs";
import { ACTION_CONFIG, LEVEL_CONFIG } from "../constants";

export const LogTimeline = ({
  logs,
  page, totalPages, totalElements, pageSize,
  onPageChange,
  onViewDetail,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="rounded-3xl border border-amber-100 shadow-xl bg-white overflow-hidden">
        {logs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7] flex items-center justify-center mb-3">
              <DocumentTextIcon className="w-10 h-10 text-[#C89F77]" />
            </div>
            <Typography className="text-sm font-bold text-[#8B5E3C] mb-1">
              Không có nhật ký nào
            </Typography>
            <Typography className="text-xs text-gray-400">
              Thử thay đổi bộ lọc
            </Typography>
          </div>
        ) : (
          <>
            <div className="divide-y divide-amber-50">
              {logs.map((log, i) => {
                const actionCfg = ACTION_CONFIG[log.action] || ACTION_CONFIG.VIEW;
                const levelCfg = LEVEL_CONFIG[log.level] || LEVEL_CONFIG.INFO;
                const ActionIcon = actionCfg.icon;

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.02, 0.5) }}
                    className="group hover:bg-gradient-to-r hover:from-[#faf6f1] hover:to-[#fffaf5] transition-all duration-200 cursor-pointer"
                    onClick={() => onViewDetail(log)}
                  >
                    <div className="p-4 lg:p-5 flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex items-center gap-4 lg:w-auto flex-shrink-0">
                        <div className="text-center flex-shrink-0 w-20">
                          <Typography className="text-sm font-extrabold text-[#4e342e]">
                            {dayjs(log.createdAt).format("HH:mm")}
                          </Typography>
                          <Typography className="text-[10px] font-bold text-gray-400">
                            {dayjs(log.createdAt).format("DD/MM")}
                          </Typography>
                        </div>

                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${actionCfg.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                          <ActionIcon className="w-5 h-5 text-white" strokeWidth={2.2} />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${actionCfg.gradient} flex items-center justify-center text-white text-[10px] font-extrabold shadow-sm`}>
                              {log.user.avatar || "?"}
                            </div>
                            <Typography className="text-xs font-extrabold text-[#4e342e]">
                              {log.user.fullName || "Không xác định"}
                            </Typography>
                            <Typography className="text-[10px] font-medium text-gray-500">
                              @{log.user.username || "unknown"}
                            </Typography>
                          </div>

                          <ChevronRightIcon className="w-3 h-3 text-gray-400" />

                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${actionCfg.bg} ${actionCfg.border} ${actionCfg.text} border`}>
                            <ActionIcon className="w-3 h-3" strokeWidth={2.5} />
                            {actionCfg.label}
                          </span>

                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${levelCfg.bg} ${levelCfg.border} ${levelCfg.text} border`}>
                            {levelCfg.label}
                          </span>
                        </div>

                        <Typography className="text-xs font-semibold text-gray-700 mb-1">
                          {log.description || "—"}{" "}
                          <span className="text-[#8B5E3C]">
                            · {log.targetName || log.target || "—"}
                          </span>
                        </Typography>

                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
                          <div className="flex items-center gap-1">
                            <GlobeAltIcon className="w-3 h-3" />
                            {log.ip}
                          </div>
                          <div className="flex items-center gap-1 max-w-[200px] truncate">
                            <ComputerDesktopIcon className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{log.device}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" />
                            {dayjs(log.createdAt).fromNow()}
                          </div>
                        </div>
                      </div>

                      <div className="flex-shrink-0">
                        <button className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#faf6f1] hover:bg-[#8B5E3C] text-[#8B5E3C] hover:text-white border border-[#C89F77]/30 transition-all duration-200 hover:scale-110">
                          <EyeIcon className="w-4 h-4" strokeWidth={2.2} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              totalElements={totalElements}
              pageSize={pageSize}
              onPageChange={onPageChange}
              itemLabel="logs"
            />
          </>
        )}
      </Card>
    </motion.div>
  );
};
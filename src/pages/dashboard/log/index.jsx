
import { useState, useEffect } from "react";
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import {
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { CoffeeLoader } from "@/widgets/loaders";
import Swal from "sweetalert2";

import {
  LogHeader,
  LogStats,
  LogCharts,
  LogFilters,
  LogTimeline,
  LogDetailDialog,
} from "./components";
import { useLogFilters, useLogs, useLogStats } from "./hooks";
import { ACTION_CONFIG, LEVEL_CONFIG, AUTO_REFRESH_INTERVAL } from "./constants";

dayjs.extend(relativeTime);
dayjs.locale("vi");

// ==================== COMPONENT ====================
export function Logs() {
  // Detail dialog
  const [selectedLog, setSelectedLog] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);

  // ===== HOOKS =====
  const {
    searchTerm, setSearchTerm,
    debouncedSearch,
    actionFilter, setActionFilter,
    levelFilter, setLevelFilter,
    timeFilter, setTimeFilter,
    buildParams,
  } = useLogFilters();

  // Logs với pagination — refetch khi filter/search thay đổi
  const {
    logs,
    loading,
    page, setPage,
    totalPages,
    totalElements,
    pageSize,
    refetch: refetchLogs,
  } = useLogs(buildParams, [actionFilter, levelFilter, timeFilter, debouncedSearch]);

  // Stats + charts
  const {
    stats,
    dailyActivity,
    levelDistribution,
    lastRefreshed,
    isAutoRefreshing,
    refetchStats,
  } = useLogStats();

  // Fetch stats lần đầu
  useEffect(() => {
    refetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto refresh 30s (chỉ fetch silent)
  useEffect(() => {
    const interval = setInterval(() => {
      refetchLogs();
      refetchStats(true);
    }, AUTO_REFRESH_INTERVAL);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionFilter, levelFilter, timeFilter, debouncedSearch, page]);

  // ==================== HANDLERS ====================
  const handleViewDetail = (log) => {
    setSelectedLog(log);
    setOpenDetail(true);
  };

  const handleRefresh = () => {
    refetchLogs();
    refetchStats();
    Swal.fire({
      toast: true, position: "top-end", icon: "success",
      title: "Đã làm mới!", showConfirmButton: false, timer: 1500,
    });
  };

  const handleExport = () => {
    if (logs.length === 0) {
      Swal.fire({
        toast: true, position: "top-end", icon: "warning",
        title: "Không có dữ liệu để xuất",
        showConfirmButton: false, timer: 2000,
      });
      return;
    }

    const csvData = [
      ["Thời gian", "Người dùng", "Họ tên", "Vai trò", "Hành động",
       "Mức độ", "Đối tượng", "Tên đối tượng", "Mô tả", "Chi tiết", "IP", "Thiết bị"],
      ...logs.map((l) => [
        dayjs(l.createdAt).format("DD/MM/YYYY HH:mm:ss"),
        l.user?.username || "",
        l.user?.fullName || "",
        l.user?.role || "",
        ACTION_CONFIG[l.action]?.label || l.action,
        LEVEL_CONFIG[l.level]?.label || l.level,
        l.target || "",
        l.targetName || "",
        (l.description || "").replace(/,/g, ";"),
        (l.details || "").replace(/,/g, ";").replace(/\n/g, " "),
        l.ip || "",
        (l.device || "").replace(/,/g, ";"),
      ]),
    ];

    const csv = csvData
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `nhat-ky-he-thong-${dayjs().format("YYYY-MM-DD-HHmm")}.csv`;
    link.click();

    Swal.fire({
      toast: true, position: "top-end", icon: "success",
      title: "Đã xuất nhật ký!", showConfirmButton: false, timer: 2000,
    });
  };

  // ==================== LOADING ====================
  if (loading && logs.length === 0) {
    return (
      <CoffeeLoader
        title="Đang pha chế nhật ký"
        subtitle="Vui lòng chờ trong giây lát"
      />
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6">

        {/* HEADER */}
        <LogHeader
          isAutoRefreshing={isAutoRefreshing}
          lastRefreshed={lastRefreshed}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        {/* KPI CARDS */}
        <LogStats stats={stats} />

        {/* CHARTS */}
        <LogCharts
          dailyActivity={dailyActivity}
          levelDistribution={levelDistribution}
        />

        {/* FILTERS */}
        <LogFilters
          logsCount={logs.length}
          totalElements={totalElements}
          actionFilter={actionFilter} setActionFilter={setActionFilter}
          levelFilter={levelFilter} setLevelFilter={setLevelFilter}
          timeFilter={timeFilter} setTimeFilter={setTimeFilter}
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        />

        {/* TIMELINE + PAGINATION */}
        <LogTimeline
          logs={logs}
          page={page}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setPage}
          onViewDetail={handleViewDetail}
        />

        {/* INFO NOTE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <InformationCircleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Ghi chú:</span> Nhật ký hệ thống ghi lại
            tất cả hoạt động của người dùng và hệ thống, bao gồm đăng nhập, tạo,
            sửa, xóa dữ liệu và các cảnh báo bảo mật. Trang tự động làm mới mỗi
            30 giây. Nhấn vào từng dòng để xem chi tiết.
          </Typography>
        </motion.div>

        {/* FOOTER */}
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
            {logs.length} logs hiển thị · {stats.uniqueUsers} người dùng
          </Typography>
        </div>
      </div>

      {/* DETAIL DIALOG */}
      <LogDetailDialog
        selectedLog={selectedLog}
        open={openDetail}
        onClose={() => setOpenDetail(false)}
      />
    </div>
  );
}

export default Logs;
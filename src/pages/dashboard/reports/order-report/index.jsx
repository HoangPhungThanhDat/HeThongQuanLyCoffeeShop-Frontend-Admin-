// src/pages/dashboard/reports/order-report/index.jsx
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";
import dayjs from "dayjs";

import {
  OrderReportHeader,
  OrderReportFilters,
  OrderReportStats,
  OrderReportGrowthCards,
  OrderReportCharts,
  OrderReportTable,
} from "./components";
import { useOrderReport } from "./hooks";
import { STATUS_CONFIG } from "./constants";
import { CoffeeLoader } from "@/widgets/loaders";

export function OrderReport() {
  const {
    loading,
    filteredOrders,
    timeRange, setTimeRange,
    statusFilter, setStatusFilter,
    searchTerm, setSearchTerm,
    stats,
    dailyOrders,
    monthlyOrders,
    statusPieData,
    hourlyOrders,
    weekdayData,
  } = useOrderReport();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    const csvData = [
      ["Mã ĐH", "Ngày tạo", "Trạng thái", "Bàn", "Tổng tiền"],
      ...filteredOrders.map((o) => [
        o.id,
        dayjs(o.createdAt).format("DD/MM/YYYY HH:mm"),
        STATUS_CONFIG[o.status]?.label || o.status,
        o.table?.number || "N/A",
        o.totalAmount || 0,
      ]),
    ];
    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-don-hang-${dayjs().format("YYYY-MM-DD")}.csv`;
    link.click();

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "success",
      title: "Đã xuất báo cáo!",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  // Loader
  if (loading) {
    return (
      <CoffeeLoader
        title="Đang pha chế báo cáo đơn hàng"
        subtitle="Vui lòng chờ trong giây lát"
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6">
        {/* HEADER */}
        <OrderReportHeader
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        {/* FILTERS */}
        <OrderReportFilters
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* KPI CARDS */}
        <OrderReportStats stats={stats} />

        {/* GROWTH CARDS */}
        <OrderReportGrowthCards stats={stats} />

        {/* CHARTS */}
        <OrderReportCharts
          dailyOrders={dailyOrders}
          monthlyOrders={monthlyOrders}
          statusPieData={statusPieData}
          hourlyOrders={hourlyOrders}
          weekdayData={weekdayData}
        />

        {/* TABLE */}
        <OrderReportTable filteredOrders={filteredOrders} />

        {/* INFO NOTE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <SparklesIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Ghi chú:</span> Báo cáo đơn hàng hiển thị
            chi tiết tất cả đơn hàng theo khoảng thời gian và trạng thái được
            chọn. Sử dụng bộ lọc để phân tích từng nhóm đơn hàng cụ thể. Nhấn
            "Xuất báo cáo" để tải CSV chi tiết.
          </Typography>
        </motion.div>
      </div>
    </div>
  );
}

export default OrderReport;
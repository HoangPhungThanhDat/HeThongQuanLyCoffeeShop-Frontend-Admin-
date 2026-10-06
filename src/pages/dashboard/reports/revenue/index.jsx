// src/pages/dashboard/reports/revenue/index.jsx
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

import {
  RevenueHeader,
  RevenueDateFilter,
  RevenueStats,
  RevenueGrowthCards,
  RevenueCharts,
  RevenueTopProducts,
} from "./components";
import { useRevenueReport, useRevenueExport } from "./hooks";
import { CoffeeLoader } from "@/widgets/loaders";

export function Revenue() {
  const {
    loading,
    report,
    preset,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    handlePresetChange,
    fetchReport,
    stats,
    dailyRevenue,
    paymentMethodData,
    topProducts,
  } = useRevenueReport();

  const { handleExport } = useRevenueExport(
    dailyRevenue,
    topProducts,
    fromDate,
    toDate
  );

  const handleRefresh = async () => {
    try {
      await fetchReport();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Đã làm mới!",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Không tải được báo cáo",
        text: error?.response?.data?.message || "Vui lòng thử lại",
        confirmButtonColor: "#8B5E3C",
      });
    }
  };

  // Loader
  if (loading && !report) {
    return (
      <CoffeeLoader
        title="Đang pha chế báo cáo"
        subtitle="Vui lòng chờ trong giây lát"
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6">
        {/* HEADER */}
        <RevenueHeader
          loading={loading}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        {/* DATE FILTER */}
        <RevenueDateFilter
          preset={preset}
          fromDate={fromDate}
          toDate={toDate}
          onPresetChange={handlePresetChange}
          onFromDateChange={setFromDate}
          onToDateChange={setToDate}
          onApply={fetchReport}
        />

        {/* KPI CARDS */}
        <RevenueStats stats={stats} />

        {/* GROWTH CARDS */}
        <RevenueGrowthCards
          stats={stats}
          fromDate={fromDate}
          toDate={toDate}
        />

        {/* CHARTS */}
        <RevenueCharts
          dailyRevenue={dailyRevenue}
          paymentMethodData={paymentMethodData}
        />

        {/* TOP PRODUCTS */}
        <RevenueTopProducts
          topProducts={topProducts}
          fromDate={fromDate}
          toDate={toDate}
        />

        {/* INFO NOTE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <SparklesIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Ghi chú:</span> Báo cáo doanh thu cung
            cấp cái nhìn tổng quan về hiệu suất kinh doanh. Dữ liệu chỉ tính các
            hóa đơn{" "}
            <span className="font-bold">ĐÃ THANH TOÁN (COMPLETED)</span>. Chọn
            "Tùy chỉnh" để chọn khoảng ngày cụ thể. Nhấn "Xuất báo cáo" để tải
            file CSV.
          </Typography>
        </motion.div>
      </div>
    </div>
  );
}

export default Revenue;
// src/pages/dashboard/reports/inventory-report/index.jsx
import { Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { SparklesIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import Swal from "sweetalert2";

import {
  InventoryReportHeader,
  InventoryReportAlert,
  InventoryReportFilters,
  InventoryReportStats,
  InventoryReportStockStatus,
  InventoryReportCharts,
  InventoryReportTable,
} from "./components";
import { useInventoryReport } from "./hooks";
import { getStockConfig } from "./constants";
import { CoffeeLoader } from "@/widgets/loaders";

export function InventoryReport() {
  const {
    loading,
    categories,
    filteredProducts,
    paginatedProducts,
    categoryFilter, setCategoryFilter,
    stockFilter, setStockFilter,
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    page, setPage,
    pageSize,
    totalPages,
    totalElements,
    stats,
    stockDistribution,
    categoryDistribution,
    topValueProducts,
    categoryRadarData,
  } = useInventoryReport();

  // ==================== EXPORT ====================
  const handleExport = () => {
    const csvData = [
      ["ID", "Tên SP", "Danh mục", "Tồn kho", "Giá", "Giá trị tồn", "Trạng thái"],
      ...filteredProducts.map((p) => [
        p.id,
        p.name,
        p.category?.name || "N/A",
        p.stockQuantity || 0,
        p.price || 0,
        (p.price || 0) * (p.stockQuantity || 0),
        getStockConfig(p.stockQuantity || 0).label,
      ]),
    ];
    const csv = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bao-cao-kho-hang-${dayjs().format("YYYY-MM-DD")}.csv`;
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

  const handleRefresh = () => {
    window.location.reload();
  };

  // ==================== LOADER ====================
  if (loading) {
    return (
      <CoffeeLoader
        title="Đang pha chế báo cáo kho"
        subtitle="Vui lòng chờ trong giây lát"
      />
    );
  }

  // ==================== MAIN RENDER ====================
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex flex-col gap-6">
        {/* HEADER */}
        <InventoryReportHeader
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        {/* ALERT */}
        <InventoryReportAlert
          stats={stats}
          onViewLow={() => setStockFilter("LOW")}
        />

        {/* FILTERS */}
        <InventoryReportFilters
          categories={categories}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          stockFilter={stockFilter}
          setStockFilter={setStockFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        {/* KPI CARDS */}
        <InventoryReportStats stats={stats} />

        {/* STOCK STATUS CARDS */}
        <InventoryReportStockStatus
          stats={stats}
          stockFilter={stockFilter}
          onFilterChange={setStockFilter}
        />

        {/* CHARTS */}
        <InventoryReportCharts
          categoryDistribution={categoryDistribution}
          stockDistribution={stockDistribution}
          categoryRadarData={categoryRadarData}
          topValueProducts={topValueProducts}
        />

        {/* TABLE */}
        <InventoryReportTable
          filteredProducts={filteredProducts}
          paginatedProducts={paginatedProducts}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={setPage}
        />

        {/* INFO NOTE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200"
        >
          <SparklesIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
          <Typography className="text-xs text-[#6d4c41] leading-relaxed">
            <span className="font-bold">Ghi chú:</span> Báo cáo kho hàng giúp
            theo dõi tình trạng tồn kho theo danh mục, cảnh báo sản phẩm sắp hết
            hoặc đã hết hàng. Sử dụng bộ lọc để phân tích từng nhóm sản phẩm.
            Nhấn "Xuất báo cáo" để tải CSV chi tiết.
          </Typography>
        </motion.div>
      </div>
    </div>
  );
}

export default InventoryReport;
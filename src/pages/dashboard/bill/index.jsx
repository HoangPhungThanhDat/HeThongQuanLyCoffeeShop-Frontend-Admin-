import { useState } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { ReceiptPercentIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import "animate.css";

import { CoffeeLoader } from "@/widgets/loaders";
import { Pagination } from "@/widgets/pagination";
import {
  BillTable,
  BillHeader,
  BillStats,
  BillSearch,
  BillFilters,
} from "./components";
import Create from "./create";
import Edit from "./edit";
import Show from "./show";

import { useBills } from "./hooks/useBills";
import { useBillStats } from "./hooks/useBillStats";
import { useOrders } from "./hooks/useOrders";
import { useBillMutations } from "./hooks/useBillMutations";

export function Bill() {
  // ============ BILL LIST (phân trang) ============
  const {
    bills,
    page,
    size,
    totalPages,
    totalElements,
    setPage,
    searchTerm,
    selectedStatus,
    selectedMethod,
    hasActiveFilters,
    setSearchTerm,
    setSelectedStatus,
    setSelectedMethod,
    toggleStatusFilter,
    clearFilters,
    isLoading,
    isFetching,
    refetch,
  } = useBills();

  // ============ STATS (toàn bộ — gọi API riêng) ============
  const { data: stats } = useBillStats();

  // ============ ORDERS (dropdown) ============
  const { orders } = useOrders();

  // ============ MUTATIONS ============
  const { confirmAndDelete } = useBillMutations();

  // ============ DIALOG STATE ============
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

  // ============ HANDLERS ============
  const handleShow = (bill) => {
    setSelectedBill(bill);
    setOpenShowDialog(true);
  };

  const handleEdit = (bill) => {
    setSelectedBill(bill);
    setOpenEditDialog(true);
  };

  const handleDelete = (id) => confirmAndDelete(id);

  // ============ LOADER ============
  if (isLoading) {
    return (
      <CoffeeLoader
        title="Đang pha chế hóa đơn"
        subtitle="Vui lòng chờ trong giây lát"
      />
    );
  }

  // ============ RENDER ============
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8 2xl:py-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 flex flex-col gap-6 lg:gap-8">
        {/* Page Header */}
        <BillHeader
          onCreate={() => setOpenCreateDialog(true)}
          onRefresh={refetch}
        />

        {/* Stats — lấy từ useBillStats (toàn bộ, không phụ thuộc trang) */}
        <BillStats
          stats={stats}
          selectedStatus={selectedStatus}
          onStatusClick={toggleStatusFilter}
        />

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <Card className="w-full shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
            <CardHeader
              variant="gradient"
              className="m-0 p-4 lg:p-6 2xl:p-7 rounded-none bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 flex-shrink-0">
                    <ReceiptPercentIcon className="w-5 h-5 2xl:w-6 2xl:h-6 text-white" />
                  </div>
                  <div>
                    <Typography
                      variant="h6"
                      className="font-bold text-white tracking-wide text-base lg:text-lg 2xl:text-xl"
                    >
                      Danh Sách Hóa Đơn
                    </Typography>
                    <Typography className="text-xs 2xl:text-sm text-white/80 font-medium">
                      {totalElements > 0
                        ? `Trang ${page + 1}/${totalPages} — ${totalElements} hóa đơn`
                        : "Chưa có hóa đơn"}
                    </Typography>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <BillFilters
                    selectedStatus={selectedStatus}
                    selectedMethod={selectedMethod}
                    onStatusChange={setSelectedStatus}
                    onMethodChange={setSelectedMethod}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                  <BillSearch value={searchTerm} onChange={setSearchTerm} />
                </div>
              </div>
            </CardHeader>

            <CardBody className="p-0">
              {/* isFetching: làm mờ nhẹ khi fetch trang mới, vẫn giữ data cũ */}
              <div
                className={
                  isFetching
                    ? "opacity-60 pointer-events-none transition-opacity duration-200"
                    : "transition-opacity duration-200"
                }
              >
                <BillTable
                  bills={bills}
                  onShow={handleShow}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>

              {/* Phân trang */}
              <Pagination
                page={page}
                totalPages={totalPages}
                totalElements={totalElements}
                pageSize={size}
                onPageChange={setPage}
              />
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Dialogs */}
      <Create
        open={openCreateDialog}
        orders={orders}
        onClose={() => setOpenCreateDialog(false)}
      />

      <Edit
        key={selectedBill?.id}
        open={openEditDialog}
        bill={selectedBill}
        orders={orders}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedBill(null);
        }}
      />

      <Show
        open={openShowDialog}
        bill={selectedBill}
        onClose={() => {
          setOpenShowDialog(false);
          setSelectedBill(null);
        }}
      />
    </div>
  );
}

export default Bill;
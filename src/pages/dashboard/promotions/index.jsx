
import { useState } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { GiftIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import "animate.css";

import { CoffeeLoader } from "@/widgets/loaders";
import {
  PromotionsTable,
  PromotionsHeader,
  PromotionsStats,
  PromotionsSearch,
  PromotionsFilters,
} from "./components";
import Create from "./create";
import Edit from "./edit";
import Show from "./show";

import { usePromotions } from "./hooks/usePromotions";
import { useProducts } from "./hooks/useProducts";
import { usePromotionMutations } from "./hooks/usePromotionMutations";

export function Promotions() {
  const {
    filteredPromotions,
    stats,
    searchTerm,
    selectedStatus,
    hasActiveFilters,
    setSearchTerm,
    setSelectedStatus,
    toggleStatusFilter,
    clearFilters,
    isLoading,
    refetch,
  } = usePromotions();

  const { products } = useProducts();
  const { confirmAndDelete } = usePromotionMutations();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  // ============ HANDLERS ============
  const handleShow = (promotion) => {
    setSelectedPromotion(promotion);
    setOpenShowDialog(true);
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setOpenEditDialog(true);
  };

  const handleDelete = (id) => confirmAndDelete(id);

  // ============ LOADER ============
  if (isLoading) {
    return (
      <CoffeeLoader
        title="Đang pha chế khuyến mãi"
        subtitle="Vui lòng chờ trong giây lát"
      />
    );
  }

  // ============ RENDER ============
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8 2xl:py-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 flex flex-col gap-6 lg:gap-8">
        {/* Page Header */}
        <PromotionsHeader
          onCreate={() => setOpenCreateDialog(true)}
          onRefresh={refetch}
        />

        {/* Stats */}
        <PromotionsStats
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
                    <GiftIcon className="w-5 h-5 2xl:w-6 2xl:h-6 text-white" />
                  </div>
                  <div>
                    <Typography
                      variant="h6"
                      className="font-bold text-white tracking-wide text-base lg:text-lg 2xl:text-xl"
                    >
                      Danh Sách Khuyến Mãi
                    </Typography>
                    <Typography className="text-xs 2xl:text-sm text-white/80 font-medium">
                      {filteredPromotions.length} / {stats.totalPromotions} chương trình hiển thị
                    </Typography>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <PromotionsFilters
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    onClear={clearFilters}
                    hasActiveFilters={hasActiveFilters}
                  />
                  <PromotionsSearch value={searchTerm} onChange={setSearchTerm} />
                </div>
              </div>
            </CardHeader>

            <CardBody className="p-0">
              <PromotionsTable
                promotions={filteredPromotions}
                onShow={handleShow}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Dialogs */}
      <Create
        open={openCreateDialog}
        products={products}
        onClose={() => setOpenCreateDialog(false)}
      />

      <Edit
        key={selectedPromotion?.id}
        open={openEditDialog}
        promotion={selectedPromotion}
        products={products}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedPromotion(null);
        }}
      />

      <Show
        open={openShowDialog}
        promotion={selectedPromotion}
        onClose={() => {
          setOpenShowDialog(false);
          setSelectedPromotion(null);
        }}
      />
    </div>
  );
}

export default Promotions;
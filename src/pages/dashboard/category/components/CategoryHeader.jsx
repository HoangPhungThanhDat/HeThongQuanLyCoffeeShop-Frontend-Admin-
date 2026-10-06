// src/pages/dashboard/category/components/CategoryHeader.jsx
import { Typography, Button } from "@material-tailwind/react";
import { PlusIcon, FolderIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function CategoryHeader({ onCreate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 2xl:w-16 2xl:h-16 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] flex items-center justify-center shadow-lg shadow-[#8B5E3C]/30 flex-shrink-0">
          <FolderIcon className="w-6 h-6 2xl:w-8 2xl:h-8 text-white" />
        </div>
        <div>
          <Typography
            variant="h4"
            className="font-extrabold text-[#4e342e] tracking-tight text-2xl lg:text-3xl 2xl:text-4xl"
          >
            Quản Lý Danh Mục
          </Typography>
          <Typography className="text-xs lg:text-sm text-[#8B5E3C] font-medium">
            Hệ thống quản lý Coffee Shop ☕
          </Typography>
        </div>
      </div>

      <Button
        size="lg"
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] shadow-lg shadow-[#8B5E3C]/30 hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl normal-case font-bold w-full md:w-auto px-6 2xl:px-8 py-3 2xl:py-4 text-sm 2xl:text-base"
        onClick={onCreate}
      >
        <PlusIcon className="h-5 w-5" strokeWidth={2.5} />
        Thêm danh mục
      </Button>
    </motion.div>
  );
}

export default CategoryHeader;
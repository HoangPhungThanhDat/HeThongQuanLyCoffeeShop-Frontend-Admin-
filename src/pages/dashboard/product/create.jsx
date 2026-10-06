// src/pages/dashboard/product/create.jsx
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Select,
  Option,
  Switch,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import {
  CubeIcon,
  TagIcon,
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  XMarkIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useProductForm } from "./hooks/useProductForm";
import { ProductImageUpload } from "./components/ProductImageUpload";
import { ProductStockWarning } from "./components/ProductStockWarning";

export function Create({ open, categories = [], onClose, onSuccess }) {
  const {
    formData,
    errors,
    imagePreview,
    formattedPrice,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleImageChange,
    removeImage,
    handleSubmit,
    handleClose,
  } = useProductForm({ onClose, onSuccess });

  return (
    <Dialog open={open} handler={handleClose} size="xl" className="bg-transparent shadow-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* HEADER */}
        <DialogHeader className="relative bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] p-6 m-0 rounded-none overflow-hidden block">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -left-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="absolute top-1/2 right-1/3 w-20 h-20 rounded-full bg-white/5" />

          <div className="relative flex items-center gap-4 w-full z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm border border-white/30 shadow-lg flex-shrink-0">
              <SparklesIcon className="h-7 w-7 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <Typography variant="h4" className="text-white font-extrabold tracking-tight text-xl lg:text-2xl">
                Thêm Sản Phẩm Mới
              </Typography>
              <Typography variant="small" className="text-white/85 font-medium">
                Tạo sản phẩm mới cho menu Coffee Shop ☕
              </Typography>
            </div>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 text-white transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0 disabled:opacity-50"
            >
              <XMarkIcon className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
        </DialogHeader>

        {/* BODY */}
        <DialogBody className="p-0 max-h-[70vh] overflow-y-auto bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3]">
          <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
              {/* CỘT TRÁI */}
              <div className="flex flex-col items-center">
                <ProductImageUpload
                  imagePreview={imagePreview}
                  onImageChange={handleImageChange}
                  onRemove={removeImage}
                  disabled={isSubmitting}
                  required
                />

                {/* Status preview */}
                <div
                  className={`mt-4 w-full p-3 rounded-2xl border-2 transition-all duration-300 ${
                    formData.isActive
                      ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                      : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 justify-center">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        formData.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                      }`}
                    />
                    <Typography
                      className={`text-xs font-bold ${
                        formData.isActive ? "text-green-700" : "text-gray-600"
                      }`}
                    >
                      {formData.isActive ? "Đang bán" : "Ngưng bán"}
                    </Typography>
                  </div>
                </div>

                {/* Price preview */}
                {formattedPrice && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 w-full p-4 rounded-2xl bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] border-2 border-[#C89F77]/40 shadow-lg"
                  >
                    <Typography className="text-[10px] font-extrabold text-amber-200 uppercase tracking-widest text-center">
                      💰 Giá bán
                    </Typography>
                    <Typography className="text-lg font-extrabold text-white text-center mt-1 truncate">
                      {formattedPrice}
                    </Typography>
                  </motion.div>
                )}
              </div>

              {/* CỘT PHẢI */}
              <div className="space-y-5">
                {/* Section: Thông tin cơ bản */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Thông tin cơ bản
                    </Typography>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <CubeIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        label="Tên sản phẩm *"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.name}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        required
                      />
                      {errors.name && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.name[0]}
                        </Typography>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-3 z-10 pointer-events-none">
                        <DocumentTextIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Textarea
                        label="Mô tả sản phẩm"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Section: Giá & Kho */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Giá & kho hàng
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <CurrencyDollarIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        type="number"
                        label="Giá (VNĐ) *"
                        name="price"
                        min="0"
                        step="1000"
                        value={formData.price}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.price}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        required
                      />
                      {errors.price && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.price[0]}
                        </Typography>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <ArchiveBoxIcon className="h-5 w-5 text-[#8B5E3C]" />
                      </div>
                      <Input
                        type="number"
                        label="Số lượng tồn kho *"
                        name="stockQuantity"
                        min="0"
                        value={formData.stockQuantity}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        error={!!errors.stockQuantity}
                        className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                        labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                        required
                      />
                      {errors.stockQuantity && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.stockQuantity[0]}
                        </Typography>
                      )}
                    </div>
                  </div>

                  <ProductStockWarning quantity={formData.stockQuantity} variant="form" />
                </div>

                {/* Section: Phân loại & trạng thái */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-5 bg-gradient-to-b from-[#8B5E3C] to-[#C89F77] rounded-full" />
                    <Typography className="text-xs font-extrabold uppercase text-[#6d4c41] tracking-widest">
                      Phân loại & trạng thái
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                          <TagIcon className="h-5 w-5 text-[#8B5E3C]" />
                        </div>
                        <Select
                          label="Danh mục *"
                          value={formData.categoryId?.toString() || ""}
                          onChange={(val) => handleSelectChange("categoryId", val)}
                          disabled={isSubmitting}
                          error={!!errors.categoryId}
                          className="!pl-10 !border-[#C89F77]/40 focus:!border-[#8B5E3C] !rounded-xl"
                          labelProps={{ className: "!text-[#8B5E3C]/70 font-medium" }}
                          menuProps={{ className: "!rounded-xl !border-[#C89F77]/30" }}
                        >
                          {categories.map((category) => (
                            <Option key={category.id} value={category.id.toString()}>
                              📁 {category.name}
                            </Option>
                          ))}
                        </Select>
                      </div>
                      {errors.categoryId && (
                        <Typography className="text-[10px] text-red-500 mt-1 ml-1 font-semibold">
                          {errors.categoryId[0]}
                        </Typography>
                      )}
                    </div>

                    <div
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 ${
                        formData.isActive
                          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                          : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            formData.isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                          }`}
                        />
                        <div>
                          <Typography
                            className={`text-xs font-bold ${
                              formData.isActive ? "text-green-700" : "text-gray-600"
                            }`}
                          >
                            {formData.isActive ? "Đang bán" : "Ngưng bán"}
                          </Typography>
                        </div>
                      </div>
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) => handleSwitchChange("isActive", e.target.checked)}
                        disabled={isSubmitting}
                        className="checked:bg-[#8B5E3C]"
                      />
                    </div>
                  </div>
                </div>

                {/* Info Note */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                  <InformationCircleIcon className="h-5 w-5 text-[#8B5E3C] flex-shrink-0 mt-0.5" />
                  <Typography className="text-xs text-[#6d4c41] leading-relaxed">
                    <span className="font-bold">Lưu ý:</span> Các trường có dấu{" "}
                    <span className="text-red-500 font-bold">*</span> là bắt buộc. Ảnh sản
                    phẩm sẽ được hiển thị trên menu và trang chi tiết.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </DialogBody>

        {/* FOOTER */}
        <DialogFooter className="bg-white border-t border-amber-100 p-4 lg:p-5 gap-3 flex items-center justify-between">
          <Typography className="text-xs text-gray-400 font-medium hidden sm:block">
            ☕ Coffee Shop Admin Panel
          </Typography>
          <div className="flex gap-3 ml-auto">
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isSubmitting}
              className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 px-6 rounded-xl normal-case font-bold transition-all duration-200 disabled:opacity-50"
            >
              Hủy Bỏ
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white px-8 rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#8B5E3C]/30 transition-all duration-300 hover:scale-105 active:scale-95 normal-case font-bold disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" strokeWidth={2.5} />
                  Tạo Sản Phẩm
                </span>
              )}
            </Button>
          </div>
        </DialogFooter>
      </motion.div>
    </Dialog>
  );
}

export default Create;
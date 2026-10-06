// src/pages/dashboard/promotions/components/ProductSelector.jsx
import { useState, useMemo } from "react";
import { Typography } from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { formatPrice } from "../utils/formatters";

export function ProductSelector({
  products = [],
  selectedProducts = [],
  onToggle,
  onSelectAll,
  onClearAll,
  disabled = false,
}) {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const term = search.toLowerCase();
    return products.filter((p) => p.name?.toLowerCase().includes(term));
  }, [products, search]);

  // Chuẩn hóa so sánh: string vs number
  const selectedAsStrings = useMemo(
    () => selectedProducts.map(String),
    [selectedProducts]
  );

  const isProductSelected = (productId) =>
    selectedAsStrings.includes(String(productId));

  const allFilteredSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => isProductSelected(p.id));

  const handleSelectAllFiltered = () => {
    if (allFilteredSelected) {
      const filteredIds = filteredProducts.map((p) => String(p.id));
      onSelectAll(selectedProducts.filter((id) => !filteredIds.includes(String(id))));
    } else {
      const merged = new Set([
        ...selectedProducts.map(String),
        ...filteredProducts.map((p) => String(p.id)),
      ]);
      onSelectAll([...merged]);
    }
  };

  return (
    <div className="p-3 rounded-xl bg-white border border-amber-100 shadow-sm">
      {/* Search */}
      <div className="relative mb-3">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B5E3C]" />
        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={disabled}
          className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#faf6f1] border border-[#C89F77]/30 text-xs font-medium text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C89F77]/40"
        />
      </div>

      {/* Đã chọn count + clear */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center justify-between mb-2">
          <Typography className="text-[10px] font-bold text-green-700">
            ✓ Đã chọn {selectedProducts.length} sản phẩm
          </Typography>
          <button
            type="button"
            onClick={onClearAll}
            disabled={disabled}
            className="text-[10px] text-red-600 hover:text-red-700 font-bold uppercase tracking-wider"
          >
            Bỏ chọn tất cả
          </button>
        </div>
      )}

      {/* Select all filtered */}
      {filteredProducts.length > 0 && (
        <div
          className="flex items-center gap-2.5 p-2 mb-2 rounded-lg bg-gradient-to-r from-[#8B5E3C]/5 to-[#C89F77]/5 border border-dashed border-[#8B5E3C]/30 cursor-pointer select-none"
          onClick={() => !disabled && handleSelectAllFiltered()}
        >
          <input
            type="checkbox"
            checked={allFilteredSelected}
            readOnly
            disabled={disabled}
            className="w-5 h-5 rounded border-2 border-[#C89F77] accent-[#8B5E3C] pointer-events-none"
          />
          <Typography className="text-[11px] font-extrabold text-[#8B5E3C] uppercase tracking-wider">
            {allFilteredSelected
              ? "Bỏ chọn tất cả hiển thị"
              : `CHỌN TẤT CẢ (${filteredProducts.length})`}
          </Typography>
        </div>
      )}

      {/* List */}
      <div className="max-h-[180px] overflow-y-auto space-y-1.5 pr-1">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            const isSelected = isProductSelected(product.id);
            return (
              <div
                key={product.id}
                onClick={() => !disabled && onToggle(product.id)}
                className={`flex items-center gap-2.5 p-2 rounded-lg transition-all duration-200 select-none ${
                  disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                } ${
                  isSelected
                    ? "bg-gradient-to-r from-[#8B5E3C]/10 to-[#C89F77]/10 border border-[#8B5E3C]/30"
                    : "bg-[#faf6f1] border border-transparent hover:border-[#C89F77]/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  readOnly
                  disabled={disabled}
                  className="w-5 h-5 rounded border-2 border-[#C89F77] accent-[#8B5E3C] pointer-events-none"
                />
                <div className="flex-1 min-w-0">
                  <Typography
                    className={`text-xs font-bold truncate ${
                      isSelected ? "text-[#8B5E3C]" : "text-gray-800"
                    }`}
                  >
                    {product.name}
                  </Typography>
                  <Typography className="text-[10px] text-gray-500">
                    #{product.id} · {formatPrice(product.price)}
                  </Typography>
                </div>
              </div>
            );
          })
        ) : (
          <Typography className="text-xs text-gray-400 text-center py-4 italic">
            Không tìm thấy sản phẩm
          </Typography>
        )}
      </div>
    </div>
  );
}

export default ProductSelector;
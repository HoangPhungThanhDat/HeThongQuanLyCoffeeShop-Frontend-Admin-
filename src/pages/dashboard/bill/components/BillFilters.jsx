
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from "../constants/paymentConfig";

export function BillFilters({
  selectedStatus,
  selectedMethod,
  onStatusChange,
  onMethodChange,
  onClear,
  hasActiveFilters,
}) {
  return (
    <>
      {/* Status Filter */}
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2.5 2xl:py-3 rounded-xl bg-white/95 border border-white/50 text-sm 2xl:text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm cursor-pointer"
      >
        <option value="ALL">🧾 Tất cả TT</option>
        {PAYMENT_STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.emoji} {s.label}
          </option>
        ))}
      </select>

      {/* Method Filter */}
      <select
        value={selectedMethod}
        onChange={(e) => onMethodChange(e.target.value)}
        className="px-4 py-2.5 2xl:py-3 rounded-xl bg-white/95 border border-white/50 text-sm 2xl:text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm cursor-pointer"
      >
        <option value="ALL">💳 Tất cả PT</option>
        {PAYMENT_METHOD_OPTIONS.map((m) => (
          <option key={m.value} value={m.value}>
            {m.emoji} {m.label}
          </option>
        ))}
      </select>

      {/* Clear Button */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 border border-white/30 text-white text-xs font-bold transition-all duration-200"
        >
          <ArrowPathIcon className="w-3.5 h-3.5" />
          Xóa lọc
        </button>
      )}
    </>
  );
}

export default BillFilters;
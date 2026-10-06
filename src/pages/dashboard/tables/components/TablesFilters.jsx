
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { TABLE_STATUS_OPTIONS } from "../constants/tableConfig";

export function TablesFilters({
  selectedStatus,
  onStatusChange,
  onClear,
  hasActiveFilters,
}) {
  return (
    <>
      {/* Status filter */}
      <select
        value={selectedStatus}
        onChange={(e) => onStatusChange(e.target.value)}
        className="px-4 py-2.5 2xl:py-3 rounded-xl bg-white/95 border border-white/50 text-sm 2xl:text-base font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-sm cursor-pointer"
      >
        <option value="ALL">🔲 Tất cả trạng thái</option>
        {TABLE_STATUS_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.emoji} {s.label}
          </option>
        ))}
      </select>

      {/* Reset filter */}
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

export default TablesFilters;
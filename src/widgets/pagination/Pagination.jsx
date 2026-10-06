import React from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Pagination({
  page = 0,
  totalPages = 0,
  totalElements = 0,
  pageSize = 10,
  onPageChange,
  itemLabel = "bản ghi",   // ✅ THÊM PROP NÀY
}) {
  if (totalPages <= 1) return null;

  const go = (p) => {
    if (p < 0 || p >= totalPages || p === page) return;
    onPageChange?.(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildPages = () => {
    const delta = 1;
    const range = [];
    const left = Math.max(0, page - delta);
    const right = Math.min(totalPages - 1, page + delta);

    if (left > 0) range.push(0);
    if (left > 1) range.push("...");
    for (let i = left; i <= right; i++) range.push(i);
    if (right < totalPages - 2) range.push("...");
    if (right < totalPages - 1) range.push(totalPages - 1);
    return range;
  };

  const from = totalElements === 0 ? 0 : page * pageSize + 1;
  const to = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-amber-100">
      <p className="text-sm text-gray-600">
        Hiển thị <span className="font-semibold text-[#8B5E3C]">{from}–{to}</span>{" "}
        trên <span className="font-semibold text-[#8B5E3C]">{totalElements.toLocaleString()}</span> {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <IconButton
          variant="text"
          size="sm"
          onClick={() => go(page - 1)}
          disabled={page === 0}
          className="rounded-lg disabled:opacity-40"
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </IconButton>

        {buildPages().map((p, idx) =>
          p === "..." ? (
            <span key={`dots-${idx}`} className="px-2 text-gray-400 select-none">
              …
            </span>
          ) : (
            <Button
              key={p}
              size="sm"
              variant={p === page ? "gradient" : "text"}
              color={p === page ? "brown" : "blue-gray"}
              onClick={() => go(p)}
              className={`min-w-[36px] rounded-lg ${
                p === page
                  ? "bg-gradient-to-r from-[#8B5E3C] to-[#C89F77] shadow-md"
                  : ""
              }`}
            >
              {p + 1}
            </Button>
          )
        )}

        <IconButton
          variant="text"
          size="sm"
          onClick={() => go(page + 1)}
          disabled={page >= totalPages - 1}
          className="rounded-lg disabled:opacity-40"
        >
          <ChevronRightIcon className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}
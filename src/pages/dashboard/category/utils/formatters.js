// src/pages/dashboard/category/utils/formatters.js

/**
 * Format date sang định dạng Việt Nam
 */
export function formatDate(date) {
    if (!date) return "N/A";
    try {
      return new Date(date).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  }
  
  /**
   * Check category có mô tả không
   */
  export function hasDescription(category) {
    return Boolean(category?.description && category.description.trim() !== "");
  }
  
  /**
   * Tính % cho progress bar
   */
  export function calcPercent(value, total) {
    if (!total) return 0;
    return Math.round((value / total) * 100);
  }
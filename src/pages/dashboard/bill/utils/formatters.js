

/**
 * Format giá tiền VNĐ
 */
export function formatPrice(value) {
    if (!value) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }
  
  /**
   * Format ngày giờ VN
   */
  export function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "—";
    }
  }
  
  /**
   * Format giá rút gọn (1.5M, 200K, ...)
   */
  export function formatCompactPrice(price) {
    if (!price) return "0";
    if (price >= 1_000_000_000) return `${(price / 1_000_000_000).toFixed(1)}B`;
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
    return price.toString();
  }
  
  /**
   * Lấy datetime hiện tại theo timezone VN (định dạng cho input datetime-local)
   */
  export function getCurrentVNDateTime() {
    const now = new Date();
    const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    return vnTime.toISOString().slice(0, 16);
  }
  
  /**
   * Chuyển date string sang format cho input datetime-local
   */
  export function toInputDateTime(dateStr) {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toISOString().slice(0, 16);
    } catch {
      return "";
    }
  }
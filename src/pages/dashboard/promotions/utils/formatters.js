

export function formatPrice(value) {
    if (!value) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }
  
  export function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  }
  
  /**
   * Hiển thị discount dạng chuỗi: -20% hoặc -50.000 ₫
   */
  export function formatDiscount(promotion) {
    if (promotion?.discountPercentage) {
      return `-${promotion.discountPercentage}%`;
    }
    if (promotion?.discountAmount) {
      return `-${formatPrice(promotion.discountAmount)}`;
    }
    return "—";
  }
  
  /**
   * Kiểm tra promotion có đang chạy không (dựa vào date)
   */
  export function isPromotionRunning(promotion) {
    if (!promotion?.isActive) return false;
    const now = new Date();
    const start = promotion.startDate ? new Date(promotion.startDate) : null;
    const end = promotion.endDate ? new Date(promotion.endDate) : null;
    if (start && end) return now >= start && now <= end;
    return false;
  }
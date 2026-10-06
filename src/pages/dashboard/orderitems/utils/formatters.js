

export function formatPrice(value) {
    if (!value) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }
  
  export function formatCompactPrice(price) {
    if (!price) return "0";
    if (price >= 1_000_000_000) return `${(price / 1_000_000_000).toFixed(1)}B`;
    if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
    if (price >= 1_000) return `${(price / 1_000).toFixed(0)}K`;
    return price.toString();
  }
  
  /**
   * Convert bất kỳ giá trị nào về String an toàn (tránh crash toLowerCase)
   */
  export function toStringSafe(value) {
    if (value === null || value === undefined) return "";
    return String(value);
  }
  
  /**
   * Check xem term có nằm trong bất kỳ field nào không
   */
  export function matchesSearch(term, ...fields) {
    if (!term || !term.trim()) return true;
    const lowerTerm = term.toLowerCase().trim();
    return fields.some((field) =>
      toStringSafe(field).toLowerCase().includes(lowerTerm)
    );
  }
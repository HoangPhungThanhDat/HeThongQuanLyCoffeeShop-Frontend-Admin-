

export const formatPrice = (v) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(v || 0);

export const formatCompact = (v) => {
  if (v >= 1_000_000_000) return `${(v / 1_000_000_000).toFixed(1)}B`;
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
  return v.toString();
};

export const getPaymentMethodLabel = (method) => {
  switch (method) {
    case "CASH":
      return "💵 Tiền mặt";
    case "CARD":
    case "CREDIT_CARD":
      return "💳 Thẻ";
    case "MOBILE":
    case "E_WALLET":
      return "📱 Ví điện tử";
    case "BANK_TRANSFER":
      return "🏦 Chuyển khoản";
    default:
      return "—";
  }
};

/**
 * Helper: chuẩn hoá response từ BE về mảng
 */
export const toArray = (res) => {
  const data = res?.data?.content ?? res?.data ?? res;
  return Array.isArray(data) ? data : [];
};


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

/**
 * Tính khoảng ngày của "kỳ trước" dựa trên kỳ hiện tại
 */
export const getPreviousPeriodLabel = (fromDate, toDate) => {
  const days = new Date(toDate).getTime() - new Date(fromDate).getTime();
  const daysCount = Math.ceil(days / (1000 * 60 * 60 * 24)) + 1;

  const prevTo = new Date(fromDate);
  prevTo.setDate(prevTo.getDate() - 1);

  const prevFrom = new Date(prevTo);
  prevFrom.setDate(prevFrom.getDate() - daysCount + 1);

  return {
    from: prevFrom,
    to: prevTo,
  };
};
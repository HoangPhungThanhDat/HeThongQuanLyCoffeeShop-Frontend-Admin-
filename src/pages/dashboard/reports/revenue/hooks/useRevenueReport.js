
import { useState, useEffect, useCallback, useMemo } from "react";
import dayjs from "dayjs";
import reportApi from "@/api/reportApi";
import { PAYMENT_LABEL } from "../constants";

export const useRevenueReport = () => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);

  const [preset, setPreset] = useState("month");
  const [fromDate, setFromDate] = useState(
    dayjs().startOf("month").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(dayjs().format("YYYY-MM-DD"));

  // ==================== PRESET HANDLER ====================
  const handlePresetChange = (key) => {
    setPreset(key);
    const now = dayjs();

    switch (key) {
      case "today":
        setFromDate(now.format("YYYY-MM-DD"));
        setToDate(now.format("YYYY-MM-DD"));
        break;
      case "week":
        setFromDate(now.startOf("week").format("YYYY-MM-DD"));
        setToDate(now.format("YYYY-MM-DD"));
        break;
      case "month":
        setFromDate(now.startOf("month").format("YYYY-MM-DD"));
        setToDate(now.format("YYYY-MM-DD"));
        break;
      case "year":
        setFromDate(now.startOf("year").format("YYYY-MM-DD"));
        setToDate(now.format("YYYY-MM-DD"));
        break;
      case "custom":
        break;
    }
  };

  // ==================== FETCH ====================
  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const data = await reportApi.getRevenue(fromDate, toDate);
      setReport(data);
    } catch (error) {
      console.error("❌ Fetch report error:", error);
      throw error;
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  }, [fromDate, toDate]);

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate]);

  // ==================== DERIVED DATA ====================
  const stats = useMemo(() => {
    if (!report)
      return {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrder: 0,
        uniqueCustomers: 0,
        growth: 0,
        previousRevenue: 0,
      };
    return {
      totalRevenue: report.totalRevenue || 0,
      totalOrders: report.totalOrders || 0,
      avgOrder: report.avgOrderValue || 0,
      uniqueCustomers: report.uniqueCustomers || 0,
      growth: report.growthPercent || 0,
      previousRevenue: report.previousRevenue || 0,
    };
  }, [report]);

  const dailyRevenue = useMemo(() => {
    if (!report?.dailyRevenue) return [];
    return report.dailyRevenue.map((d) => ({
      date: dayjs(d.date).format("DD/MM"),
      fullDate: d.date,
      revenue: Number(d.revenue) || 0,
      orders: Number(d.orderCount) || 0,
    }));
  }, [report]);

  const paymentMethodData = useMemo(() => {
    if (!report?.paymentMethodStats) return [];
    return report.paymentMethodStats.map((s) => ({
      name: PAYMENT_LABEL[s.method] || s.method,
      value: Number(s.revenue) || 0,
      count: Number(s.count) || 0,
    }));
  }, [report]);

  const topProducts = useMemo(() => {
    if (!report?.topProducts) return [];
    return report.topProducts.map((p) => ({
      id: p.productId,
      name: p.name,
      imageUrl: p.imageUrl,
      quantity: Number(p.totalQuantity) || 0,
      revenue: Number(p.totalRevenue) || 0,
    }));
  }, [report]);

  return {
    loading,
    report,
    preset,
    fromDate,
    toDate,
    setFromDate,
    setToDate,
    handlePresetChange,
    fetchReport,
    // derived
    stats,
    dailyRevenue,
    paymentMethodData,
    topProducts,
  };
};

import { useState, useEffect, useCallback } from "react";
import logApi from "@/api/logApi";
import { normalizeLog } from "../utils";
import { PAGE_SIZE } from "../constants";

/**
 * Hook quản lý list logs + phân trang
 */
export const useLogs = (buildParams, dependencies = []) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = buildParams(page, PAGE_SIZE);
      const res = await logApi.getAll(params);

      // Handle cả 2 format: array hoặc Page
      const data = res?.data !== undefined ? res.data : res;
      if (Array.isArray(data)) {
        setLogs(data.map(normalizeLog));
        setTotalPages(1);
        setTotalElements(data.length);
      } else if (data?.content) {
        setLogs(data.content.map(normalizeLog));
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);
      }
    } catch (error) {
      console.error("❌ Fetch logs error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [buildParams, page]);

  // Fetch khi page hoặc filter thay đổi
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ...dependencies]);

  // Reset page khi filter đổi
  useEffect(() => {
    setPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return {
    logs,
    loading,
    page, setPage,
    totalPages,
    totalElements,
    pageSize: PAGE_SIZE,
    refetch: fetchLogs,
  };
};
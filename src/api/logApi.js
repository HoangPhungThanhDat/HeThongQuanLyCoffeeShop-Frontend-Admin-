// src/api/logApi.js
import axiosClient from "./axiosClient";

/**
 * ✅ Helper unwrap: lấy data từ Axios response
 * Vì axiosClient của bạn KHÔNG unwrap .data → phải tự lấy
 */
const unwrap = (response) => {
  if (response && typeof response === "object" && "data" in response) {
    return response.data;
  }
  return response;
};

const logApi = {
  // ==================== LẤY DANH SÁCH ====================
  getAll: async (params = {}) => {
    const res = await axiosClient.get("/logs", { params });
    return unwrap(res);
  },

  getById: async (id) => {
    const res = await axiosClient.get(`/logs/${id}`);
    return unwrap(res);
  },

  // ==================== THỐNG KÊ ====================
  getStats: async () => {
    const res = await axiosClient.get("/logs/stats");
    return unwrap(res);
  },

  // ==================== CHARTS ====================
  getDailyChart: async (days = 7) => {
    const res = await axiosClient.get(`/logs/charts/daily?days=${days}`);
    return unwrap(res);
  },

  getHourlyChart: async (hours = 24) => {
    const res = await axiosClient.get(`/logs/charts/hourly?hours=${hours}`);
    return unwrap(res);
  },

  getLevelDistribution: async () => {
    const res = await axiosClient.get("/logs/charts/level-distribution");
    return unwrap(res);
  },

  getActionDistribution: async () => {
    const res = await axiosClient.get("/logs/charts/action-distribution");
    return unwrap(res);
  },
};

export default logApi;
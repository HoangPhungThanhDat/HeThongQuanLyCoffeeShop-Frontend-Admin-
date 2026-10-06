// src/api/orderApi.js
import axiosClient from "./axiosClient";

const OrderAPI = {
  /**
   * Lấy danh sách đơn hàng có phân trang + filter
   */
  getAll: (params = {}) => {
    const {
      page = 0,
      size = 10,
      keyword,
      status,
      fromDate,
      toDate,
      tableId,
      sortBy = "id",
      sortDir = "desc",
    } = params;

    const query = { page, size, sortBy, sortDir };
    if (keyword && keyword.trim()) query.keyword = keyword.trim();
    if (status && status !== "ALL") query.status = status;
    if (fromDate) query.fromDate = fromDate;
    if (toDate) query.toDate = toDate;
    if (tableId != null && tableId !== "ALL") query.tableId = tableId;

    return axiosClient.get("/orders", { params: query });
  },

  // Thống kê toàn bộ đơn hàng
  getStats: () => axiosClient.get("/orders/stats"),

  // Chi tiết một order
  getById: (id) => axiosClient.get(`/orders/${id}`),

  // Lấy orders theo status
  getByStatus: (status) => axiosClient.get(`/orders/status/${status}`),

  // Tạo order mới
  create: (data) => axiosClient.post("/orders", data),

  // Cập nhật order
  update: (id, data) => axiosClient.put(`/orders/${id}`, data),

  // Xóa order
  delete: (id) => axiosClient.delete(`/orders/${id}`),

  // Thêm món vào đơn hàng
  addItems: (orderId, items) =>
    axiosClient.post(`/orders/${orderId}/add-items`, items),

  // Lấy tất cả orders cho dropdown (không phân trang)
  getAllForSelect: async () => {
    const res = await axiosClient.get("/orders", { params: { size: 1000 } });
    // axiosClient trả response nguyên → lấy .data.content
    // Nếu axiosClient đã unwrap → trả res.content
    const data = res?.data !== undefined ? res.data : res;
    return data?.content ?? [];
  },
};

export default OrderAPI;
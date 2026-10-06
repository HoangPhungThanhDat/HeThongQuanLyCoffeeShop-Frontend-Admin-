import axiosClient from "./axiosClient";

const BillAPI = {
  /**
   * Lấy danh sách hoá đơn có phân trang
   */
  getAll: (params = {}) => {
    const {
      page = 0,
      size = 10,
      keyword,
      paymentStatus,
      paymentMethod,
      fromDate,
      toDate,
      sortBy = "id",
      sortDir = "desc",
    } = params;

    const query = { page, size, sortBy, sortDir };
    if (keyword && keyword.trim()) query.keyword = keyword.trim();
    if (paymentStatus && paymentStatus !== "ALL") query.paymentStatus = paymentStatus;
    if (paymentMethod && paymentMethod !== "ALL") query.paymentMethod = paymentMethod;
    if (fromDate) query.fromDate = fromDate;
    if (toDate) query.toDate = toDate;

    return axiosClient.get("/bills", { params: query });
  },

  // Thống kê
  getStats: () => axiosClient.get("/bills/stats"),

  // Chi tiết một hóa đơn
  getById: (id) => axiosClient.get(`/bills/${id}`),

  // Lấy bill theo order
  getByOrderId: (orderId) => axiosClient.get(`/bills/order/${orderId}`),

  // Thêm hóa đơn mới
  create: (data) => axiosClient.post("/bills", data),

  // Cập nhật hóa đơn
  update: (id, data) => axiosClient.put(`/bills/${id}`, data),

  // Xóa hóa đơn
  delete: (id) => axiosClient.delete(`/bills/${id}`),

  // ✅ FIX: Lấy tất cả cho dropdown (không phân trang)
  getAllForSelect: async () => {
    const res = await axiosClient.get("/bills", { params: { size: 1000 } });

    // axiosClient trả về response nguyên (chưa unwrap) → phải .data.content
    // Nhưng để an toàn, check cả 2 trường hợp
    const data = res?.data !== undefined ? res.data : res;
    return data?.content ?? [];
  },
};

export default BillAPI;
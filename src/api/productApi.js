import axiosClient from "./axiosClient";

const productApi = {
  getAll: (params = {}) => {
    const {
      page = 0, size = 10, keyword, categoryId,
      sortBy = "id", sortDir = "desc",
    } = params;

    const query = { page, size, sortBy, sortDir };
    if (keyword && keyword.trim()) query.keyword = keyword.trim();
    if (categoryId != null && categoryId !== "ALL") query.categoryId = categoryId;

    return axiosClient.get("/products", { params: query });
  },

  getById: (id) => axiosClient.get(`/products/${id}`),
  getNewest: () => axiosClient.get("/products/newest"),
  getStats: () => axiosClient.get("/products/stats"),

  // ✅ Tạo product — dùng axiosClient, để interceptor tự gắn token
  create: (formData) => {
    return axiosClient.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ✅ Update product
  update: (id, formData) => {
    return axiosClient.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: (id) => axiosClient.delete(`/products/${id}`),

  // ✅ Upload ảnh
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/products/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default productApi;
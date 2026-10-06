// src/api/userApi.js
import axiosClient from "./axiosClient";

const userApi = {
  // ==================== QUERY ====================
  getAll: () => axiosClient.get("/users"),

  getById: (id) => axiosClient.get(`/users/${id}`),

  // ==================== CRUD ====================
  // ✅ Dùng axiosClient — interceptor tự gắn token
  create: (formData) => {
    return axiosClient.post("/users", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  update: (id, formData) => {
    return axiosClient.put(`/users/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  delete: (id) => axiosClient.delete(`/users/${id}`),

  // ==================== UPLOAD ẢNH ====================
  // ✅ Upload ảnh riêng — dùng axiosClient
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return axiosClient.post("/users/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default userApi;
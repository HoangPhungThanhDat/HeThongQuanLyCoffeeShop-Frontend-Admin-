import axiosClient, {
  setAccessToken,
  clearAccessToken,
  refreshToken,   // ✅ Import hàm chung
} from "./axiosClient";

const PORTAL = "admin";   // ✅ ADMIN

const AuthAPI = {
  // ✅ Login
  login: async (data) => {
    const payload = { ...data, portal: PORTAL };
    const response = await axiosClient.post("/auth/login", payload);
    if (response.data?.accessToken) {
      setAccessToken(response.data.accessToken);
    }
    return response;
  },

  // ✅ Refresh — DÙNG CHUNG refreshToken() từ axiosClient
  refresh: async () => {
    const newToken = await refreshToken();
    return { data: { accessToken: newToken } };
  },

  // ✅ Logout
  logout: async () => {
    try {
      await axiosClient.post(
        "/auth/logout",
        {},
        { headers: { "X-Portal": PORTAL } }
      );
    } finally {
      clearAccessToken();
    }
  },
};

export default AuthAPI;
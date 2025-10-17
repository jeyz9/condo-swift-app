import axios from "axios";
import TokenService from "./TokenService";

const baseURL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // ✅ ให้ cookie (ถ้ามี) ส่งไปกับทุก request
});

// ✅ Request Interceptor (แนบ Token)
api.interceptors.request.use(
  (config) => {
    const token = TokenService.getLocalAccessToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // ✅ ใช้รูปแบบมาตรฐาน
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor (เช็ก 401 แล้ว refresh token)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalConfig = error.config;

    // ถ้า token หมดอายุ (401) และยังไม่ได้พยายาม refresh
    if (error.response?.status === 401 && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const refreshToken = TokenService.getUser()?.refreshToken;
        if (refreshToken) {
          const res = await axios.post(`${baseURL}/auth/refresh-token`, {
            refreshToken,
          });

          const newToken = res.data?.accessToken;
          TokenService.setUser({
            ...TokenService.getUser(),
            token: newToken,
          });

          // ✅ ตั้งค่า header ใหม่แล้วลองยิง request เดิมอีกครั้ง
          api.defaults.headers.Authorization = `Bearer ${newToken}`;
          return api(originalConfig);
        }
      } catch (refreshError) {
        console.error("Refresh token expired or invalid:", refreshError);
        TokenService.removeUser();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;

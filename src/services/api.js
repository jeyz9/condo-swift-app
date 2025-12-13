import axios from "axios";
import TokenService from "./TokenService"; // Using TokenService is more robust

const DEFAULT_BASE_URL = "https://condo-swift.onrender.com";
const baseURL = import.meta.env.VITE_BASE_URL || DEFAULT_BASE_URL;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ✅ Request Interceptor (แนบ token เฉพาะ API ที่จำเป็น)
api.interceptors.request.use(
  (config) => {
    // ❌ ห้ามแนบ token กับ login หรือ register
    const excluded = ["/auth/login", "/auth/register", "/auth/verify-email"];
    const isExcluded = excluded.some((url) => config.url?.includes(url));

    if (!isExcluded) {
      const token = TokenService.getLocalAccessToken(); // ✅ Use TokenService
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("✅ Attached token for:", config.url);
      }
    } else {
      console.log("🚫 Skip token for:", config.url);
      delete config.headers.Authorization; // ✅ ตัด header ทิ้งกันพลาด
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;


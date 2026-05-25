import axios from "axios";
import TokenService from "./TokenService";
import Swal from "sweetalert2";
import AuthService from "./AuthService";

const DEFAULT_BASE_URL = "https://condo-swift.onrender.com";
const baseURL = import.meta.env.VITE_BASE_URL || DEFAULT_BASE_URL;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const excluded = ["/auth/login", "/auth/register", "/auth/verify-email", "/api/v1/selector/showAllAnnounceTypes"];
    const isExcluded = excluded.some((url) => config.url?.includes(url));

    if (!isExcluded) {
      const token = TokenService.getLocalAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

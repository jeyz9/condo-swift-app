import api from "./api";
import TokenService from "./TokenService";

const DEFAULT_BASE_URL = "https://condo-swift.onrender.com";
const baseUrl =
  (import.meta.env.VITE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");

const resolveEndpoint = (rawValue, fallbackPath) => {
  if (rawValue) {
    const trimmed = rawValue.replace(/\/$/, "");
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    if (trimmed.startsWith("/")) {
      return `${baseUrl}${trimmed}`;
    }
  }
  return `${baseUrl}${fallbackPath}`;
};

const AUTH_BASE = resolveEndpoint(import.meta.env.VITE_AUTH_API, "/api/v1/auth");

const buildUrl = (path) => `${AUTH_BASE}${path}`;

const register = async (usernameOrPayload, name, email, password) => {
  const payload =
    typeof usernameOrPayload === "object" && usernameOrPayload !== null
      ? usernameOrPayload
      : { username: usernameOrPayload, name, email, password };
  return await api.post(buildUrl("/register"), payload);
};

const login = async (email, password) => {
  console.log("🧾 Payload before login:", { email, password });
  console.log("🧾 Payload before login:", { email, password });
  const response = await api.post(
    buildUrl("/login"),
    { email, password },
    { withCredentials: false }
  );
  console.log("🟢 Login response:", response.data);

  // ✅ ตรวจว่า backend ส่ง accessToken กลับมาจริงไหม
  const { accessToken, tokenType, userId } = response.data;

  if (!accessToken) {
    throw new Error("ไม่พบ accessToken จาก backend");
  }

  // ✅ เก็บ token ใน cookie ผ่าน TokenService
  TokenService.setUser({
    accessToken,
    tokenType,
    userId,
  });

  return response;
};

const logout = () => {
  TokenService.removeUser();
};

const AuthService = { register, login, logout };
export default AuthService;

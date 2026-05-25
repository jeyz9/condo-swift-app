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
  const response = await api.post(
    buildUrl("/login"),
    { email, password },
    { withCredentials: false }
  );

  const { accessToken, tokenType, userId } = response.data;
  if (!accessToken) throw new Error("ไม่พบ accessToken จาก backend");

  TokenService.setUser({ accessToken, tokenType, userId });
  return response;
};

const logout = () => TokenService.removeUser();

const sendVerify = async (userId) => {
  return await api.post(`${AUTH_BASE}/send-verify?userId=${userId}`);
};

const sendOtp = async (userId) => {
  return await api.post(`${AUTH_BASE}/send-otp?userId=${userId}`);
};

const verifyOtp = async (otpCode) => {
  const token = localStorage.getItem("otpToken");
  const refno = localStorage.getItem("otpRefno");

  if (!token) throw new Error("ไม่พบ token กรุณาส่ง OTP ใหม่");

  return await api.post(`${AUTH_BASE}/verify-otp?token=${token}&otpCode=${otpCode}`)
  ;
};

const changePassword = async (payloadOrOldPassword, newPassword, confirmPassword) => {
  const payload =
    typeof payloadOrOldPassword === "object" && payloadOrOldPassword !== null
      ? payloadOrOldPassword
      : {
          oldPassword: payloadOrOldPassword,
          newPassword,
          confirmPassword,
        };

  return await api.post(buildUrl("/changePassword"), payload);
};

const verifyEmail = async (token) => {
  return await api.get(buildUrl(`/verify-email?token=${token}`));
};
const AuthService = {
  register,
  login,
  logout,
  sendVerify,
  sendOtp,
  verifyOtp,
  changePassword,
  sendEmailResetPassword: async (email) => {
    return await api.post(buildUrl(`/sendEmailResetPassword?email=${email}`));
  },
  resetPassword: async (token, newPassword, confirmPassword) => {
    return await api.post(buildUrl(`/resetPassword?token=${token}`), { newPassword, confirmPassword });
  },
  verifyEmail
};

export default AuthService;

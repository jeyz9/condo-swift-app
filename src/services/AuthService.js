import api from "./api";
import TokenService from "./TokenService";

// ✅ Base URL จาก .env (เช่น https://condo-swift.onrender.com)
const DEFAULT_BASE_URL = "https://condo-swift.onrender.com";
const baseUrl =
  (import.meta.env.VITE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");

// ✅ ฟังก์ชันรวม URL base กับ path ย่อย
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

// ✅ AUTH_BASE = https://condo-swift.onrender.com/api/v1/auth
const AUTH_BASE = resolveEndpoint(import.meta.env.VITE_AUTH_API, "/api/v1/auth");
const buildUrl = (path) => `${AUTH_BASE}${path}`;

/* -------------------------------
 🧾 Register / Login / Logout
--------------------------------*/
const register = async (usernameOrPayload, name, email, password) => {
  const payload =
    typeof usernameOrPayload === "object" && usernameOrPayload !== null
      ? usernameOrPayload
      : { username: usernameOrPayload, name, email, password };
  return await api.post(buildUrl("/register"), payload);
};

const login = async (email, password) => {
  console.log("🧾 Login Payload:", { email, password });
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

/* -------------------------------
 ✉️ Email Verify & OTP
--------------------------------*/

// ✅ ส่งอีเมลยืนยัน
const sendVerify = async (userId) => {
  console.log("📤 Sending Email Verify:", userId);
  return await api.post(`${AUTH_BASE}/send-verify?userId=${userId}`);
};

// ✅ ส่ง OTP ไปยังเบอร์โทร
const sendOtp = async (userId) => {
  console.log("📤 Sending OTP for user:", userId);
  return await api.post(`${AUTH_BASE}/send-otp?userId=${userId}`);
};

// ✅ ตรวจสอบรหัส OTP (อ่าน token/refno จาก localStorage ตอนเรียกจริง)
const verifyOtp = async (otpCode) => {
  const token = localStorage.getItem("otpToken");
  const refno = localStorage.getItem("otpRefno");

  console.log("🔐 Verifying OTP:", { otpCode, token, refno });

  if (!token) throw new Error("ไม่พบ token กรุณาส่ง OTP ใหม่");

  // 🚫 อย่าแนบ Authorization Header — ใช้ OTP token แทน
  return await api.post(`${AUTH_BASE}/verify-otp?token=${token}&otpCode=${otpCode}`)
  ;
};

/* -------------------------------
 ✅ Export รวมทั้งหมด
--------------------------------*/
const AuthService = {
  register,
  login,
  logout,
  sendVerify,
  sendOtp,
  verifyOtp,
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    return await api.post(buildUrl("/changePassword"), { oldPassword, newPassword, confirmPassword });
  },
  sendEmailResetPassword: async (email) => {
    return await api.post(buildUrl(`/sendEmailResetPassword?email=${email}`));
  },
  resetPassword: async (token, newPassword, confirmPassword) => {
    return await api.post(buildUrl(`/resetPassword?token=${token}`), { newPassword, confirmPassword });
  }
};

export default AuthService;

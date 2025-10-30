import api from "./api";
import Swal from "sweetalert2";

/* 🌐 Base URL และ endpoint resolver */
const DEFAULT_BASE_URL = "https://condo-swift.onrender.com";
const baseUrl =
  (import.meta.env.VITE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");

const resolveEndpoint = (rawValue, fallbackPath) => {
  if (rawValue) {
    const trimmed = rawValue.replace(/\/$/, "");
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith("/")) return `${baseUrl}${trimmed}`;
  }
  return `${baseUrl}${fallbackPath}`;
};

const API_URL = resolveEndpoint(import.meta.env.VITE_AUTH_API, "/api/v1/auth");

/* -------------------------------------------------------------------
   🧩 VerifyService — ส่ง userId ไป /send-verify โดยไม่ต้องกรอกอะไร
------------------------------------------------------------------- */
const VerifyService = {
  async startVerify({ userId }) {
    if (!userId) {
      Swal.fire("⚠️ ไม่พบ userId", "กรุณาเข้าสู่ระบบก่อนทำการยืนยัน", "warning");
      return;
    }

    try {
      await Swal.fire({
        title: "กำลังส่งคำขอ...",
        text: "กรุณารอสักครู่",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await api.post(`${API_URL}/send-verify`, { userId });

      Swal.close();

      Swal.fire({
        icon: "success",
        title: "✅ ส่งคำขอสําเร็จ!",
        text: res.data?.message || "ระบบได้ส่งคำขอยืนยันตัวตนเรียบร้อยแล้ว",
      });

      return res.data;
    } catch (err) {
      Swal.close();
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "❌ เกิดข้อผิดพลาด",
        text: err.response?.data?.message || "ไม่สามารถส่งคำขอได้",
      });
      return null;
    }
  },
};

export default VerifyService;

import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPopup({ isOpen, onClose, onOpenRegister }) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { login, user } = useAuthContext();
  const location = useLocation();

  // 🔁 ถ้ามี user แล้วให้ redirect
  useEffect(() => {
    if (user) navigate(location.pathname, { replace: true });
  }, [user, navigate, location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบ",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    try {
      console.log("🧾 Payload before login:", { email, password });

      // ✅ ใช้ login จาก AuthContext โดยตรง
      const decodedUser = await login(email, password);

      console.log("✅ Login success response:", decodedUser);

      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ!",
        text: "ยินดีต้อนรับกลับ!",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#8C6239",
      }).then(() => {
        onClose?.();
        navigate("/");
      });
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเข้าสู่ระบบได้",
        text: error?.response?.data || error.message,
        confirmButtonColor: "#8C6239",
      });
    }
  };

  // 🌀 Animation variants
  const backdropVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const popupVariant = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.85, y: -20, transition: { duration: 0.25 } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* พื้นหลังมืด */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          {/* Popup container */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            variants={popupVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div
              className="bg-white rounded-2xl md:overflow-hidden overflow-y-auto shadow-2xl relative flex flex-col md:flex-row 
              w-[92vw] max-w-[900px] md:w-[900px]
              h-auto max-h-[90vh] md:h-[600px] md:max-h-[600px]"
            >
              {/* ปุ่มปิด */}
              <button
                onClick={onClose}
                className="btn btn-ghost border-none absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
              >
                ✕
              </button>

              {/* ฝั่งซ้าย */}
              <div className="bg-[#8C6239] text-white p-8 md:p-10 w-full md:w-1/2 flex flex-col justify-center">
                <h3 className="text-base md:text-lg font-semibold mb-3">
                  เพียงสมัครสมาชิก และยืนยันตัวตน
                </h3>
                <h1 className="text-xl md:text-4xl font-bold leading-snug mb-6 break-words">
                  ก็เริ่มต้นลงประกาศได้เลย
                  <br />
                  ใช้งานง่าย ไม่มีค่าบริการ
                </h1>
                <ul className="space-y-3 text-sm md:text-base break-words">
                  <li>✔ โพสต์ฟรี เช่าและขาย 5 ประกาศ</li>
                  <li>✔ เลื่อนประกาศฟรี 40 ครั้ง/เดือน</li>
                  <li>✔ ประกาศอยู่ได้นาน 6 เดือน</li>
                  <li>✔ แก้ไขและต่ออายุประกาศฟรี</li>
                </ul>
              </div>

              {/* ฝั่งขวา */}
              <div className="p-8 md:p-10 w-full md:w-1/2 flex flex-col justify-center overflow-y-auto">
                <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 break-words">
                  เข้าสู่ระบบ
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      อีเมล
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none"
                      placeholder="อีเมล"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      รหัสผ่าน
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none"
                      placeholder="รหัสผ่าน"
                    />
                    <div className="text-right mt-1 text-sm text-[#8C6239] hover:underline cursor-pointer">
                      ลืมรหัสผ่าน?
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn cursor-pointer bg-[#8C6239] hover:bg-[#6f4f2e] text-white font-semibold py-2 rounded-lg transition"
                  >
                    เข้าสู่ระบบ
                  </button>
                </form>

                <p
                  className="text-center text-sm text-gray-600 mt-5 break-words"
                  onClick={() => {
                    onClose?.();
                    onOpenRegister?.();
                  }}
                >
                  ยังไม่มีบัญชี?
                  <span className="text-[#8C6239] font-semibold cursor-pointer hover:underline ml-1">
                    สมัครสมาชิก
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

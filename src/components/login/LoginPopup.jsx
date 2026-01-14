import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useAuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { extractErrorMessage } from "../../utils/errorUtils";
import AuthService from "../../services/AuthService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPopup({ isOpen, onClose, onOpenRegister }) {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const navigate = useNavigate();
  const { login, user } = useAuthContext();
  const location = useLocation();

  const LOCKOUT_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds
  const MAX_ATTEMPTS = 5;

  // Load state from localStorage on mount
  useEffect(() => {
    const storedAttempts = localStorage.getItem(`failedAttempts_${loginData.email}`);
    const storedLockout = localStorage.getItem(`lockoutEndTime_${loginData.email}`);

    if (storedAttempts) {
      setFailedAttempts(parseInt(storedAttempts, 10));
    }
    if (storedLockout) {
      const endTime = parseInt(storedLockout, 10);
      if (endTime > Date.now()) {
        setLockoutEndTime(endTime);
        setIsLockedOut(true);
      } else {
        // Lockout expired, clear storage
        localStorage.removeItem(`failedAttempts_${loginData.email}`);
        localStorage.removeItem(`lockoutEndTime_${loginData.email}`);
        setFailedAttempts(0);
        setLockoutEndTime(null);
        setIsLockedOut(false);
      }
    }
  }, [loginData.email]);

  // Update isLockedOut state and set a timer to clear lockout
  useEffect(() => {
    let timer;
    if (lockoutEndTime && lockoutEndTime > Date.now()) {
      setIsLockedOut(true);
      timer = setTimeout(() => {
        localStorage.removeItem(`failedAttempts_${loginData.email}`);
        localStorage.removeItem(`lockoutEndTime_${loginData.email}`);
        setFailedAttempts(0);
        setLockoutEndTime(null);
        setIsLockedOut(false);
      }, lockoutEndTime - Date.now());
    } else {
      setIsLockedOut(false);
    }
    return () => clearTimeout(timer);
  }, [lockoutEndTime, loginData.email]);

  // 🔁 ถ้ามี user แล้วให้ redirect
  useEffect(() => {
    if (user) navigate(location.pathname, { replace: true });
  }, [user, navigate, location.pathname]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleForgotPassword = async () => {
    const { value: email } = await Swal.fire({
      title: 'ลืมรหัสผ่าน',
      input: 'email',
      inputLabel: 'กรุณากรอกอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน',
      inputPlaceholder: 'กรอก email ที่นี่',
      showCancelButton: true,
      confirmButtonText: 'ส่งอีเมลรีเซ็ตรหัสผ่าน', 
      confirmButtonColor: '#8C6239',
      cancelButtonText: 'ยกเลิก',
    });

    if (email) {
      try {
        const response = await AuthService.sendEmailResetPassword(email);
        if (response.status === 200) {
          Swal.fire({
            icon: 'success',
            title: 'ส่งอีเมลสำเร็จ',
            text: 'กรุณาตรวจสอบอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: extractErrorMessage(error, 'ไม่สามารถส่งอีเมลรีเซ็ตรหัสผ่านได้'),
        });
      }
    }
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

    if (isLockedOut) {
      const remainingTime = Math.ceil((lockoutEndTime - Date.now()) / 1000);
      Swal.fire({
        icon: "error",
        title: "ถูกล็อคชั่วคราว",
        text: `คุณได้พยายามเข้าสู่ระบบผิดพลาดหลายครั้ง กรุณารอ ${remainingTime} วินาที`,
        confirmButtonColor: "#8C6239",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("🧾 Payload before login:", { email, password });

      const decodedUser = await login(email, password);

      console.log(" Login success response:", decodedUser);

      // Reset failed attempts on successful login
      localStorage.removeItem(`failedAttempts_${email}`);
      localStorage.removeItem(`lockoutEndTime_${email}`);
      setFailedAttempts(0);
      setLockoutEndTime(null);
      setIsLockedOut(false);

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

      // Increment failed attempts on login failure
      const newFailedAttempts = failedAttempts + 1;
      setFailedAttempts(newFailedAttempts);
      localStorage.setItem(`failedAttempts_${email}`, newFailedAttempts.toString());

      if (newFailedAttempts >= MAX_ATTEMPTS) {
        const newLockoutEndTime = Date.now() + LOCKOUT_DURATION;
        setLockoutEndTime(newLockoutEndTime);
        localStorage.setItem(`lockoutEndTime_${email}`, newLockoutEndTime.toString());
        setIsLockedOut(true);

        Swal.fire({
          icon: "error",
          title: "ถูกล็อคชั่วคราว",
          text: `คุณได้พยายามเข้าสู่ระบบผิดพลาด ${MAX_ATTEMPTS} ครั้ง บัญชีของคุณจะถูกล็อคเป็นเวลา 3 นาที คุณต้องการรีเซ็ตรหัสผ่านหรือไม่?`,
          showCancelButton: true,
          confirmButtonText: "รีเซ็ตรหัสผ่าน",
          cancelButtonText: "ยกเลิก",
          confirmButtonColor: "#8C6239",
        }).then((result) => {
          if (result.isConfirmed) {
            handleForgotPassword();
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถเข้าสู่ระบบได้",
          text: extractErrorMessage(error, "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"),
          confirmButtonColor: "#8C6239",
        });
      }
    } finally {
      setIsLoading(false);
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
              className="bg-white rounded-2xl shadow-2xl relative flex flex-col md:flex-row w-[92vw] max-w-[1000px] md:w-[1000px] h-[90vh] md:h-[650px] md:overflow-hidden"
            >
              {/* ปุ่มปิด */}
              <button
                onClick={onClose}
                className="btn btn-ghost border-none absolute top-4 right-4 text-gray-500 hover:text-black text-2xl z-10"
              >
                ✕
              </button>

              {/* ฝั่งซ้าย */}
              <div className="bg-[#8C6239] text-white p-6 sm:p-8 md:p-10 w-full md:w-1/2 flex flex-col justify-center flex-shrink-0 rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl">
                <h3 className="text-xl sm:text-2xl font-semibold mb-3">
                  เพียงสมัครสมาชิก และยืนยันตัวตน
                </h3>
                <h1 className="text-lg sm:text-2xl md:text-4xl font-bold leading-snug mb-6 break-words">
                  ก็เริ่มต้นลงประกาศได้เลย
                  <br />
                  ใช้งานง่าย ไม่มีค่าบริการ
                </h1>
                <ul className="space-y-3 text-sm sm:text-base break-words">
                  <li>✔ โพสต์ฟรี เช่าและขาย 5 ประกาศ</li>
                  <li>✔ เลื่อนประกาศฟรี 40 ครั้ง/เดือน</li>
                  <li>✔ ประกาศอยู่ได้นาน 6 เดือน</li>
                  <li>✔ แก้ไขและต่ออายุประกาศฟรี</li>
                </ul>
              </div>

              {/* ฝั่งขวา */}
              <div className="p-6 sm:p-8 md:p-10 w-full md:w-1/2 flex flex-col overflow-y-auto min-h-0 rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl justify-center">
                <h2 className="text-3xl justify-center text-center xl:text-start sm:text-xl md:text-4xl  font-medium mb-6 text-gray-800 break-words">
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
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={loginData.password}
                        onChange={handleChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none pr-10" // Added pr-10 for icon spacing
                        placeholder="รหัสผ่าน"
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="h-5 w-5 text-gray-500" />
                        ) : (
                          <FaEye className="h-5 w-5 text-gray-500" />
                        )}
                      </span>
                    </div>
                    <div onClick={handleForgotPassword} className="text-right mt-1 text-sm text-[#8C6239] hover:underline cursor-pointer">
                      ลืมรหัสผ่าน?
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full btn cursor-pointer bg-[#8C6239] hover:bg-[#6f4f2e] text-white font-semibold py-2 rounded-lg transition"
                    disabled={isLoading}
                  >
                    {isLoading && <span className="loading loading-spinner"></span>}
                    {isLoading ? "กำลังโหลด..." : "เข้าสู่ระบบ"}
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

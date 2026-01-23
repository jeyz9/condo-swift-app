import React, { useState } from "react";
import Swal from "sweetalert2";
import AuthService from "../../services/AuthService";
import { extractErrorMessage } from "../../utils/errorUtils";
import { motion, AnimatePresence } from "framer-motion";
import { form } from "framer-motion/client";

const initialFormState = {
  name: "",
  description: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
  is_agent: false,
  is_agree: false,
};

export default function RegisterPopup({ isOpen, onClose, onOpenLogin }) {
  const [formData, setFormData] = useState(initialFormState);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //  Animation settings
  const backdropVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const popupVariant = {
    hidden: { opacity: 0, scale: 0.85, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.9, y: -20, transition: { duration: 0.25 } },
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบ",
        confirmButtonColor: "#8C6239",
      });
      return;
    }

    if(formData.password.length < 8) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านต้องมีความยาวมากกว่า 8 ตัวอักษร",
        confirmButtonColor: "#8C6239",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านไม่ตรงกัน",
        confirmButtonColor: "#8C6239",
      });
      return;
    }

    if (!formData.is_agree) {
      Swal.fire({
        icon: "info",
        title: "กรุณายอมรับข้อตกลงการใช้งานและความเป็นส่วนตัว",
        confirmButtonColor: "#8C6239",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await AuthService.register(formData);
      if (res.status === 201) {
        Swal.fire({
          icon: "success",
          title: "สมัครสมาชิกสำเร็จ!",
          text: "คุณสามารถเข้าสู่ระบบได้แล้ว",
          confirmButtonColor: "#8C6239",
        }).then(() => {
          setFormData(initialFormState); // Reset form on success
          onClose();
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถสมัครสมาชิกได้",
        text: extractErrorMessage(error, "เกิดข้อผิดพลาดที่ไม่คาดคิด"),
        confirmButtonColor: "#8C6239",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 🟤 Background fade */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
            variants={backdropVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          {/* 🟤 Popup */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4"
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

              {/* ด้านซ้าย */}
              <div className="bg-[#8C6239] text-white p-6 sm:p-8 md:p-10 w-full md:w-1/2 flex flex-col justify-center whitespace-normal break-words flex-shrink-0 rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl">
                <h3 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-10">
                  เพียงสมัครสมาชิก และยืนยันตัวตน
                </h3>
                <h1 className="text-lg sm:text-2xl md:text-4xl font-bold leading-snug mb-6 break-words">
                  ก็เริ่มต้นลงประกาศได้เลย
                  <br />
                  ใช้งานง่าย ไม่มีค่าบริการ
                </h1>
                <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base break-words">
                  <li>✔ โพสต์ฟรี เช่าและขาย 5 ประกาศ</li>
                  <li>✔ เลื่อนประกาศฟรี 40 ครั้ง/เดือน</li>
                  <li>✔ ประกาศอยู่ได้นาน 6 เดือน</li>
                  <li>✔ แก้ไขและต่ออายุประกาศฟรี</li>
                </ul>
              </div>

              {/* ด้านขวา */}
              <div className="p-6 sm:p-8 md:p-10 w-full md:w-1/2 flex flex-col max-w-full whitespace-normal break-words overflow-y-auto min-h-0 rounded-b-2xl md:rounded-bl-none md:rounded-r-2xl">
                <h2 className="text-3xl justify-center text-center xl:text-start sm:text-xl md:text-4xl  font-medium mb-6 text-gray-800 break-words">
                  สมัครสมาชิก
                </h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* ชื่อ */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      ชื่อและนามสกุล
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none"
                      placeholder="ชื่อและนามสกุล"
                    />
                  </div>

                  {/* เบอร์โทร */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      เบอร์โทรศัพท์
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none"
                      placeholder="เบอร์โทรศัพท์"
                    />
                  </div>

                  {/* อีเมล */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      อีเมล
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none"
                      placeholder="อีเมล"
                    />
                  </div>

                  {/* รายละเอียด */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      รายละเอียดเพิ่มเติม
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="2"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none"
                      placeholder="รายละเอียดเกี่ยวกับคุณ (ถ้ามี)"
                    />
                  </div>

                  {/* รหัสผ่าน */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        รหัสผ่าน
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none"
                          placeholder="รหัสผ่าน"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                        >
                          {showPassword ? "ซ่อน" : "แสดง"}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        ยืนยันรหัสผ่าน
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none"
                          placeholder="ยืนยันรหัสผ่าน"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                        >
                          {showConfirmPassword ? "ซ่อน" : "แสดง"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* dropdown */}
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      ประเภทผู้ใช้งาน
                    </label>
                    <select
                      name="is_agent"
                      value={formData.is_agent ? "agent" : "buyer"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          is_agent: e.target.value === "agent",
                        }))
                      }
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none"
                    >
                      <option value="buyer">ผู้ซื้อ / ผู้เช่า</option>
                      <option value="agent">นายหน้า (Agent)</option>
                    </select>
                  </div>

                  {/* checkbox */}
                  <label className="flex items-start gap-2 mt-2">
                    <input
                      type="checkbox"
                      name="is_agree"
                      checked={formData.is_agree}
                      onChange={handleChange}
                      className="mt-1 accent-[#8C6239]"
                    />
                    <span className="text-sm text-gray-700 break-words">
                      ยอมรับเงื่อนไข{" "}
                      <a href="/terms-of-service" className="text-[#8C6239] hover:underline">
                        ข้อตกลงการใช้งาน
                      </a>{" "}
                      และ{" "}
                      <a href="/privacy-policy" className="text-[#8C6239] hover:underline">
                        ความเป็นส่วนตัว
                      </a>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full bg-[#8C6239] hover:bg-[#6f4f2e] text-white font-semibold py-2 rounded-lg transition mt-3 btn"
                    disabled={isLoading}
                  >
                    {isLoading && <span className="loading loading-spinner"></span>}
                    {isLoading ? "กำลังสมัคร..." : "สมัครสมาชิก"}
                  </button>
                </form>

                <p className="text-center text-xs sm:text-sm text-gray-600 mt-5 break-words">
                  มีบัญชีอยู่แล้ว?
                  <span
                     onClick={() => {
                    onClose?.();
                    onOpenLogin?.();
                  }}
                    className="text-[#8C6239] font-semibold cursor-pointer hover:underline ml-1"
                  >
                    เข้าสู่ระบบ
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

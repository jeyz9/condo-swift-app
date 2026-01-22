import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import UserService from "../services/UserService";
import AuthService from "../services/AuthService";
import EditProfilePopup from "./profile/EditProfilePopup";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserProfile = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [showEditProfilePopup, setShowEditProfilePopup] = useState(false);

  // state สำหรับ show / hide password แต่ละช่อง
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  /* ---------- ฟังก์ชันช่วยจัด Role ---------- */
  const displayName = profile?.name?.trim() || "ยังไม่เข้าสู่ระบบ";

  const normalizeRoles = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      return raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  const roles =
    normalizeRoles(user?.roles).length > 0
      ? normalizeRoles(user?.roles)
      : normalizeRoles(user?.user?.roles);

  const normalizedRoles = roles
    .map((r) => (r && r.toString ? r.toString() : ""))
    .map((r) => r.replace(/^ROLE_/i, "").toUpperCase())
    .filter(Boolean);

  const isAdmin =
    normalizedRoles.includes("ADMIN") ||
    normalizedRoles.includes("SUPER_ADMIN");

  /* ---------- โหลดข้อมูลโปรไฟล์ ---------- */
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;
      try {
        setLoading(true);
        const res = await UserService.profilePublic(user.userId);
        setProfile(res?.status === 200 ? res.data : {});
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
          text:
            err?.response?.message ||
            err?.response?.data?.message ||
            "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
          confirmButtonText: "ตกลง",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.userId]);

  /* ---------- ออกจากระบบ ---------- */
  const handleLogout = () => {
    logout();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "ออกจากระบบสำเร็จ",
      text: "คุณได้ออกจากระบบแล้ว",
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleProfileUpdate = (updatedProfile) => {
    setProfile((prevProfile) => ({ ...prevProfile, ...updatedProfile }));
  };

  /* ---------- เปลี่ยนรหัสผ่าน ---------- */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const oldPassword = form.oldPassword.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      Swal.fire({ icon: "warning", title: "รหัสใหม่ไม่ตรงกัน" });
      return;
    }
    if (newPassword.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "รหัสใหม่ต้องยาวอย่างน้อย 8 ตัวอักษร",
      });
      return;
    }

    try {
      const res = await AuthService.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });
      if (res.status === 200) {
        setShowChangePasswordPopup(false);
        form.reset();
        setShowPassword({ old: false, new: false, confirm: false });

        await Swal.fire({
          icon: "success",
          title: "เปลี่ยนรหัสผ่านสำเร็จ!",
          text: "กรุณาเข้าสู่ระบบใหม่",
          timer: 1500,
          showConfirmButton: false,
        });
        
        logout();
        navigate("/");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เปลี่ยนรหัสไม่สำเร็จ",
        text:
          err?.response?.data?.message ||
          err?.response?.message ||
          err?.message ||
          "เกิดข้อผิดพลาด",
      });
    }
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

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
    <>
      {/* Avatar + dropdown */}
      <div className="flex gap-2">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar hover:bg-gray-100 transition"
          >
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
            ) : (
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
                <img
                  alt="Profile"
                  className="w-full h-full object-cover"
                  src={
                    profile?.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      displayName
                    )}&background=0D8ABC&color=fff`
                  }
                />
              </div>
            )}
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-white rounded-xl z-[60] mt-5 w-56 p-3 shadow-lg border border-gray-100"
          >
            <li className="mb-2">
              <div className="flex items-center gap-3 px-1 py-1.5">
                <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200">
                  <img
                    alt="Profile mini"
                    className="w-full h-full object-cover"
                    src={
                      profile?.image ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        displayName
                      )}&background=0D8ABC&color=fff`
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {displayName}
                  </span>
                  {profile?.email && (
                    <span className="text-xs text-gray-500 truncate max-w-[9rem]">
                      {profile.email}
                    </span>
                  )}
                </div>
              </div>
            </li>

            <li>
              <Link to="/profile" className="justify-between text-sm text-gray-700">
                โปรไฟล์
              </Link>
            </li>
            <li>
              <Link to="/bookmarks" className="text-sm text-gray-700">
                บุ๊คมาร์ก
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin/dashboard" className="text-sm text-gray-700">
                  แผงผู้ดูแลระบบ
                </Link>
              </li>
            )}
            <li className="mt-1">
              <button
                onClick={() => setShowEditProfilePopup(true)}
                className="text-sm text-gray-700 cursor-pointer"
              >
                แก้ไขโปรไฟล์
              </button>
            </li>
            <li className="mt-1">
               <Link to="/draft">
              <button
                
                className=" text-sm text-gray-700  cursor-pointer"
              >
              ประกาศของฉัน
              </button>
              </Link>
            </li>
            <li className="mt-1">
              <button
                onClick={() => setShowChangePasswordPopup(true)}
                className="text-sm text-gray-700"
              >
                เปลี่ยนรหัสผ่าน
              </button>
            </li>
            <li className="mt-1">
              <button
                onClick={handleLogout}
                className="text-sm text-red-500 font-medium"
              >
                ออกจากระบบ
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* ---------- Popup เปลี่ยนรหัสผ่าน ---------- */}
      <AnimatePresence>
        {showChangePasswordPopup && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowChangePasswordPopup(false)}
              variants={backdropVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              variants={popupVariant}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto relative">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
                    เปลี่ยนรหัสผ่าน
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordPopup(false)}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleChangePassword} className="space-y-4">
                  {/* Old password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      รหัสผ่านเดิม
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.old ? "text" : "password"}
                        name="oldPassword"
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8C6239] focus:border-[#8C6239] pr-10"
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => togglePassword("old")}
                      >
                        {showPassword.old ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
                      </span>
                    </div>
                  </div>

                  {/* New password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      รหัสผ่านใหม่
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        required
                        minLength={8}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8C6239] focus:border-[#8C6239] pr-10"
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => togglePassword("new")}
                      >
                        {showPassword.new ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      อย่างน้อย 8 ตัวอักษร
                    </p>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      ยืนยันรหัสผ่านใหม่
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        required
                        minLength={8}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8C6239] focus:border-[#8C6239] pr-10"
                      />
                      <span
                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                        onClick={() => togglePassword("confirm")}
                      >
                        {showPassword.confirm ? <FaEyeSlash className="h-5 w-5 text-gray-500" /> : <FaEye className="h-5 w-5 text-gray-500" />}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowChangePasswordPopup(false)}
                      className="btn btn-ghost"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="btn bg-[#8C6239] text-white hover:bg-[#7d5a32]"
                    >
                      บันทึกการเปลี่ยนแปลง
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {showEditProfilePopup && (
        <EditProfilePopup
          onClose={() => setShowEditProfilePopup(false)}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
    </>
  );
};

export default UserProfile;

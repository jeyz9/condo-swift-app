import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import UserService from "../services/UserService";
import { Link } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AuthService from "../services/AuthService";
import EditProfilePopup from "./profile/EditProfilePopup";

const UserProfile = () => {
  const { user, logout } = useAuthContext();
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
        Swal.fire({
          icon: "success",
          title: "เปลี่ยนรหัสผ่านสำเร็จ!",
          timer: 1500,
          showConfirmButton: false,
        });
        setShowChangePasswordPopup(false);
        form.reset();
        setShowPassword({ old: false, new: false, confirm: false });
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
              แบบร่าง
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
      {showChangePasswordPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  เปลี่ยนรหัสผ่าน
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  เพื่อความปลอดภัย แนะนำให้ใช้รหัสผ่านที่ไม่ซ้ำกับที่อื่น
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowChangePasswordPopup(false)}
                className="btn btn-ghost btn-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Old password */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  รหัสผ่านเดิม
                </label>
                <div className="relative">
                  <input
                    type={showPassword.old ? "text" : "password"}
                    name="oldPassword"
                    required
                    className="w-full input input-bordered input-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword("old")}
                    className="btn btn-ghost btn-xs absolute right-1.5  translate-y-1"
                  >
                   
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  รหัสผ่านใหม่
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    required
                    minLength={8}
                    className="w-full input input-bordered input-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword("new")}
                    className="btn btn-ghost btn-xs absolute right-1.5 translate-y-1"
                  >
                  
                  </button>
                </div>
                <p className="text-[11px] mt-1 text-gray-400">
                  อย่างน้อย 8 ตัวอักษร แนะนำให้มีทั้งตัวเลขและตัวอักษร
                </p>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  ยืนยันรหัสผ่านใหม่
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    required
                    minLength={8}
                    className="w-full input input-bordered input-sm pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => togglePassword("confirm")}
                    className="btn btn-ghost btn-xs absolute right-1.5 translate-y-1"
                  >
                 
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowChangePasswordPopup(false)}
                  className="btn btn-sm btn-ghost"
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-sm btn-primary">
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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


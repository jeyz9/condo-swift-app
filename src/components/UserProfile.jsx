import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import UserService from "../services/UserService";
import { Link } from "react-router-dom";

const UserProfile = () => {
  const { user, logout } = useAuthContext();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const displayName = profile?.name?.trim() || "ไม่ระบุชื่อ";
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
    .map((r) => r?.toString?.() || "")
    .map((r) => r.replace(/^ROLE_/i, "").toUpperCase())
    .filter(Boolean);
  const isAdmin =
    normalizedRoles.includes("ADMIN") || normalizedRoles.includes("SUPER_ADMIN");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await UserService.profilePublic(user?.userId);

        console.log("response:", response);

        setProfile(response?.status === 200 ? response?.data : {});
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
          text:
            error.response?.message ||
            "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
          confirmButtonText: "ตกลง",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user?.userId) {
      fetchData();
    }
  }, [user?.userId]);

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

  return (
    <div className="flex gap-2">
      <div className="dropdown dropdown-end ">
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
          className="menu menu-sm dropdown-content bg-white rounded-xl z-[1] mt-5 w-56 p-3 shadow-lg border border-gray-100"
        >
          {/* header user info */}
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
            <Link
              to="/profile"
              className="justify-between text-sm text-gray-700"
            >
              โปรไฟล์
            </Link>
          </li>
          <li>
            <Link
              to="/bookmarks"
              className="text-sm text-gray-700"
            >
              บุ๊คมาร์ก
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link
                to="/admin/dashboard"
                className="text-sm text-gray-700"
              >
                แผงผู้ดูแลระบบ
              </Link>
            </li>
          )}
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
  );
};

export default UserProfile;

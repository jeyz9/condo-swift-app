import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import UserService from "../services/UserService";
import { Link } from "react-router-dom";

const UserProfile = () => {

  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const { logout } = useAuthContext();
  const { user } = useAuthContext();
  const displayName = profile?.name?.trim() || "ไม่ระบุชื่อ";

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

    fetchData();
  }, []);


  const handleLogout = () => {
    logout();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "logout สำเร็จ!",
      text: "ออกจากระบบแล้ว",
      showConfirmButton: false,
      timer: 1500,
    });
  };
  return (
    <div className="flex gap-2">
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          {loading ? (
            <div className="w-10 rounded-full bg-gray-300 animate-pulse"></div>
          ) : (
            <div className="w-10 rounded-full">
              <img
                alt="Profile"
                src={profile?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff`}
              />
            </div>
          )}
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <Link to={`/profile`} className="justify-between">
              Profile
            </Link>
          </li>
          <li>
            <Link to="/bookmarks">Bookmarks</Link>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <a onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserProfile;

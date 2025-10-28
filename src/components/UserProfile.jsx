import React, { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import UserService from "../services/UserService";

const UserProfile = () => {
  const [profile, setProfile] = useState({});
  const { logout } = useAuthContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await UserService.getUserProfileOverview(user?.userId);
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
          <div className="w-10 rounded-full">
            <img
              alt="Profile"
              src={`${profile?.image}`}
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li>
            <a href={`/profile/${user?.userId}`} className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
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

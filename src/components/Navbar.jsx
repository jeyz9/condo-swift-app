import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import LoginPopup from "./login/LoginPopup";
import RegisterPopup from "./login/RegisterPopup";
import { useAuthContext } from "../context/AuthContext";
import UserProfile from "./UserProfile";
import NotificationMenu from "./NotificationMenu";
import UserService from "../services/UserService";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user } = useAuthContext();
  const roles = user?.roles || "";
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.userId) {
      UserService.profilePublic(user.userId)
        .then((res) => {
          if (res.status === 200) {
            setProfile(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
        });
    }
  }, [user?.userId]);

  // Close dropdowns when clicking outside of the navbar center
  useEffect(() => {
    const handleDocClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  const handleAddAnnounceClick = () => {
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบเพื่อลงประกาศ",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (profile && profile.emailVerified && profile.phoneVerified) {
      navigate("/add-announce");
    } else {
      Swal.fire({
        icon: "warning",
        title: "คุณยังไม่ได้ยืนยันตัวตน",
        text: "กรุณายืนยันตัวตนทั้งอีเมลและเบอร์โทรศัพท์ก่อนลงประกาศ",
        confirmButtonText: "ไปที่หน้าโปรไฟล์",
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/profile");
        }
      });
    }
  };
  const menuItems = [
    { title: "หน้าแรก", path: "/" },
    { title: "เกี่ยวกับเรา", path: "/about-us" },
    {
      title: "บริการ",
      submenu: [
        { title: "เช่า", path: "/filter?saleType=เช่า&page=0&size=10" },
        { title: "ขาย", path: "/filter?saleType=ขาย&page=0&size=10" },

        ...(roles.includes("ROLE_ADMIN")
          ? [{ title: "ระบบผู้ดูแล", path: "/admin/dashboard" }]
          : []),
      ],
    },
  ];

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const navRef = useRef(null);

  const handleLogin = (data) => {
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 sm:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <FaBars className="h-5 w-5" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {menuItems.map((item, index) => (
              <li key={index}>
                {item.submenu ? (
                  <>
                    <span>{item.title}</span>
                    <ul className="p-2">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link to={subItem.path}>{subItem.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link to={item.path}>{item.title}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <Link to="/" className="flex flex-col items-start">
          <span className="text-xs sm:text-sm">Condo</span>
          <span className="text-xl sm:text-2xl font-bold -mt-2">Swift</span>
        </Link>
      </div>

      <div ref={navRef} className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-base">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.submenu ? (
                <details open={openDropdownIndex === index}>
                  <summary
                    className="text-base cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenDropdownIndex(openDropdownIndex === index ? null : index);
                    }}
                  >
                    {item.title}
                  </summary>
                  <ul className="p-2 bg-base-100 rounded-t-none absolute w-max text-base">
                    {item.submenu.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <Link to={subItem.path}>{subItem.title}</Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <Link to={item.path} className="text-base">
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end">
        {user ? (
          <>
            {(roles.includes("ROLE_AGENT") || roles.includes("ROLE_OWNER")) && (
              <button
                onClick={() => handleAddAnnounceClick()}
                className="btn btn-sm sm:btn-md bg-[#8C6239] text-white border-none hover:bg-[#704c2c] mx-2"
              >
                ลงประกาศ
              </button>
            )}
            <NotificationMenu />
            <UserProfile />
          </>
        ) : (
          <button
            onClick={() => setIsLoginOpen(true)}
            className="btn bg-[#8C6239] text-white font-light rounded-md sm:w-32 text-sm sm:text-base"
          >
            เข้าสู่ระบบ
          </button>
        )}

        <LoginPopup
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLogin}
          onOpenRegister={() => {
            setIsLoginOpen(false);
            setIsRegisterOpen(true);
          }}
        />

        <RegisterPopup
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onOpenLogin={() => {
            setIsRegisterOpen(false);
            setIsLoginOpen(true);
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;

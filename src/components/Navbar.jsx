import React, { useState } from "react";
import { Link } from "react-router";
import { FaBars } from "react-icons/fa";
import LoginPopup from "./login/LoginPopup"; // ✅ import login popup
import RegisterPopup from "./login/RegisterPopup"; // ✅ import register popup
import { useAuthContext } from "../context/AuthContext";
import UserProfile from "./UserProfile";
import { IoMdNotificationsOutline } from "react-icons/io";
import NotificationMenu from "./NotificationMenu";
const Navbar = () => {
  const menuItems = [
    { title: "หน้าแรก", path: "/" },
    { title: "เกี่ยวกับเรา", path: "/about-us" },
    {
      title: "บริการ",
      submenu: [
        { title: "เช่า", path: "/filter?saleType=เช่า&page=0&size=10" },
        { title: "ขาย", path: "/filter?saleType=ขาย&page=0&size=10" },
      ],
    },
  ];

  const { user } = useAuthContext();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleLogin = (data) => {
    console.log("ข้อมูลเข้าสู่ระบบ:", data);
    // TODO: เรียก API login หรือบันทึก token ได้ที่นี่
  };

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 sm:px-8">
      {/* ซ้าย */}
      <div className="navbar-start">
        {/* เมนูมือถือ */}
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

        {/* โลโก้ */}
        <Link to="/" className="flex flex-col items-start">
          <span className="text-xs sm:text-sm">Condo</span>
          <span className="text-xl sm:text-2xl font-bold -mt-2">Swift</span>
        </Link>
      </div>

      {/* กลาง */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-base">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.submenu ? (
                <details>
                  <summary className="text-base">{item.title}</summary>
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

      {/* ขวา */}
      <div className="navbar-end">
        {user ? (
          <>
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
        {/* ✅ Login Popup */}
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
        />
      </div>
    </div>
  );
};

export default Navbar;

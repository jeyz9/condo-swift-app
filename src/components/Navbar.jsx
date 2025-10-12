import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const menuItems = [
    { title: "หน้าแรก", path: "/" },
    { title: "เกี่ยวกับเรา", path: "/about" },
    {
      title: "บริการ",
      submenu: [
        { title: "บริการ 1", path: "/service1" },
        { title: "บริการ 2", path: "/service2" },
      ],
    },
  ];

  return (
    <div className="navbar bg-base-100 shadow-sm px-4 sm:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
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
                        <Link to={item.path} className="text-base">{item.title}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="navbar-end">
                <a className="btn bg-[#8C6239] text-white font-light rounded-md sm:w-32 text-sm sm:text-base">
                  เข้าสู่ระบบ
                </a>
      </div>
    </div>
  );
};

export default Navbar;


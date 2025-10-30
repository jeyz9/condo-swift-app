import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";

export const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const location = useLocation();
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  // ฟังก์ชันช่วยเช็ก path ปัจจุบัน
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-gray-50 text-[#8C6239]">
      {/* ===== Sidebar / Drawer ===== */}
      <aside
        className={`fixed  top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-40 
          ${drawerOpen ? "w-64" : "w-0 overflow-hidden"}`}
      >
        <div className=" p-5  border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#8C6239]">CondoSwift</h2>
          <button
            onClick={toggleDrawer}
            className="lg:hidden text-[#8C6239] hover:text-[#704c2c]"
          >
            ✕
          </button>
        </div>

        <nav className="w-full pr-10">
          <Link
            to="/admin/history"
            className={`block px-10 py-2 rounded-e-md space-y-2 transition  ${
              isActive("/admin/dashboard")
                ? "bg-[#8C6239] text-white"
                : "hover:bg-[#8C623910] hover:text-[#704c2c]"
            }`}
          >
            📊 แดชบอร์ด
          </Link>

     

          <hr className="my-3 border-gray-200" />

          <Link
            to="/"
            className="block px-3 py-2 rounded-lg hover:bg-[#8C623910] hover:text-[#704c2c]"
          >
            🏠 กลับหน้าเว็บหลัก
          </Link>
        </nav>
      </aside>

      {/* ===== Navbar (Top Bar) ===== */}
      <header
        className={`fixed top-0 right-0 h-14 bg-white shadow-sm border-b border-gray-200 flex items-center px-6 transition-all duration-300 z-30 ${
          drawerOpen ? "left-64" : "left-0"
        }`}
      >
        <button
          onClick={toggleDrawer}
          className="text-[#8C6239] hover:text-[#704c2c] mr-4"
        >
          <FaBars className="h-5 w-5 cursor-pointer" />
        </button>
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </header>

      {/* ===== Main Content (Outlet) ===== */}
      <main
        className={`flex-1 pt-16 px-6 pb-10 transition-all duration-300 ${
          drawerOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

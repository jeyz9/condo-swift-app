import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import AnnounceService from "../services/AnnounceService";

export const AdminLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(window.innerWidth >= 1024);
  const location = useLocation();
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const [open, setOpen] = useState({
    announce: false,
    badge: false,
  });

  const isActive = (path) => location.pathname.startsWith(path);
  const [firstId, setFirstId] = useState(null);

  useEffect(() => {
    const loadFirstAnnounce = async () => {
      try {
        const res = await AnnounceService.showAllAnnouncePending("", 0, 1);
        if (res.data.data?.length > 0) {
          setFirstId(res.data.data[0].id);
        }
      } catch (err) {
        console.error("Error loading first announce:", err);
      }
    };

    loadFirstAnnounce();
  }, [isActive]);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setDrawerOpen(true);
      } else {
        setDrawerOpen(false);
      }
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.pathname.startsWith("/admin/announce")) {
      setOpen((prev) => ({ ...prev, announce: true }));
    }
    if (location.pathname.startsWith("/admin/badges")) {
      setOpen((prev) => ({ ...prev, badge: true }));
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50 text-[#8C6239]">
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-40 ${
          drawerOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#8C6239]">CondoSwift</h2>
          <button
            onClick={toggleDrawer}
            className="lg:hidden text-[#8C6239] hover:text-[#704c2c]"
            aria-label="Toggle menu"
          >
            ✕
          </button>
        </div>

        <nav className="w-full pr-10">
          <div>
            <div
              className={`mt-2 flex items-center justify-between cursor-pointer select-none pl-10 pr-5 py-2 rounded-e-md transition  ${
                open.announce
                  ? "bg-[#8C623910] text-[#704c2c]"
                  : "hover:bg-[#8C623910] hover:text-[#704c2c]"
              }`}
              onClick={() =>
                setOpen({ announce: !open.announce, badge: open.badge })
              }
            >
              <p>ประกาศ</p>
              {open.announce ? <FaAngleUp /> : <FaAngleDown />}
            </div>

            {open.announce && (
              <div className="mt-2 flex flex-col space-y-2">
                <Link
                  to={`/admin/announce/published`}
                  className={`pl-16 py-2 cursor-pointer select-none rounded-e-md space-y-2 transition ${
                    isActive("/admin/announce/published") ||
                    isActive("/admin/announce/pending") ||
                    isActive("/admin/announce/history")
                      ? "bg-[#704c2c] text-white"
                      : "hover:bg-[#8C623910] hover:text-[#704c2c]"
                  }`}
                >
                  ประกาศที่เผยแพร่
                </Link>
                <Link
                  to={firstId ? `/admin/announce/details/${firstId}` : ""}
                  onClick={(e) => {
                    if (!firstId) e.preventDefault();
                  }}
                  className={`pl-16 py-2 cursor-pointer select-none rounded-e-md space-y-2 transition ${
                    isActive("/admin/announce/details")
                      ? "bg-[#704c2c] text-white"
                      : "hover:bg-[#8C623910] hover:text-[#704c2c]"
                  }`}
                >
                  รายละเอียดประกาศ
                </Link>
              </div>
            )}
          </div>

          <hr className="my-3 border-gray-200" />

          <div>
            <div
              className={`flex items-center justify-between cursor-pointer select-none pl-10 pr-5 py-2 rounded-e-md transition  ${
                open.badge
                  ? "bg-[#8C623910] text-[#704c2c]"
                  : "hover:bg-[#8C623910] hover:text-[#704c2c]"
              }`}
              onClick={() =>
                setOpen({ badge: !open.badge, announce: open.announce })
              }
            >
              <p>แบดจ์</p>
              {open.badge ? <FaAngleUp /> : <FaAngleDown />}
            </div>

            {open.badge && (
              <div className="mt-2 flex flex-col space-y-2">
                <Link
                  to={`/admin/badges/manage`}
                  className={`pl-16 py-2 cursor-pointer select-none rounded-e-md space-y-2 transition ${
                    isActive("/admin/badges/manage")
                      ? "bg-[#704c2c] text-white"
                      : "hover:bg-[#8C623910] hover:text-[#704c2c]"
                  }`}
                >
                  จัดการแบดจ์
                </Link>
                <Link
                  to={`/admin/badges/assign`}
                  className={`pl-16 py-2 cursor-pointer select-none rounded-e-md space-y-2 transition ${
                    isActive("/admin/badges/assign")
                      ? "bg-[#704c2c] text-white"
                      : "hover:bg-[#8C623910] hover:text-[#704c2c]"
                  }`}
                >
                  เพิ่มแบดจ์ให้ประกาศ
                </Link>
              </div>
            )}
          </div>

          <hr className="my-3 border-gray-200" />

          <Link
            to="/admin/notifications/send"
            className={`block cursor-pointer select-none pl-10 pr-5 py-2 rounded-e-md transition ${
              isActive("/admin/notifications/send")
                ? "bg-[#704c2c] text-white"
                : "hover:bg-[#8C623910] hover:text-[#704c2c]"
            }`}
          >
            ส่งการแจ้งเตือน
          </Link>

          <hr className="my-3 border-gray-200" />

          <Link
            to="/"
            className="block px-3 py-2 rounded-lg hover:bg-[#8C623910] hover:text-[#704c2c]"
          >
            กลับหน้าหลัก
          </Link>
        </nav>
      </aside>

      <header
        className={`fixed top-0 right-0 h-14 bg-white shadow-sm border-b border-gray-200 flex items-center px-6 transition-all duration-300 z-30 ${
          drawerOpen ? "lg:left-64" : "left-0"
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

      <main
        className={`flex-1 overflow-x-auto pt-16 transition-all duration-300 ${
          drawerOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <div className="px-6 pb-10">
          <Outlet />
        </div>

      </main>
    </div>
  );
};

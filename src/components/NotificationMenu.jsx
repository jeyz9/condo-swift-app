import React, { useState, useEffect, useRef } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import NotificationService from "../services/NotificationService";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { NotificationMenuSkeleton } from "./NotificationMenuSkeleton";
import { LuBell } from "react-icons/lu";
import { LuBellDot } from "react-icons/lu";
import { extractErrorMessage } from "../utils/errorUtils";
import { u } from "framer-motion/client";
export default function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef();
  const { user } = useAuthContext();
  const userId = user?.userId;
  const navigate = useNavigate();
  const location = useLocation();

  //  แปลงเวลาให้อ่านง่าย
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleString("th-TH", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  //  ปิด popup เมื่อคลิกนอกกรอบ
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  ดึง notification เมื่อมี userId
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        const response =
          await NotificationService.showAllNotificationSelectedByUserId();

        if (response?.status === 200) {
          setNotifications(response.data);

          //  นับเฉพาะที่ยังไม่อ่าน
          const unread = response.data.filter((n) => !n.is_read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        if (user) { // Only show error if user is still logged in
          Swal.fire({
            title: "ไม่สามารถดึงการแจ้งเตือนได้",
            icon: "error",
            text: extractErrorMessage(error || "เกิดข้อผิดพลาดในการดึงข้อมูลการแจ้งเตือน"),
          });
        }
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchData(); //  โหลดทันทีตอนเข้า
    const interval = setInterval(fetchData, 10000); //  โหลดซ้ำทุก 10 วิ
    return () => clearInterval(interval);
  }, [userId]);

  //  รีเฟรช badge เมื่อกลับมาหน้าหลักหลังจากดู detail
  useEffect(() => {
    if (!isOpen && userId) {
      const refresh = async () => {
        try {
          const res =
            await NotificationService.showAllNotificationSelectedByUserId();
          if (res?.status === 200) {
            setNotifications(res.data);
            const unread = res.data.filter((n) => !n.is_read).length;
            setUnreadCount(unread);
          }
        } catch (error) {
          console.error(error);
        }
      };
      refresh();
    }
  }, [location.pathname]);

  //  เปิด/ปิด popup
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  //  เมื่อกดเข้าไปดู detail
  const handleOpenDetail = (n) => {
    // ❌ ไม่ต้อง markAsRead เพราะ backend ทำให้อยู่แล้ว
    setIsOpen(false);
    navigate(`/notifications/${n.id}`);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* 🔔 ไอคอนแจ้งเตือน */}
      <button
        className="relative text-2xl flex items-center justify-center"
        onClick={handleToggle}
      >
        <IoMdNotificationsOutline className="cursor-pointer text-gray-700 hover:text-[#8C6239] mr-2 h-8 w-8 transition-colors" />

        {/* 🔴 Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 right-[1px] bg-red-500 text-white text-[10px] font-semibold px-1.5 rounded-full animate-pulse w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/*  Popup แจ้งเตือน */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-72 bg-white/90 backdrop-blur-md shadow-xl rounded-xl border border-gray-200 overflow-hidden z-50"
          >
            <div className="p-3 text-sm font-semibold text-gray-700 border-b bg-gradient-to-r from-[#faf9f8] to-[#f3ebe5] flex items-center">
              {unreadCount > 0 ? (
                <>
                  <LuBellDot className="mr-2" />
                  <p>การแจ้งเตือน</p>
                </>
              ) : (
                <>
                  <LuBell className="mr-2" />
                  <p>การแจ้งเตือน</p>
                </>
              )}
            </div>

            {loading ? (
              <NotificationMenuSkeleton />
            ) : notifications.length > 0 ? (
              <ul className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 divide-y divide-gray-100">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className={`flex items-center justify-between px-4 py-3 transition-all duration-200 
                      ${
                        n.is_read
                          ? "bg-gray-50 text-gray-500 hover:bg-gray-100"
                          : "bg-white text-gray-800 hover:bg-[#fdf7f2]"
                      }`}
                  >
                    {/* 🔹 เนื้อหาแจ้งเตือน */}
                    <div
                      onClick={() => handleOpenDetail(n)}
                      className="flex flex-col cursor-pointer flex-grow"
                    >
                      <div className="flex items-center">
                        <span
                          className={`truncate font-semibold max-w-[200px] ${
                            n.is_read
                              ? "text-gray-500"
                              : "text-[#8C6239] font-bold"
                          }`}
                        >
                          {n.title}
                        </span>
                      </div>
                      <span
                        className={`text-xs ${
                          n.is_read ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {formatTime(n.createdDate)}
                      </span>
                    </div>

                    {/* 🔹 ปุ่มลบ (optional) */}
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(n.id);
                      }}
                      className="btn border-none ml-3 text-gray-400 hover:text-red-500 transition"
                      title="ลบการแจ้งเตือน"
                    >
                      <FaRegWindowClose />
                    </button> */}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-400 text-sm">
                ไม่มีการแจ้งเตือน
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

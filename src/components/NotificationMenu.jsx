import React, { useState, useEffect, useRef } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import NotificationService from "../services/์NotificationService";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

export default function NotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0); // ✅ เพิ่ม state สำหรับ badge
  const menuRef = useRef();
  const { user } = useAuthContext();
  const userId = user?.userId;
  const navigate = useNavigate()

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleString("th-TH", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  // ✅ ปิด popup เมื่อคลิกนอกกรอบ
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ ดึง notification เมื่อมี userId
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      try {
        const response =
          await NotificationService.showAllNotificationSelectedByUserId(userId);
        console.log("noti response: ", response);

        if (response?.status === 200) {
          setNotifications(response.data);
          setUnreadCount(response.data.length); // ✅ ตั้งค่า badge ตามจำนวน noti
        }

        const hasRead = localStorage.getItem("hasReadNotifications");
        if (!hasRead) {
          setUnreadCount(response.data.length);
        } else {
          setUnreadCount(0); // ✅ ถ้าเคยอ่านแล้ว ไม่โชว์เลขอีก
        }
      } catch (error) {
        Swal.fire({
          title: "ไม่สามารถดึงการแจ้งเตือนได้",
          icon: "error",
          text: error?.response?.data || error.message,
        });
      }
    };

    fetchData();
  }, [userId]);

  // ✅ เมื่อเปิด popup ให้ reset badge
  const handleToggle = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        setUnreadCount(0);
        localStorage.setItem("hasReadNotifications", "true"); // ✅ เก็บสถานะว่าอ่านแล้ว
      }
      return next;
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* 🔔 ไอคอนแจ้งเตือน */}
      <button className="relative text-2xl" onClick={handleToggle}>
        <IoMdNotificationsOutline className="cursor-pointer text-gray-700 hover:text-[#8C6239] mr-6 h-8 w-8" />

        {/* ✅ แสดง badge เฉพาะเมื่อยังมี unread */}
        {unreadCount > 0 && (
          <span className="absolute mr-5 -top-1 -right-1 animate-ping bg-red-500 text-white text-[10px] px-1.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* ✅ Popup แจ้งเตือน */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-64 bg-white shadow-lg rounded-lg border border-gray-100 overflow-hidden z-50"
          >
            <div className="p-2 text-sm font-semibold text-gray-600 border-b">
              การแจ้งเตือน
            </div>

            {notifications.length > 0 ? (
              <ul className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    className="px-3 py-2 hover:bg-gray-50 border-b border-gray-300 text-sm"
                  >
                     <button className="btn border-none" onClick={() => navigate(`/notifications/${n.id}`)}>
                    <div className="font-semibold text-gray-800">{n.title}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {n.createdDate
                        ? formatTime(n.createdDate)
                        : "ไม่ระบุเวลา"}
                    </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 text-center text-gray-400 text-sm">
                ไม่มีการแจ้งเตือน
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

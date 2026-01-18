import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import NotificationService from "../services/NotificationService";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { MdNotificationsActive } from "react-icons/md";
import { NotificationDetailSkeleton } from "./NotificationDetailSkeleton";
import { extractErrorMessage } from "../utils/errorUtils";

export default function NotificationDetail() {
  const { user } = useAuthContext();
  const userId = user?.userId;
  const { notifyId } = useParams();
  const [detail, setDetail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await NotificationService.showNotificationDetailsSelected(
          notifyId,
        );
        if (res.status === 200) {
          setDetail(res.data);
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถโหลดรายละเอียดได้",
          text: extractErrorMessage(err, "เกิดข้อผิดพลาดที่ไม่คาดคิด"),
        });
      }
    };
    if (userId) fetchData();
  }, [notifyId, userId]);

  if (!detail) return <NotificationDetailSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-2xl mx-auto mt-10 px-6 sm:px-8 py-8 
                 bg-white rounded-xl shadow-sm border border-gray-200"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl border border-gray-200 bg-gray-50">
          <MdNotificationsActive className="text-[#8C6239] w-7 h-7" />
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          รายละเอียดการแจ้งเตือน
        </h1>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-900">{detail.title}</h2>
        <p className="text-gray-700 leading-relaxed">{detail.message}</p>

        <div className="pt-4 mt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            วันที่แจ้งเตือน:{" "}
            {detail.createdDate
              ? new Date(detail.createdDate).toLocaleString("th-TH")
              : "ไม่ระบุเวลา"}
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="btn flex items-center gap-2 px-5 py-2.5 
                     bg-[#8C6239] text-white rounded-full 
                     hover:bg-[#7a552f] transition-all duration-200"
        >
          <IoArrowBack className="text-lg" />
          กลับ
        </button>
      </div>
    </motion.div>
  );
}

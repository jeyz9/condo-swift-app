import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NotificationService from "../services/์NotificationService";
import { useAuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

export default function NotificationDetail() {
  const { user } = useAuthContext();
  const userId = user?.userId;
  const { notifyId } = useParams(); // ต้องตั้งชื่อ param ให้ตรงกับ router
  const [detail, setDetail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await NotificationService.showNotificationDetailsSelected(notifyId, userId);
        if (res.status === 200) {
          setDetail(res.data);
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "ไม่สามารถโหลดรายละเอียดได้",
          text: err.response?.data || err.message,
        });
      }
    };
    if (userId) fetchData();
  }, [notifyId, userId]);

  if (!detail)
    return (
      <div className="text-center mt-10 text-gray-400">กำลังโหลด...</div>
    );

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        {detail.title}
      </h1>
      <p className="mt-2 text-gray-600">{detail.message}</p>
      <p className="mt-4 text-sm text-gray-400">
        วันที่แจ้งเตือน:{" "}
        {detail.createdDate
          ? new Date(detail.createdDate).toLocaleString("th-TH")
          : "ไม่ระบุเวลา"}
      </p>

      <div className="mt-6 text-right">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 bg-[#8C6239] text-white rounded-md hover:bg-[#704e2e]"
        >
          กลับ
        </button>
      </div>
    </div>
  );
}

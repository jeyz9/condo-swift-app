import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineShieldCheck, HiOutlineUserGroup } from "react-icons/hi";
import Swal from "sweetalert2";
import AnnounceService from "../services/AnnounceService";
import { extractErrorMessage } from "../utils/errorUtils";

const statusConfig = {
  pending: {
    text: "รออนุมัติ",
    className: "bg-yellow-100 text-yellow-700",
  },
  approved: {
    text: "อนุมัติแล้ว",
    className: "bg-green-100 text-green-700",
  },
  rejected: {
    text: "ถูกปฏิเสธ",
    className: "bg-red-100 text-red-700",
  },
};

const permissionConfig = {
  view: {
    text: "ดูประกาศ",
    className: "bg-blue-100 text-blue-700",
  },
  edit: {
    text: "แก้ไขได้",
    className: "bg-purple-100 text-purple-700",
  },
  manage: {
    text: "จัดการเต็มรูปแบบ",
    className: "bg-indigo-100 text-indigo-700",
  },
};

export const AgentAnnounceCard = ({ announce, onCancelSuccess }) => {
  const imageUrl =
    announce?.announceImage ||
    "https://via.placeholder.com/400x300?text=No+Image";

  const status = announce?.status?.toLowerCase();
  const permission = announce?.permission?.toLowerCase();

  const statusDisplay = statusConfig[status];
  const permissionDisplay = permissionConfig[permission];

  const handleCancelAgent = async () => {
    Swal.fire({
      icon: "warning",
      title: "ยืนยันการยกเลิก",
      text: "คุณต้องการยกเลิกการดูแลประกาศนี้ใช่หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ปิด",
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AnnounceService.cancelManageRequest(announce.id);

          Swal.fire({
            icon: "success",
            title: "ยกเลิกสำเร็จ",
            text: "คุณได้ยกเลิกการดูแลประกาศแล้ว",
            timer: 1500,
            showConfirmButton: false,
          });

          if (onCancelSuccess) {
            onCancelSuccess(announce.id);
          }
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: extractErrorMessage(error, "ไม่สามารถยกเลิกการดูแลประกาศได้"),
          });
        }
      }
    });
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: "0px 12px 28px rgba(0,0,0,0.12)",
      }}
      transition={{ duration: 0.25 }}
      className="group overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={imageUrl}
          alt={announce?.announceName}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

        {statusDisplay && (
          <div
            className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${statusDisplay.className}`}
          >
            {statusDisplay.text}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4">
        <div>
          <h2 className="line-clamp-2 text-lg font-semibold text-gray-900">
            {announce?.announceName || "ไม่มีชื่อประกาศ"}
          </h2>
        </div>

        {/* Permission */}
        {permissionDisplay && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
              <HiOutlineShieldCheck className="text-lg text-gray-600" />
            </div>

            <div>
              <p className="text-xs text-gray-500">สิทธิ์ของคุณ</p>

              <div
                className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${permissionDisplay.className}`}
              >
                {permissionDisplay.text}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto border-t border-gray-100 pt-3">
          <div className="mb-3 flex items-center gap-1 text-sm text-gray-500">
            <HiOutlineUserGroup />
            <span>Agent</span>
          </div>

          <div className="flex gap-2">
            <Link
              to={`/detail/${announce?.announceId}`}
              className="flex-1 rounded-full bg-[#8C6239] px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-[#704c2c]"
            >
              ดูรายละเอียด
            </Link>
            <Link
              to={`/edit-announce/${announce?.announceId}`}
              state={{ permission: announce?.permission }}
              className="flex-1 rounded-full px-4 py-2 text-center text-sm font-medium text-[#8C6239] transition hover:bg-[#8C6239] hover:text-white border border-[#8C6239] items-center justify-center flex"
            >
              แก้ไข
            </Link>
            <button
              onClick={handleCancelAgent}
              className="rounded-full border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-500 hover:text-white"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

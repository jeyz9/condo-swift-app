// src/components/DraftCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineLocationMarker } from "react-icons/hi";

const formatPrice = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric) || !Number.isFinite(numeric)) return null;
  return numeric.toLocaleString("th-TH");
};

export const DraftCard = ({ announce }) => {
  const announceId = announce?.id ?? "";
  const status = announce?.status?.toLowerCase();
  const editUrl = `/edit-announce-reject/${announceId}?status=${status || ''}`;
  console.log(announce)
  const imageUrl =
    announce?.imageList?.imageUrl ||
    "https://via.placeholder.com/400x300?text=No+Image";
  const price = formatPrice(announce?.price);

  const statusDisplay = {
    draft: { text: "แบบร่าง", className: "bg-blue-500 text-white" },
    rejected: { text: "ถูกปฏิเสธ", className: "bg-red-500 text-white" },
  };

  const displayStatus = statusDisplay[status];

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: "0px 12px 28px rgba(0,0,0,0.15)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden sm:h-52">
        <Link to={editUrl}>
          <img
            src={imageUrl}
            alt={announce?.title || "Draft"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
        {displayStatus && (
          <div
            className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${displayStatus.className}`}
          >
            {displayStatus.text}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {announce?.title || "ไม่มีชื่อเรื่อง"}
          </h2>
          <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
            <HiOutlineLocationMarker className="shrink-0 text-gray-500" />
            <span className="truncate">
              {announce?.address || "ไม่ระบุที่ตั้ง"}
            </span>
          </p>
          {price && (
            <div className="mt-2 text-lg font-semibold text-[#8C6239]">
              ฿{price}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          <Link
            to={editUrl}
            className="btn btn-block rounded-full border-none bg-[#8C6239] text-white shadow-sm transition hover:bg-[#704c2c]"
          >
            แก้ไขแบบร่าง
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
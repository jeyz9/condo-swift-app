/* This code snippet is a React component named `CardFilter` that displays a card with information
about a property announcement. Here's a breakdown of what the component does: */
import React from "react";
import { IoBedOutline } from "react-icons/io5";
import { PiShower } from "react-icons/pi";
import { BsTextarea } from "react-icons/bs";
import { motion } from "framer-motion";

export default function CardFilter({ announce }) {
  const imageUrl =
    announce?.imageList?.[0]?.imageUrl ||
    "https://via.placeholder.com/400x300?text=No+Image";

  const agentImage =
    announce?.agent?.image ||
    "https://cdn-icons-png.flaticon.com/512/147/147142.png";

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        y: -5,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
      }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl shadow-md overflow-hidden border border-gray-100 w-full max-w-[380px] flex flex-col hover:shadow-xl transition-all"
    >
      {/* ✅ รูปภาพ */}
 <div className="relative w-full h-56 sm:h-64 md:h-60 lg:h-64 overflow-hidden">
  <img
    src={
      announce?.imageList?.imageUrl ||
      "https://via.placeholder.com/400x300?text=No+Image"
    }
    alt={announce?.title || "property image"}
    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
    loading="lazy"
  />
  <div className="absolute bottom-3 left-3 bg-[#8C6239] text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
    ฿ {announce?.price?.toLocaleString() || "-"}
  </div>
</div>


      {/* ✅ เนื้อหา */}
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {announce?.title}
        </h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {announce?.location}
        </p>

        {/* ✅ รายละเอียดพื้นที่ */}
        <div className="flex items-center justify-start gap-4 text-sm text-gray-600 mt-4">
          <div className="flex items-center gap-1">
            <IoBedOutline className="text-lg" />
            <span>{announce?.bedroomCount || 0} ห้องนอน</span>
          </div>
          <div className="flex items-center gap-1">
            <PiShower className="text-lg" />
            <span>{announce?.bathroomCount || 0} ห้องน้ำ</span>
          </div>
          <div className="flex items-center gap-1">
            <BsTextarea className="text-base" />
            <span>{announce?.areaSize || 0} ตร.ม.</span>
          </div>
        </div>

        {/* ✅ เส้นแบ่ง */}
        <div className="divider my-4"></div>

        {/* ✅ Agent */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            <img
              src={agentImage}
              alt="agent"
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div>
              <p className="font-semibold text-gray-900 leading-tight">
                {announce?.agent?.name || "ไม่ระบุ"}
              </p>
              <p className="text-xs text-gray-500 line-clamp-1">
                {announce?.agent?.description || "ไม่มีรายละเอียด"}
              </p>
            </div>
          </div>

          <button className="btn btn-outline btn-sm border-[#8C6239] text-[#8C6239] hover:bg-[#8C6239] hover:text-white transition-all">
            ติดต่อเอเจนต์
          </button>
        </div>

        {/* ✅ badges */}
        {announce?.badgeSet?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {announce?.agent?.is_verify && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#28A745]">
                ✅ ยืนยันตัวตนแล้ว
              </span>
            )}
            {announce?.badgeSet?.map((badge) => {
              const isGold = badge.id === 1;
              return (
                <span
                  key={badge.id}
                  className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                    isGold ? "bg-[#FAAF1C]" : "bg-[#8C6239]"
                  }`}
                >
                  {badge.badgeName}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

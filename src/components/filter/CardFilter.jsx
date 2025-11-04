import React from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";

export default function CardFilter({ announce }) {
  const imageUrl =
    announce?.imageList?.imageUrl ||
    "https://via.placeholder.com/400x300?text=No+Image";

  const agent = announce?.agent || {};
  const agentImage =
    agent.image ||
    "https://cdn-icons-png.flaticon.com/512/147/147142.png";

  const isVerified = agent.is_verify === true;
  const badges = Array.isArray(announce?.badgeSet)
    ? announce.badgeSet
    : [];

  const isPremium = badges.some(
    (b) => b.badgeName?.toLowerCase() === "premium"
  );

  return (
    <Link to={`/detail/${announce?.id ?? announce?.announceId ?? ""}`}>
      <motion.div
        whileHover={{
          scale: 1.03,
          y: -5,
          boxShadow: "0px 10px 20px rgba(0,0,0,0.15)",
        }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-3xl shadow-md overflow-hidden border ${
          isPremium ? "border-yellow-400" : "border-gray-100"
        } w-full max-w-[380px] flex flex-col hover:shadow-xl transition-all`}
      >
        {/* ✅ รูปภาพ */}
        <div className="relative w-full h-56 sm:h-64 md:h-60 lg:h-64 overflow-hidden">
          <img
            src={imageUrl}
            alt={announce?.title || "property image"}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />

          {/* badge ราคา */}
          <div className="absolute bottom-3 left-3 bg-[#8C6239] text-white text-sm font-semibold px-3 py-1 rounded-full shadow">
            ฿ {announce?.price?.toLocaleString() || "-"}
          </div>

          {/* badge Premium */}
          {isPremium && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              ⭐ Premium
            </div>
          )}
        </div>

        {/* ✅ เนื้อหา */}
        <div className="p-5 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
            {announce?.title || "ไม่ระบุชื่อประกาศ"}
          </h2>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {announce?.location || "ไม่ระบุที่ตั้ง"}
          </p>

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
                <p className="font-semibold text-gray-900 leading-tight flex items-center gap-1">
                  {agent.name || "ไม่ระบุ"}
                  {isVerified && (
                    <span className="text-green-600 text-xs font-semibold">
                      ✔ ยืนยันแล้ว
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {agent.description || "ไม่มีรายละเอียด"}
                </p>
              </div>
            </div>

            <button className="btn btn-outline btn-sm border-[#8C6239] text-[#8C6239] hover:bg-[#8C6239] hover:text-white transition-all">
              ติดต่อเอเจนต์
            </button>
          </div>

          {/* ✅ badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {badges.map((badge) => {
                const isGold =
                  badge.badgeName?.toLowerCase() === "premium" ||
                  badge.id === 1;
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
    </Link>
  );
}

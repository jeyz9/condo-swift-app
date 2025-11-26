import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { showTermsPopup } from "../details/ShowTermsPopup";
import { showContactPopup } from "../details/ContactPopup";
import { useAuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import UserService from "../../services/UserService";

export default function CardFilter({ announce }) {

  const { user } = useAuthContext();
  const userId = user?.userId || user?.id;

  const [termsAccepted, setTermsAccepted] = useState(false);

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

  // ✅ ใช้ชื่อ badge ภาษาไทย ให้ตรง backend
  const isPremium = badges.some((b) => b.badgeName === "พรีเมียม");

  console.log("announce: ", announce);

  const handleClickTerms = async () => {
    if (!userId) {
      await Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบ",
        text: "ต้องเข้าสู่ระบบก่อนจึงจะสามารถติดต่อเอเจนต์ได้",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    // 1) popup ข้อตกลง
    const accepted = await showTermsPopup();
    if (!accepted) return;

    // 2) บันทึกการยอมรับ terms
    try {
      const response = await UserService.acceptTerms(userId);

      if (response.status === 200 || response.status === 201) {
        setTermsAccepted(true);

        // 3) เปิด popup ช่องทางติดต่อ (ตอนนี้ใส่ mock ไว้ก่อน)
        const phoneMasked = "+6695904xxxx";
        const phoneFull = "+66959042353";
        const lineUrl = "https://line.me/ti/p/xxxxxxxx";

        showContactPopup(phoneMasked, phoneFull, lineUrl);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
        text:
          error.response?.data?.message ||
          error.message ||
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        confirmButtonText: "ตกลง",
      });
    }
  };

  return (
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
      {/* ✅ รูปภาพ + ลิ้งไปหน้ารายละเอียด (เฉพาะตรงนี้) */}
      <div className="relative w-full h-56 sm:h-64 md:h-60 lg:h-64 overflow-hidden">
        <Link to={`/detail/${announce?.id ?? announce?.announceId ?? ""}`}>
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

          {/* badge พรีเมียม */}
          {isPremium && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
              ⭐ พรีเมียม
            </div>
          )}
        </Link>
      </div>

      {/* ✅ เนื้อหา */}
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {announce?.title || "ไม่ระบุชื่อประกาศ"}
        </h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {announce?.address || "ไม่ระบุที่ตั้ง"}
        </p>

        <div className="divider my-4"></div>

        {/* ✅ Agent + ปุ่มติดต่อ */}
        <div className="flex items-center justify-between mt-auto">
          <Link
            to={`/public-profile/${agent?.userId || agent?.agentId || agent?.id}`}
            className="flex items-center gap-3 cursor-pointer"
          >
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
          </Link>

          <button
            onClick={handleClickTerms}
            className="btn btn-outline btn-sm border-[#8C6239] text-[#8C6239] hover:bg-[#8C6239] hover:text-white transition-all"
          >
            ติดต่อเอเจนต์
          </button>
        </div>

        {/* ✅ badges */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {badges.map((badge) => {
              const isGold =
                badge.badgeName === "พรีเมียม" || badge.id === 1;
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

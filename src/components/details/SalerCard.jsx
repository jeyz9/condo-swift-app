import React, { useState } from "react";
import { MdVerified } from "react-icons/md";
import Swal from "sweetalert2";
import { showContactPopup } from "./ContactPopup";
import { showTermsPopup } from "./ShowTermsPopup";
import { useAuthContext } from "../../context/AuthContext";
import UserService from "../../services/UserService";
import { Link } from "react-router-dom";

const SalerCard = ({ agent }) => {
  const { user } = useAuthContext();
  const userId = user?.userId || user?.id;
  const [termsAccepted, setTermsAccepted] = useState(false);

  const agentProfileId = agent?.userId || agent?.agentId || agent?.id; // ✅ Check for userId, agentId, or id

  const handleClickTerms = async () => {
    // ... (rest of the function is unchanged)
    const accepted = await showTermsPopup();
    if (!accepted) return;

    try {
      const response = await UserService.acceptTerms(userId);
      if (response.status === 200 || response.status === 201) {
        setTermsAccepted(true);
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

  console.log(agent);

  return (
    <div className="card bg-base-100 w-full shadow-sm border border-[#FAAF1C] rounded-2xl relative">
      <div className="absolute top-2 right-2">
        <div className="badge bg-[#28A745] border-none rounded-full text-white text-xs sm:text-sm inline-flex items-center gap-1">
          {agent?.is_verify ? "ยืนยันตัวตนแล้ว" : "ยังไม่ยืนยันตัวตน"}
        </div>
      </div>

      <>
        {agentProfileId ? (
          <Link to={`/public-profile/${agentProfileId}`} className="flex items-center gap-4 p-4 sm:p-5 cursor-pointer">
            <div className="avatar">
              <div className="w-16 sm:w-20 rounded-full ring ring-base-200 ring-offset-2">
                <img
                  src={
                    agent?.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      agent?.name || "A"
                    )}&background=0D8ABC&color=fff`
                  }
                  alt="โปรไฟล์ผู้ขาย"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold truncate">
                {agent?.name || "ไม่ระบุชื่อ"}
              </h3>
              <p className="text-sm text-base-content/70">
                {agent?.description || "ไม่มีคำอธิบาย"}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-4 p-4 sm:p-5">
            <div className="avatar">
              <div className="w-16 sm:w-20 rounded-full ring ring-base-200 ring-offset-2">
                <img
                  src={
                    agent?.image ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      agent?.name || "A"
                    )}&background=0D8ABC&color=fff`
                  }
                  alt="โปรไฟล์ผู้ขาย"
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold truncate">
                {agent?.name || "ไม่ระบุชื่อ"}
              </h3>
              <p className="text-sm text-base-content/70">
                {agent?.description || "ไม่มีคำอธิบาย"}
              </p>
            </div>
          </div>
        )}
      </>

      <div className="px-4 sm:px-5 pb-4">
        <button
          onClick={handleClickTerms}
          className="btn w-full bg-[#8C6239] text-white border-none rounded-full"
        >
          ติดต่อสอบถาม
        </button>

        {termsAccepted && (
          <p className="mt-2 text-[12px] text-center text-green-600">
            คุณได้ยอมรับข้อตกลงและเงื่อนไขแล้ว
          </p>
        )}
      </div>
    </div>
  );
};

export default SalerCard;

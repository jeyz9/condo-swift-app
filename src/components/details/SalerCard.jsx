import React, { useState } from "react";
import { MdVerified } from "react-icons/md";
import Swal from "sweetalert2";
import { showContactPopup } from "./ContactPopup";
import { showTermsPopup } from "./ShowTermsPopup";
import { useAuthContext } from "../../context/AuthContext";
import UserService from "../../services/UserService";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaLine } from "react-icons/fa";

const SalerCard = ({ agent }) => {
  const { user } = useAuthContext();
  const userId = user?.userId || user?.id;
  const [termsAccepted, setTermsAccepted] = useState(false);

  const agentProfileId = agent?.userId || agent?.agentId || agent?.id; // ✅ Check for userId, agentId, or id
  const phoneNumber = agent?.phone;
  const lineId = agent?.lineId;

  const termsKey = userId ? `terms_accepted_${userId}` : null;

  React.useEffect(() => {
    if (termsKey && localStorage.getItem(termsKey) === "true") {
      setTermsAccepted(true);
    }
  }, [termsKey]);

  const handleClickTerms = async () => {
    if (termsAccepted) {
      const phoneMasked = phoneNumber
        ? phoneNumber.replace(/(\d{3})\d+(\d{2})/, "$1xxxxx$2")
        : "ไม่พบ";
      const phoneFull = phoneNumber || "ไม่พบเบอร์";
      const lineUrl = lineId ? `https://line.me/ti/p/${lineId}` : "";
      showContactPopup(phoneMasked, phoneFull, lineUrl);
      return;
    }

    const accepted = await showTermsPopup();
    if (!accepted) return;

    try {
      const response = await UserService.acceptTerms(userId);
      if (response.status === 200 || response.status === 201) {
        setTermsAccepted(true);
        if (termsKey) localStorage.setItem(termsKey, "true");
        const phoneMasked = phoneNumber
          ? phoneNumber.replace(/(\d{3})\d+(\d{2})/, "$1xxxxx$2")
          : "ไม่พบ";
        const phoneFull = phoneNumber || "ไม่พบเบอร์";
        const lineUrl = lineId ? `https://line.me/ti/p/${lineId}` : "";
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
                {agent?.name || "ยังไม่เข้าสู่ระบบ"}
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
                {agent?.name || "ยังไม่เข้าสู่ระบบ"}
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

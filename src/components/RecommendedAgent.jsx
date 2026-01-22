// src/components/RecommendedAgent.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom"; //  Import Link
import { MdVerified } from "react-icons/md";
import Swal from "sweetalert2";
import { showContactPopup } from "./details/ContactPopup";
import { showTermsPopup } from "./details/ShowTermsPopup";
import { useAuthContext } from "../context/AuthContext";
import UserService from "../services/UserService";

const RecommendedAgent = ({ recommendedAgents }) => {
  const { user } = useAuthContext();
  const userId = user?.userId || user?.id || null;

  const [termsAccepted, setTermsAccepted] = useState(false);
  console.log("แนะนำ ", recommendedAgents);
  // รองรับทั้งส่งมาเป็น object เดียว หรือ array
  const agents = Array.isArray(recommendedAgents)
    ? recommendedAgents
    : recommendedAgents
    ? [recommendedAgents]
    : [];

  const handleClickTerms = async (agent) => {
    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบ",
        text: "เข้าสู่ระบบก่อนติดต่อผู้ประกาศ",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#8C6239",
      });
      return;
    }

    // 1) แสดง popup ข้อตกลง
    const accepted = await showTermsPopup();
    if (!accepted) return;

    try {
      // 2) บันทึกการยอมรับเงื่อนไข
      const response = await UserService.acceptTerms();

      if (response.status === 200 || response.status === 201) {
        setTermsAccepted(true);

        // 3) จากนั้นแสดงช่องทางติดต่อ
        const phoneMasked =
          agent?.phoneMasked ||
          (agent?.phone
            ? agent.phone.replace(/(\d{6})\d+/, "$1xxxx")
            : "-");

        const phoneFull = agent?.phone || agent?.phoneFull || phoneMasked;
        const lineUrl = `https://line.me/ti/p/${"~"}${agent.lineId}` 
         
        showContactPopup(phoneMasked, phoneFull, lineUrl);
      } else {
        throw new Error("ไม่สามารถบันทึกการยอมรับข้อตกลงได้");
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
        confirmButtonColor: "#8C6239",
      });
    }
  };

  if (!agents.length) {
    return (
      <div className="text-sm text-gray-400">
        ยังไม่มีผู้ประกาศแนะนำในขณะนี้
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {agents.map((agent) => {
        const agentProfileId = agent?.userId || agent?.agentId || agent?.id; //  Get agent ID

        const Wrapper = agentProfileId ? Link : "div";
        const wrapperProps = agentProfileId
          ? { to: `/public-profile/${agentProfileId}` }
          : {};

        return (
          <div
            key={agent.id || agent.agentId || agent.name}
            className="card bg-base-100 w-full shadow-sm border border-[#FAAF1C] rounded-2xl relative"
          >
            {/* Badge ยืนยันตัวตน */}
            <div className="absolute top-2 right-2">
              <div
                className={`badge border-none rounded-full text-white text-xs sm:text-sm inline-flex items-center gap-1 ${
                  agent?.is_verify || agent?.isVerified
                    ? "bg-[#28A745]"
                    : "bg-gray-400"
                }`}
              >
                <MdVerified className="w-4 h-4" />
                {agent?.is_verify || agent?.isVerified
                  ? "ยืนยันตัวตนแล้ว"
                  : "ยังไม่ยืนยันตัวตน"}
              </div>
            </div>

            <Wrapper {...wrapperProps} className="flex items-center gap-4 p-4 sm:p-5">
              <div className="avatar">
                <div className="w-16 sm:w-20 rounded-full ring ring-base-200 ring-offset-2">
                  <img
                    src={
                      agent?.image ||
                      agent?.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        agent?.name || "Agent"
                      )}&background=0D8ABC&color=fff`
                    }
                    alt={agent?.name || "โปรไฟล์ผู้ขาย"}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-semibold truncate">
                  {agent?.name || "ยังไม่เข้าสู่ระบบ"}
                </h3>
                <p className="text-sm text-base-content/70 line-clamp-2">
                  {agent?.description || agent?.bio || "ยังไม่มีคำอธิบาย"}
                </p>
              </div>
            </Wrapper>

            <div className="px-4 sm:px-5 pb-4">
              <button
                type="button"
                onClick={() => handleClickTerms(agent)}
                className="btn w-full bg-[#8C6239] text-white border-none rounded-full hover:bg-[#704c2c]"
              >
                ติดต่อสอบถาม
              </button>

              {termsAccepted && (
                <p className="mt-2 text-[12px] text-center text-grey-200">
                  กรุณาอ่านข้อตกลงก่อนติดต่อสอบถาม
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecommendedAgent;

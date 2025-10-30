import React from "react";
import { PiShareFat } from "react-icons/pi";
import Swal from "sweetalert2";
import { useAuthContext } from "../../context/AuthContext";
import { GoVerified } from "react-icons/go";
import VerifyService from "../../services/VerifyService";
const HeroProfile = ({ profile }) => {
  const { user } = useAuthContext()
  const userId = user?.userId
  const displayName = profile?.name?.trim() || "ไม่ระบุชื่อ";
  const displayDescription =
    profile?.description?.trim() || "ยังไม่มีคำอธิบายเกี่ยวกับผู้ใช้งาน";
  const avatarSrc =
    profile?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0D8ABC&color=fff`;
  
  // ✅ ฟังก์ชันแชร์ลิงก์
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profile/${userId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      Swal.fire({
        icon: "success",
        title: "คัดลอกลิงก์สำเร็จ!",
        text: "คุณสามารถนำไปแชร์ให้ผู้อื่นได้เลย",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถคัดลอกลิงก์ได้",
        text: shareUrl,
      });
    }
  };

  const handleVerify = () => {
    VerifyService.startVerify({
      userId: user?.userId,
    });
  };
  
  console.log(user)

  return (
    <div className="w-full">
      <div className="w-full h-[320px] bg-[#E3E3E3]" />

      <div className="relative -mt-[100px] flex flex-col gap-6 px-6 sm:flex-row sm:items-end sm:justify-between sm:px-12">
        {/* โปรไฟล์ */}
        <div className="flex items-center gap-6 sm:ml-[100px]">
          <img
            src={avatarSrc}
            alt="profile"
            className="h-[180px] w-[180px] rounded-full border-4 border-white object-cover shadow-lg"
          />

          <div className="space-y-6">
            <h2 className="text-[52px] font-medium text-gray-800">
              {displayName} <button  onClick={handleVerify} className="btn btn-dash rounded-full"><GoVerified className="w-[20px] h-[20px]" />ยืนยันตัวตน</button>
            </h2>
            <p className="max-w-[360px] text-[14px] text-gray-600">
              {displayDescription}
            </p>
          </div>
        </div>

        {/* ปุ่มด้านขวา */}
        <div className="flex justify-start sm:ml-auto sm:justify-start sm:items-center gap-4">
          {/* 🟢 ปุ่มแชร์ */}
          <PiShareFat
  onClick={handleShare}
  className="w-[32px] h-[32px] text-[#8C6239] hover:text-[#704e2e] hover:scale-110 transition cursor-pointer"
/>

          <button className="btn bg-[#8C6239] px-6 py-3 text-white hover:bg-[#7a5431]">
            ติดต่อ
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroProfile;

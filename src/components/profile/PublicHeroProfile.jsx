import React, { useState } from "react";
import { PiShareFat } from "react-icons/pi";
import { GoVerified } from "react-icons/go";
import Swal from "sweetalert2";
import { useAuthContext } from "../../context/AuthContext";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";
import ChangePasswordPopup from "./ChangePasswordPopup";

const PublicHeroProfile = ({ profile }) => {
  const { user } = useAuthContext();
  const userId = user?.userId; // This userId is for the *logged-in* user, not the profile being viewed.

  console.log("profile hero: ", profile);

  const emailVerified = profile?.emailVerified;
  const phoneVerified = profile?.phoneVerified;

  const displayName = profile?.name?.trim() || "ยังไม่เข้าสู่ระบบ";
  const displayDescription =
    profile?.description?.trim() || "ยังไม่มีคำอธิบายเกี่ยวกับผู้ใช้งาน";
  const avatarSrc =
    profile?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=0D8ABC&color=fff`;

  //  แชร์ลิงก์โปรไฟล์
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profile/${profile?.userId}`; // Use the profile's userId for sharing
    try {
      await navigator.clipboard.writeText(shareUrl);
      Swal.fire({
        icon: "success",
        title: "คัดลอกลิงก์สำเร็จ!",
        text: "คุณสามารถนำไปแชร์ให้ผู้อื่นได้เลย",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถคัดลอกลิงก์ได้",
        text: shareUrl,
      });
    }
  };

  return (
    <div className="w-full">
      <div className="w-full h-[320px] bg-[#E3E3E3]" />

      <div className="relative -mt-[100px] flex flex-col gap-6 px-6 sm:flex-row sm:items-end sm:justify-between sm:px-12">
        {/*  รูปโปรไฟล์ (ไม่สามารถอัปโหลดได้) */}
        <div className="flex items-center gap-6 sm:ml-[100px] relative group">
          <img
            src={avatarSrc}
            alt="profile"
            className={`h-[180px] w-[180px] rounded-full border-4 border-white object-cover shadow-lg`}
          />
        </div>

        <div className="space-y-15">
          <h2 className="text-[52px] font-medium text-gray-800 flex items-center gap-3 flex-wrap">
            {displayName}
            {emailVerified && phoneVerified && (
              <div className="relative flex items-center select-none gap-2 px-6 py-2.5 rounded-full text-white font-medium text-base overflow-hidden shadow-lg backdrop-blur-md bg-white/10 border border-white/30 hover:scale-105 transition-transform duration-300">
                {/* 🌈 Gradient เคลื่อนไหว */}
                <div className="absolute inset-0 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-[length:400%_400%] animate-gradient-x opacity-90 mix-blend-overlay" />

                {/* ✨ แสงวิ่งผ่าน */}
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-xl animate-shimmer"></div>
                </div>

                {/* เนื้อหา */}
                <div className="relative flex items-center gap-2 z-10">
                  <GoVerified className="w-[18px] h-[18px]" />
                  <span className="tracking-wide drop-shadow-sm">ยืนยันตัวตนแล้ว</span>
                </div>
              </div>
            )}
          </h2>

          <p className="max-w-[360px] text-[14px] text-gray-600 ">
            {displayDescription}
          </p>
        </div>

        {/* ปุ่มแชร์ + ติดต่อ */}
        <div className="flex justify-start sm:ml-auto sm:justify-start sm:items-center gap-4">
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

export default PublicHeroProfile;

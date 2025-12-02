import React, { useState } from "react";
import { PiShareFat } from "react-icons/pi";
import { GoVerified } from "react-icons/go";
import Swal from "sweetalert2";
import { useAuthContext } from "../../context/AuthContext";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";
import ChangePasswordPopup from "./ChangePasswordPopup";

const HeroProfile = ({ profile }) => {
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { user } = useAuthContext();
  const userId = user?.userId;

  const emailVerified = profile?.emailVerified;
  const phoneVerified = profile?.phoneVerified;

  const displayName = profile?.name?.trim() || "ไม่ระบุชื่อ";
  const displayDescription =
    profile?.description?.trim() || "ยังไม่มีคำอธิบายเกี่ยวกับผู้ใช้งาน";

  const avatarSrc =
    profile?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=0D8ABC&color=fff`;

  // อัปโหลดรูป
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await UserService.uploadProfilePicture(userId, file);
      if (res.status === 201) {
        await Swal.fire({
          icon: "success",
          title: "อัปโหลดรูปสำเร็จ!",
          timer: 1200,
          showConfirmButton: false,
        });
        window.location.reload();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "อัปโหลดไม่สำเร็จ",
        text: err.response?.data?.message || err.message,
      });
    } finally {
      setUploading(false);
    }
  };

  // ลบรูป
  const handleDeletePicture = async () => {
    try {
      const result = await Swal.fire({
        title: "ต้องการลบรูปภาพโปรไฟล์?",
        text: "การกระทำนี้ไม่สามารถย้อนกลับได้",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ใช่, ลบเลย!",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        const res = await UserService.deleteProfilePicture(userId);
        if (res.status === 200) {
          await Swal.fire({
            icon: "success",
            title: "ลบรูปภาพสำเร็จ!",
            timer: 1200,
            showConfirmButton: false,
          });
          window.location.reload();
        }
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || err.message,
      });
    }
  };

  // แชร์ลิงก์โปรไฟล์
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
    } catch {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถคัดลอกลิงก์ได้",
        text: shareUrl,
      });
    }
  };

  // ส่ง verify email / phone
  const handleVerify = async () => {
    const { value: method } = await Swal.fire({
      title: "เลือกวิธีการยืนยันตัวตน",
      input: "radio",
      inputOptions: {
        email: "อีเมล",
        phone: "เบอร์โทรศัพท์",
      },
      inputValidator: (v) => (!v ? "กรุณาเลือกวิธีการยืนยันก่อน" : undefined),
      confirmButtonText: "ดำเนินการต่อ",
      confirmButtonColor: "#8C6239",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
    });

    if (!method) return;

    try {
      Swal.fire({
        title:
          method === "email" ? "กำลังส่งอีเมลยืนยัน..." : "กำลังส่งรหัส OTP...",
        didOpen: () => Swal.showLoading(),
        allowOutsideClick: false,
      });

      let response;
      if (method === "email") {
        response = await AuthService.sendVerify(userId);
      } else {
        response = await AuthService.sendOtp(userId);
      }

      Swal.close();

      if (response.status === 200 || response.status === 201) {
        if (method === "email") {
          Swal.fire({
            icon: "success",
            title: "ส่งอีเมลยืนยันสำเร็จ!",
            text: "กรุณาตรวจสอบกล่องอีเมลของคุณ",
            confirmButtonColor: "#8C6239",
          });
        } else {
          const { token, refno } = response.data;
          localStorage.setItem("otpToken", token);
          localStorage.setItem("otpRefno", refno);
          openOtpPopup();
        }
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text:
          error?.response?.data ||
          error?.message ||
          "ไม่สามารถส่งรหัสยืนยันได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonColor: "#8C6239",
      });
    }
  };

  // popup OTP
  const openOtpPopup = () => {
    Swal.fire({
      title: "ยืนยัน OTP",
      html: `
        <div class="flex justify-center gap-2 mt-3">
          ${[...Array(6)]
            .map(
              (_, i) => `
              <input id="otp-${i}" maxlength="1"
                class="w-10 h-12 text-center border border-gray-300 rounded-lg text-lg font-medium
                focus:ring-2 focus:ring-[#8C6239] outline-none"
              />`
            )
            .join("")}
        </div>
        <p class="text-sm text-gray-500 mt-3">
          OTP ไม่ส่ง? 
          <span id="resend-otp" class="text-[#8C6239] cursor-pointer font-semibold">ส่งอีกครั้ง</span>
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#8C6239",
      didOpen: () => {
        const inputs = Array.from({ length: 6 }, (_, i) =>
          document.getElementById(`otp-${i}`)
        );
        inputs.forEach((input, idx) => {
          input.addEventListener("input", (e) => {
            if (e.target.value && idx < inputs.length - 1)
              inputs[idx + 1].focus();
          });
        });
      },
      preConfirm: () => {
        const otp = Array.from({ length: 6 }, (_, i) =>
          document.getElementById(`otp-${i}`).value.trim()
        ).join("");
        if (otp.length !== 6) {
          Swal.showValidationMessage("กรุณากรอก OTP ให้ครบ 6 หลัก");
          return false;
        }
        return otp;
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const otpCode = result.value;
        try {
          const verify = await AuthService.verifyOtp(otpCode);
          if (verify.status === 200) {
            Swal.fire({
              icon: "success",
              title: "ยืนยัน OTP สำเร็จ!",
              confirmButtonColor: "#8C6239",
            });
            localStorage.removeItem("otpToken");
            localStorage.removeItem("otpRefno");
          }
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "OTP ไม่ถูกต้อง",
            text: err.response?.data?.message || "โปรดลองอีกครั้ง",
            confirmButtonColor: "#8C6239",
          });
        }
      }
    });
  };

  return (
    <div className="w-full">
      {/* แบนเนอร์ด้านบน */}
      <div className="w-full h-[320px] bg-[#E3E3E3]" />

      <div className="relative -mt-[100px] flex flex-col gap-6 px-6 sm:flex-row sm:items-end sm:justify-between sm:px-12">
        {/* ซ้าย: รูปโปรไฟล์ */}
        <div className="flex items-center gap-6 sm:ml-[100px]">
          {/* ✅ กล่องห่อรูปที่มี relative + group */}
          <div className="relative group cursor-pointer">
            <img
              src={avatarSrc}
              alt="profile"
              className={`h-[180px] w-[180px] rounded-full border-4 border-white object-cover shadow-lg transition 
                ${uploading ? "opacity-60" : "group-hover:opacity-70"}`}
              onClick={() => document.getElementById("uploadProfile").click()}
            />

            {/* overlay เปลี่ยนรูป */}
            <div
              className="absolute inset-0 z-10 flex h-[180px] w-[180px] items-center justify-center 
              rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition text-white text-sm"
              onClick={() => document.getElementById("uploadProfile").click()}
            >
              เปลี่ยนรูปโปรไฟล์
            </div>

            {/* ปุ่มลบรูป */}
            {profile?.image && (
              <button
                type="button"
                onClick={handleDeletePicture}
                className="absolute top-2 right-2 z-20 p-1.5 bg-gray-800 rounded-full opacity-0 
                group-hover:opacity-100 hover:bg-red-600 hover:scale-110 transition-all duration-200"
                title="ลบรูปโปรไฟล์"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}

            <input
              id="uploadProfile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </div>

        {/* กลาง: ชื่อ + description + ปุ่ม verify */}
        <div className="space-y-5">
          <h2 className="text-[32px] sm:text-[40px] lg:text-[52px] font-medium text-gray-800 flex items-center gap-3 flex-wrap">
            {displayName}
            {emailVerified && phoneVerified ? (
              <div className="relative flex items-center select-none gap-2 px-6 py-2.5 rounded-full text-white font-medium text-base overflow-hidden shadow-lg backdrop-blur-md bg-white/10 border border-white/30 hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-[length:400%_400%] animate-gradient-x opacity-90 mix-blend-overlay" />
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-xl animate-shimmer"></div>
                </div>
                <div className="relative flex items-center gap-2 z-10">
                  <GoVerified className="w-[18px] h-[18px]" />
                  <span className="tracking-wide drop-shadow-sm">
                    ยืนยันตัวตนแล้ว
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleVerify}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#8C6239] text-white text-base 
                font-normal hover:bg-[#704e2e] transition h-auto leading-none"
              >
                <GoVerified className="w-[18px] h-[18px]" />
                ยืนยันตัวตน
              </button>
            )}
          </h2>

          <p className="max-w-[360px] text-[14px] text-gray-600">
            {displayDescription}
          </p>
        </div>

        {/* ขวา: ปุ่มแชร์ + เปลี่ยนรหัสผ่าน */}
        <div className="flex justify-start sm:ml-auto sm:items-center gap-4 pb-4">
          <PiShareFat
            onClick={handleShare}
            className="w-[32px] h-[32px] text-[#8C6239] hover:text-[#704e2e] hover:scale-110 transition cursor-pointer"
          />

          <button
            onClick={() => setShowChangePasswordPopup(true)}
            className="btn px-6 py-3 border border-[#8C6239] text-[#8C6239] hover:bg-[#8C6239] hover:text-white transition-colors"
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </div>
      </div>

      {showChangePasswordPopup && (
        <ChangePasswordPopup onClose={() => setShowChangePasswordPopup(false)} />
      )}
    </div>
  );
};

export default HeroProfile;

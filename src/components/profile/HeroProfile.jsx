import React, { useState } from "react";
import { PiShareFat } from "react-icons/pi";
import { GoVerified } from "react-icons/go";
import Swal from "sweetalert2";
import { useAuthContext } from "../../context/AuthContext";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService"; // ✅ เพิ่ม import นี้
import ChangePasswordPopup from "./ChangePasswordPopup";
import { useNavigate } from "react-router";
const HeroProfile = ({ profile }) => {
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const userId = user?.userId;
  const [uploading, setUploading] = useState(false);
  console.log("profile hero: ", profile);

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

  /* ✅ คลิกเพื่ออัปโหลดรูปโปรไฟล์ */
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
        window.location.reload(); // โหลดหน้าใหม่เพื่อเห็นรูปใหม่
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

  // ✅ แชร์ลิงก์โปรไฟล์
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
          }).then(() => {
            window.location.reload();
          });
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

  // ✅ ยืนยันตัวตน (อีเมล / เบอร์โทร)
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

  // ✅ popup OTP
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
      <div className="inset-0 w-full h-[220px] sm:h-[260px] md:h-[320px] bg-[#E3E3E3]" />

      <div className="relative -mt-[80px] sm:-mt-[100px] flex flex-col gap-6 px-4 sm:px-6 lg:px-12">
        {/* ✅ รูปโปรไฟล์ที่ hover แล้วเปลี่ยนได้ */}
        <div className="flex flex-col sm:flex-row sm:items-start lg:items-end sm:justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6 sm:ml-[60px] lg:ml-[100px] relative group cursor-pointer self-start">
            <img
              src={avatarSrc}
              alt="profile"
              className={`h-[140px] w-[140px] sm:h-[180px] sm:w-[180px] rounded-full border-4 border-white object-cover shadow-lg transition 
              ${uploading ? "opacity-60" : "group-hover:opacity-70"}`}
              onClick={() => document.getElementById("uploadProfile").click()}
            />
            <div
              className="absolute inset-0 w-[140px] h-[140px] sm:w-[180px] sm:h-[180px] rounded-full flex items-center justify-center 
              bg-black/40 opacity-0 group-hover:opacity-100 transition text-white text-xs sm:text-sm"
              onClick={() => document.getElementById("uploadProfile").click()}
            >
              เปลี่ยนรูปโปรไฟล์
            </div>
            {profile?.image && (
              <div
                onClick={handleDeletePicture}
                className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10 p-1.5 bg-gray-800 rounded-full opacity-0 group-hover:opacity-100
              hover:bg-red-600 hover:scale-110 transition-all duration-200"
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
              </div>
            )}
            <input
              id="uploadProfile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>

          <div className="flex-1 space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-wrap">
              <h2 className="text-3xl sm:text-[42px] font-semibold text-gray-800 flex items-center gap-2 flex-wrap">
                {displayName}
              </h2>
              {emailVerified && phoneVerified ? (
                <div className="relative inline-flex items-center select-none gap-2 px-4 sm:px-6 py-2.5 rounded-full text-white text-sm sm:text-base overflow-hidden shadow-lg backdrop-blur-md bg-white/10 border border-white/30 hover:scale-105 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-[length:400%_400%] animate-gradient-x opacity-90 mix-blend-overlay" />
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="absolute inset-y-0 left-0 w-1/3 bg-white/40 blur-xl animate-shimmer"></div>
                  </div>
                  <div className="relative flex items-center gap-2 z-10">
                    <GoVerified className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
                    <span className="tracking-wide drop-shadow-sm text-xs sm:text-sm">
                      ยืนยันตัวตนแล้ว
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleVerify}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#8C6239] text-white text-sm sm:text-base 
              font-normal hover:bg-[#704e2e] transition h-auto leading-none w-fit"
                >
                  <GoVerified className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
                  ยืนยันตัวตน
                </button>
              )}
            </div>

            <p className="max-w-xl text-sm sm:text-base text-gray-600 ">
              {displayDescription}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 sm:mt-4 max-w-3xl">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#8C6239]/10 flex items-center justify-center text-[#8C6239]">
              <PiShareFat className="w-[18px] h-[18px]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">แชร์โปรไฟล์</p>
              <p className="font-semibold text-gray-800 break-all">
                คัดลอกลิงก์โปรไฟล์ของคุณ
              </p>
            </div>
            <button
              onClick={handleShare}
              className="btn btn-xs bg-[#8C6239] text-white hover:bg-[#704e2e]"
            >
              คัดลอก
            </button>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap justify-start sm:justify-end sm:items-center gap-3 sm:gap-4">
            <button
              onClick={() => setShowChangePasswordPopup(true)}
              className="btn px-5 sm:px-6 py-2 sm:py-3 border border-[#8C6239] text-[#8C6239] hover:bg-[#8C6239] hover:text-white transition-colors w-full sm:w-auto"
            >
              เปลี่ยนรหัสผ่าน
            </button>
            {userId && (
              <button
                className="btn btn-outline border-[#8C6239] text-[#8C6239] hover:bg-[#8C6239] hover:text-white w-full sm:w-auto"
                onClick={() => navigate("/profile/edit")}
              >
                แก้ไขโปรไฟล์
              </button>
            )}
          </div>
        </div>
      </div>

      {showChangePasswordPopup && (
        <ChangePasswordPopup
          onClose={() => setShowChangePasswordPopup(false)}
        />
      )}
    </div>
  );
};

export default HeroProfile;

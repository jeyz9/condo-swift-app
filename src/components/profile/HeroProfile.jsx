import React, { useState } from "react";
import { PiShareFat } from "react-icons/pi";
import { GoVerified } from "react-icons/go";
import Swal from "sweetalert2";
import { useAuthContext } from "../../context/AuthContext";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService";

const HeroProfile = ({ profile }) => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuthContext();
  const userId = user?.userId;

  const emailVerified = profile?.emailVerified;
  const phoneVerified = profile?.phoneVerified;
  console.log("email verified:", emailVerified);
  console.log("phone verified:", phoneVerified)
  const displayName = profile?.name?.trim() || "ยังไม่เข้าสู่ระบบ";
  const displayDescription =
    profile?.description?.trim() || "ยังไม่มีคำอธิบายเกี่ยวกับผู้ใช้งาน";

  const avatarSrc =
    profile?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      displayName
    )}&background=0D8ABC&color=fff`;

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

  const handleDeletePicture = async () => {
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
    if (!result.isConfirmed) return;
    try {
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
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.response?.data?.message || err.message,
      });
    }
  };

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

  const handleVerify = async () => {
    const inputOptions = {};
    if (!emailVerified) {
      inputOptions.email = "อีเมล";
    }
    if (!phoneVerified) {
      inputOptions.phone = "เบอร์โทรศัพท์";
    }

    if (Object.keys(inputOptions).length === 0) {
        // Should not happen if the button is hidden correctly
        Swal.fire({
            icon: 'info',
            title: 'ยืนยันตัวตนแล้ว',
            text: 'คุณได้ยืนยันตัวตนทั้งอีเมลและเบอร์โทรศัพท์แล้ว',
        });
        return;
    }

    const { value: method } = await Swal.fire({
      title: "เลือกวิธีการยืนยันตัวตน",
      input: "radio",
      inputOptions,
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
      const response =
        method === "email"
          ? await AuthService.sendVerify(userId)
          : await AuthService.sendOtp(userId);
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
          "ไม่สามารถส่งรหัสยืนยันได้",
        confirmButtonColor: "#8C6239",
      });
    }
  };

  const openOtpPopup = () => {
    const inputs = Array.from({ length: 6 }, (_, i) =>
      document.getElementById(`otp-${i}`)
    );
    Swal.fire({
      title: "ยืนยัน OTP",
      html: `
        <div class="flex justify-center gap-2 mt-3">
          ${[...Array(6)]
            .map(
              (_, i) =>
                `<input id="otp-${i}" maxlength="1" class="w-10 h-12 text-center border border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-[#8C6239] outline-none" />`
            )
            .join("")}
        </div>
        <p class="text-sm text-gray-500 mt-3">OTP ไม่ส่ง? <span id="resend-otp" class="text-[#8C6239] cursor-pointer font-semibold">ส่งอีกครั้ง</span></p>`,
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#8C6239",
      didOpen: () => {
        inputs.forEach((input, idx) =>
          input?.addEventListener("input", (e) => {
            if (e.target.value && idx < inputs.length - 1)
              inputs[idx + 1].focus();
          })
        );
      },
      preConfirm: () => {
        const otp = inputs.map((inp) => inp.value.trim()).join("");
        if (otp.length !== 6) {
          Swal.showValidationMessage("กรุณากรอก OTP ให้ครบ 6 หลัก");
          return false;
        }
        return otp;
      },
    }).then(async (result) => {
      if (!result.isConfirmed) return;
      try {
        const verify = await AuthService.verifyOtp(result.value);
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
    });
  };

  return (
    <div className="w-full">
      {/* แบนเนอร์ */}
      <div className="w-full h-48 sm:h-64 lg:h-80 bg-[#E3E3E3]" />

      <div className="relative -mt-20 lg:-mt-24 px-4 pb-8 max-w-6xl mx-auto">
        <div className="flex flex-col items-center sm:flex-row sm:items-end sm:justify-between gap-4">
          {/* ซ้าย: รูป + ชื่อ + ป้าย verify */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            {/* รูปโปรไฟล์ */}
            <div className="relative group cursor-pointer w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 shrink-0">
              <img
                src={avatarSrc}
                alt="profile"
                className={`w-full h-full rounded-full border-4 border-white object-cover shadow-lg transition
                  ${uploading ? "opacity-60" : "group-hover:opacity-70"}`}
                onClick={() => document.getElementById("uploadProfile").click()}
              />
              {/* overlay เปลี่ยนรูป */}
              <div
                className="absolute inset-0 z-10 flex items-center justify-center rounded-full bg-black/40
                opacity-0 group-hover:opacity-100 transition text-white text-xs sm:text-sm"
                onClick={() => document.getElementById("uploadProfile").click()}
              >
                เปลี่ยนรูปโปรไฟล์
              </div>
              {/* ปุ่มลบ */}
              {profile?.image && (
                <button
                  type="button"
                  onClick={handleDeletePicture}
                  className="absolute top-2 right-2 z-20 p-1.5 bg-gray-800 rounded-full
                  opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:scale-110 transition-all duration-200"
                  title="ลบรูปโปรไฟล์"
                >
                  <svg
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

            {/* ชื่อ + ป้าย verify */}
            <div className="text-center sm:text-left min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-800
                           flex flex-col sm:flex-row justify-center items-center sm:items-start gap-2">
                <span className="truncate max-w-full text-center sm:text-left">{displayName}</span>
                {emailVerified && phoneVerified ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full
                                   text-xs sm:text-sm bg-green-100 text-green-700 whitespace-nowrap">
                    <GoVerified className="w-4 h-4" /> ยืนยันตัวตนแล้ว
                  </span>
                ) : (
                  <button
                    onClick={handleVerify}
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-full
                               text-xs sm:text-sm bg-[#8C6239] text-white hover:bg-[#704e2e]
                               transition whitespace-nowrap"
                  >
                    <GoVerified className="w-4 h-4" /> ยืนยันตัวตน
                  </button>
                )}
              </h1>
              <p className="mt-2 text-sm text-gray-600 max-w-full line-clamp-2">
                {displayDescription}
              </p>
            </div>
          </div>

          {/* ขวา: แชร์อย่างเดียว */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="btn btn-sm btn-ghost btn-circle text-[#8C6239]"
              title="แชร์โปรไฟล์"
            >
              <PiShareFat className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroProfile;
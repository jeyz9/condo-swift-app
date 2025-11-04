import React, { useState } from "react";
import { PiShareFat } from "react-icons/pi";
import { GoVerified } from "react-icons/go";
import Swal from "sweetalert2";
import { useAuthContext } from "../../context/AuthContext";
import AuthService from "../../services/AuthService";
import UserService from "../../services/UserService"; // ✅ เพิ่ม import นี้

const HeroProfile = ({ profile }) => {
  const { user } = useAuthContext();
  const userId = user?.userId;
  const [uploading, setUploading] = useState(false);

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
        })
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
          method === "email"
            ? "กำลังส่งอีเมลยืนยัน..."
            : "กำลังส่งรหัส OTP...",
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
          error?.response?.data?.message ||
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
      <div className="w-full h-[320px] bg-[#E3E3E3]" />

      <div className="relative -mt-[100px] flex flex-col gap-6 px-6 sm:flex-row sm:items-end sm:justify-between sm:px-12">
        {/* ✅ รูปโปรไฟล์ที่ hover แล้วเปลี่ยนได้ */}
        <div className="flex items-center gap-6 sm:ml-[100px] relative group cursor-pointer">
          <img
            src={avatarSrc}
            alt="profile"
            className={`h-[180px] w-[180px] rounded-full border-4 border-white object-cover shadow-lg transition 
              ${uploading ? "opacity-60" : "group-hover:opacity-70"}`}
            onClick={() => document.getElementById("uploadProfile").click()}
          />
          <div
            className="absolute inset-0 w-[180px] h-[180px] rounded-full flex items-center justify-center 
              bg-black/40 opacity-0 group-hover:opacity-100 transition text-white text-sm"
            onClick={() => document.getElementById("uploadProfile").click()}
          >
            เปลี่ยนรูปโปรไฟล์
          </div>
          <input
            id="uploadProfile"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        <div className="space-y-15">
          <h2 className="text-[52px] font-medium text-gray-800 flex items-center gap-3 flex-wrap">
            {displayName}
            <button
              onClick={handleVerify}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#8C6239] text-white text-base 
              font-normal hover:bg-[#704e2e] transition h-auto leading-none"
            >
              <GoVerified className="w-[18px] h-[18px]" />
              ยืนยันตัวตน
            </button>
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

export default HeroProfile;

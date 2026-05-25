import React, { useState, useEffect } from "react";
import CondoHero from "../assets/Condo-Hero.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import UserService from "../services/UserService";
import Swal from "sweetalert2";

const Hero = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const roles = user?.roles 
  useEffect(() => {
    if (user?.userId) {
      UserService.profilePublic(user.userId)
        .then((res) => {
          if (res.status === 200) {
            setProfile(res.data);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
        });
    }
  }, [user?.userId]);

  const handleAddAnnounceClick = () => {
    if (!user) {
      Swal.fire({
        icon: "info",
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบเพื่อลงประกาศ",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    if (profile && profile.emailVerified && profile.phoneVerified) {
      navigate("/add-announce");
    } else {
      Swal.fire({
        icon: "warning",
        title: "คุณยังไม่ได้ยืนยันตัวตน",
        text: "กรุณายืนยันตัวตนทั้งอีเมลและเบอร์โทรศัพท์ก่อนลงประกาศ",
        confirmButtonText: "ไปที่หน้าโปรไฟล์",
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/profile");
        }
      });
    }
  };

  return (
    <div
      className="hero min-h-[360px] sm:min-h-[440px] w-full bg-base-200 -mt-8"
      style={{ backgroundImage: `url(${CondoHero})` }}
    >
      <div
        className="hero-overlay"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      ></div>

      <div className="hero-content flex flex-col items-center justify-center text-center text-neutral-content">
        <div className="max-w-md px-4">
          <h1 className="relative top-35 mb-5 text-4xl sm:text-5xl font-bold">ค้นหาคอนโดในฝัน</h1>
          <p className="relative top-35 mb-50 text-base sm:text-lg">
            แพลตฟอร์มซื้อ-ขายคอนโดที่เชื่อถือได้ เรียบง่าย และปลอดภัย
          </p>

         {roles?.includes("ROLE_AGENT") && (
          <button
            onClick={handleAddAnnounceClick}
            className="btn bg-[#8C6239] text-white font-light rounded-md w-32 border-none shadow-none mb-10 "
          >
            ลงประกาศใหม่
          </button>
          )}
        </div>
      </div>
    </div>
    
  );
};

export default Hero;

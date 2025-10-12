import React from "react";
import CondoHero from "../assets/Condo-hero.jpg";

const Hero = () => {
  return (
    <div
      className="hero min-h-[440px] w-full bg-base-200"
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
          <button className="btn bg-[#8C6239] text-white font-light rounded-md w-32 border-none shadow-none mt-6">
            ลงประกาศใหม่
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

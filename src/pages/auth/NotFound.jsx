import React from "react";
import { Link } from "react-router-dom";
import { PiShareFat } from "react-icons/pi";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-[#f8f3ee] p-6">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-10 text-center">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-[#FDE68A] text-[#92400E] mx-auto mb-6 shadow-inner">
          <span className="text-4xl font-extrabold">404</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-3">
          ไม่พบหน้านี้ (Not Found)
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          หน้าที่คุณพยายามเข้าถึงอาจถูกย้ายหรือลบไปแล้ว — ถ้าคุณคิดว่านี่เป็นความผิดพลาด ให้ลองไปยังหน้าหลักหรือรายงานปัญหา
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="btn px-6 py-3 bg-[#8C6239] text-white rounded-md hover:bg-[#704e2e]">
            กลับหน้าหลัก
          </Link>

          <Link to="/support" className="btn btn-ghost px-6 py-3 border border-[#e6d6c6] rounded-md text-[#8C6239] hover:bg-[#fff7ef]">
            แจ้งปัญหา / ติดต่อทีมงาน
          </Link>
        </div>

        <div className="mt-6 text-xs text-gray-400 flex items-center justify-center gap-2">
          <PiShareFat className="w-4 h-4 text-[#8C6239]" />
          <span>หากคุณพยายามเข้าถึง endpoint ที่ซ่อนไว้ ระบบนี้จะตอบ 404 เพื่อป้องกันการสืบค้น</span>
        </div>
      </div>
    </div>
  );
}
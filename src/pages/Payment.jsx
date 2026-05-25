import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthContext } from "../context/AuthContext";
import { FaRegCreditCard, FaShieldAlt, FaGift, FaCheck } from "react-icons/fa";
import { BsLightningCharge } from "react-icons/bs";
import { LuCoins } from "react-icons/lu";

const packages = [
  { id: "starter", name: "Starter", credits: 5, price: 199 },
  { id: "growth", name: "Growth", credits: 15, price: 499, popular: true },
  { id: "pro", name: "Pro", credits: 40, price: 1199 },
];

export const Payment = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState("growth");

  const selectedPackage = useMemo(
    () => packages.find((p) => p.id === selectedId),
    [selectedId]
  );

  const handlePay = async () => {
    if (!user) {
      await Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบ",
        text: "ต้องเข้าสู่ระบบก่อนเติมเครดิต",
        confirmButtonColor: "#8C6239",
      });
      navigate("/");
      return;
    }

    await Swal.fire({
      icon: "info",
      title: "ยืนยันการชำระเงิน",
      html: `แพ็กเกจ <b>${selectedPackage.name}</b><br/>เครดิต: ${selectedPackage.credits}<br/>ราคา: ${selectedPackage.price.toLocaleString()} บาท`,
      showCancelButton: true,
      confirmButtonText: "ไปชำระเงิน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#8C6239",
      reverseButtons: true,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-gradient-to-r from-[#fdf7f2] to-[#f1e4d7] rounded-2xl p-6 sm:p-10 shadow-lg mb-8">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-[#8C6239] text-white flex items-center justify-center">
            <LuCoins className="text-2xl" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#4a3522]">
              เติมเครดิตเพื่อโพสต์ประกาศ
            </h1>
            <p className="text-[#4a3522] mt-2">
              บัญชีที่ใช้สิทธิฟรีครบ 4 เดือนแล้ว สามารถเติมเครดิตเพื่อโพสต์ประกาศต่อได้ทันที
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-[#4a3522]">
            เลือกแพ็กเกจเครดิต
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <button
                key={pkg.id}
                onClick={() => setSelectedId(pkg.id)}
                className={`relative rounded-2xl border p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg
                  ${
                    pkg.id === selectedId
                      ? "border-[#8C6239] ring-2 ring-[#8C6239]/20 bg-white"
                      : "border-gray-200 bg-white"
                  }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 right-3 bg-[#8C6239] text-white text-xs px-2 py-1 rounded-full shadow">
                    แนะนำ
                  </span>
                )}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-lg font-semibold text-[#4a3522]">
                    {pkg.name}
                  </div>
                  {pkg.id === selectedId && (
                    <FaCheck className="text-[#8C6239]" />
                  )}
                </div>
                <div className="text-3xl font-bold text-[#8C6239]">
                  {pkg.price.toLocaleString()} <span className="text-base">บาท</span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  เครดิต {pkg.credits} ครั้ง
                </div>
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            {[
              {
                icon: <BsLightningCharge />,
                title: "โพสต์ได้ทันที",
                desc: "เครดิตอัปเดตหลังชำระสำเร็จ",
              },
              {
                icon: <FaShieldAlt />,
                title: "ปลอดภัย",
                desc: "รองรับการชำระผ่านช่องทางที่เชื่อถือได้",
              },
              {
                icon: <FaGift />,
                title: "ใบเสร็จอัตโนมัติ",
                desc: "ออกใบเสร็จหลังจ่ายเสร็จ",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-gray-200 bg-white p-4 flex items-start gap-3 shadow-sm"
              >
                <div className="text-[#8C6239] text-xl">{item.icon}</div>
                <div>
                  <div className="font-semibold text-[#4a3522]">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-600">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-md">
            <h3 className="text-lg font-semibold text-[#4a3522] mb-4">
              สรุปการสั่งซื้อ
            </h3>
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700">{selectedPackage.name}</span>
              <span className="font-semibold text-[#4a3522]">
                {selectedPackage.price.toLocaleString()} บาท
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
              <span>เครดิต</span>
              <span>{selectedPackage.credits} ครั้ง</span>
            </div>
            <button
              onClick={handlePay}
              className="btn w-full bg-[#8C6239] text-white hover:bg-[#704c2c] flex items-center justify-center gap-2"
            >
              <FaRegCreditCard />
              ชำระเงิน
            </button>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 shadow-sm">
            <div className="font-semibold text-[#4a3522] mb-2">
              หมายเหตุ
            </div>
            <ul className="list-disc pl-5 space-y-1">
              <li>เครดิตใช้สำหรับการโพสต์ประกาศใหม่ 1 เครดิตต่อ 1 ประกาศ</li>
              <li>เครดิตไม่สามารถแลกเป็นเงินสดและไม่โอนสิทธิให้ผู้อื่น</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

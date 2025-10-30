import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthContext } from "../context/AuthContext";
import UserService from "../services/UserService";
import HeroProfile from "../components/profile/HeroProfile";
import { ProfileDetail } from "../components/profile/ProfileDetail";
import { RentCard } from "../components/profile/RentCard";
import SellCard from "../components/profile/SellCard";
import { Share2 } from "lucide-react"; // 📤 icon แชร์

const FILTER_TABS = [
  { label: "เช่า", value: "เช่า" },
  { label: "ขาย", value: "ขาย" },
];

export const Profile = () => {
  const { user } = useAuthContext();
  const { userId: paramId } = useParams(); // ✅ รับ userId จาก URL เช่น /profile/2

  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("เช่า");
  const [loading, setLoading] = useState(true);

  const userId =  user?.userId;
  console.log(userId)

  // ✅ ดึงข้อมูลโปรไฟล์จาก backend
  const fetchProfile = async (type = "เช่า") => {
    try {
      setLoading(true);
      const response = await UserService.getUserProfileOverview(userId, type);
      if (response?.status === 200) {
        setProfile(response.data);
      } else {
        setProfile(null);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้",
        text:
          error.response?.data?.message ||
          error.message ||
          "เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 โหลดครั้งแรก
  useEffect(() => {
    if (userId) {
      fetchProfile(activeTab);
    }
  }, [userId]);

  // 🔹 โหลดใหม่เมื่อเปลี่ยนแท็บ
  useEffect(() => {
    if (userId) {
      fetchProfile(activeTab);
    }
  }, [activeTab]);

  const announceList = profile?.announceList ?? [];

  // 🟢 Loading และ no-profile states
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-gray-500">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <p className="text-gray-500">ไม่พบข้อมูลโปรไฟล์</p>
      </div>
    );
  }



  return (
    <div className="flex flex-col items-center gap-y-10">
      <HeroProfile profile={profile} />
      <ProfileDetail profile={profile} />

      <section className="w-full max-w-6xl px-6 pb-16">
        {/* ส่วนหัว */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-gray-800 sm:text-3xl">
            ประกาศที่อยู่อาศัย
          </h2>
        </div>

        {/* ปุ่มเลือกแท็บ */}
        <div className="flex mt-5">
          {FILTER_TABS.map((tab, index) => {
            const isActive = activeTab === tab.value;
            const isFirst = index === 0;
            const isLast = index === FILTER_TABS.length - 1;

            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`btn border px-5 py-2 text-sm sm:text-base transition 
                ${isFirst ? "rounded-s-xl" : ""} 
                ${isLast ? "rounded-e-xl" : ""} 
                ${!isLast ? "-mr-[1px]" : ""} 
                ${
                  isActive
                    ? "border-[#8C6239] bg-[#8C6239] text-white rounded-none"
                    : "border-gray-300 text-gray-700 hover:border-[#8C6239] hover:text-[#8C6239] rounded-none"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* รายการประกาศ */}
        {loading ? (
          <p className="mt-8 text-center text-gray-500">กำลังโหลดข้อมูล...</p>
        ) : announceList.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeTab === "เช่า"
              ? announceList.map((a) => (
                  <RentCard key={a?.id ?? a?.announceId} announce={a} />
                ))
              : announceList.map((a) => (
                  <SellCard key={a?.id ?? a?.announceId} announce={a} />
                ))}
          </div>
        ) : (
          <p className="mt-8 text-center text-gray-500">
            ไม่พบประกาศในหมวดนี้
          </p>
        )}
      </section>
    </div>
  );
};

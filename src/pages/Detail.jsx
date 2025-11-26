import React, { useEffect, useState } from "react";
import { CardDetails } from "../components/details/CardDetails";
import SalerCard from "../components/details/SalerCard";
import { GrMapLocation } from "react-icons/gr";
import { IoBedOutline } from "react-icons/io5";
import { PiShower } from "react-icons/pi";
import { BsTextarea } from "react-icons/bs";
import { IoBookmark, IoBookmarkOutline } from "react-icons/io5";
import { PiShareFat } from "react-icons/pi";
import { FaFacebook } from "react-icons/fa";
import {
  MdPool,
  MdFitnessCenter,
  MdLocalParking,
  MdStorefront,
  MdElevator,
  MdSecurity,
} from "react-icons/md";
import GrayscaleMap from "../components/details/GrayscaleMap";
import AnnounceService from "../services/AnnounceService";
import Swal from "sweetalert2";
import { Link, useParams } from "react-router-dom";
import { MdWarningAmber } from "react-icons/md";
import LoginPopup from "../components/login/LoginPopup";
import RegisterPopup from "../components/login/RegisterPopup";
import { useAuthContext } from "../context/AuthContext";
import AuthService from "../services/AuthService";
import { DetailSkeleton } from "./DetailSkeleton";
import UserService from "../services/UserService";

export const Detail = () => {
  const [announce, setAnnounce] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user, login } = useAuthContext();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const userId = user?.userId;
  const agentId = announce?.agent?.id;
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await AnnounceService.showAnnounceDetail(id);
        if (response.status === 200) {
          setAnnounce(response.data);
        } else {
          setAnnounce(null);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
          text:
            error.response?.data?.message ||
            error.message ||
            "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
          confirmButtonText: "ตกลง",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (user) {
        try {
          const response = await UserService.showAllAnnounceBookmark();
          if (response.data) {
            const isMarked = response.data.some(
              (bookmark) => bookmark.id === parseInt(id)
            );
            setIsBookmarked(isMarked);
          }
        } catch (error) {
          console.error("Failed to check bookmark status", error);
        }
      }
    };
    checkBookmarkStatus();
  }, [user, id]);

  const handleBookmarkToggle = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบเพื่อบันทึกประกาศ",
        confirmButtonText: "ตกลง",
      });
      return;
    }

    try {
      if (isBookmarked) {
        await UserService.removeFromBookmark(id);
        setIsBookmarked(false);
        Swal.fire({
          icon: "success",
          title: "ลบออกจากรายการโปรดแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await UserService.bookmarkAnnounce(id);
        setIsBookmarked(true);
        Swal.fire({
          icon: "success",
          title: "บันทึกในรายการโปรดแล้ว",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถอัปเดตรายการโปรดได้",
        confirmButtonText: "ตกลง",
      });
    }
  };
  


 const sharePage = () => {
  const pageUrl = window.location.href;                 // URL จริง
  const encodedUrl = encodeURIComponent(pageUrl);       // สำหรับแชร์

  Swal.fire({
    title: "แชร์ลิงก์หน้านี้",
    html: `
      <div class="flex flex-col gap-3">

        <!-- ปุ่มแชร์ Facebook -->
        <a
          id="fb-share-btn"
          href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}"
          target="_blank"
          rel="noreferrer"
          class="btn flex items-center justify-center w-full py-3 bg-blue-600 text-white rounded-lg text-center"
        >
          <span class="mr-2">📘</span>
          แชร์ผ่าน Facebook
        </a>

        <!-- ปุ่มแชร์ LINE -->
        <a
          href="https://line.me/R/msg/text/?${encodedUrl}"
          target="_blank"
          rel="noreferrer"
          class="btn flex items-center justify-center w-full py-3 bg-green-500 text-white rounded-lg text-center"
        >
          <span class="mr-2">💬</span>
          แชร์ผ่าน LINE
        </a>

        <!-- ปุ่มคัดลอกลิงก์ -->
        <button
          id="copy-link"
          class="btn w-full py-3 bg-gray-200 rounded-lg"
        >
          คัดลอกลิงก์
        </button>

      </div>
    `,
    showConfirmButton: false,
    width: "500px",
  });

  // ปุ่มคัดลอกลิงก์
  const popup = Swal.getPopup();
  const copyBtn = popup?.querySelector("#copy-link");

  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(pageUrl);           // ⬅ ใช้ URL จริง
      copyBtn.textContent = "คัดลอกเรียบร้อย ✓";
    });
  }
};



  if (loading) return <DetailSkeleton />;
  if (!announce)
    return (
      <div className="p-10 text-center text-red-500">ไม่พบข้อมูลประกาศ</div>
    );

  const lat = parseFloat(announce?.mapPoint?.lat ?? 0);
  const lng = parseFloat(announce?.mapPoint?.lng ?? 0);

  const agentData = announce?.agent ?? announce?.agent ?? null;
  console.log(agentData)

  const handleLogin = async ({ email, password }) => {
    try {
      const res = await AuthService.login(email, password);
      if (res?.data?.token) {
        login(res.data);
        setIsLoginOpen(false);
        Swal.fire({ icon: "success", title: "เข้าสู่ระบบสำเร็จ", timer: 1200, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "เข้าสู่ระบบไม่สำเร็จ" });
      }
    } catch (e) {
      Swal.fire({ icon: "error", title: "เข้าสู่ระบบไม่สำเร็จ", text: e?.response?.data?.message || e.message });
    }
  };

    return (
    <>
      <div className="mt-10 flex justify-center px-4">
        <CardDetails images={announce.imageList} />
      </div>

      <div className="mt-7 divider w-full max-w-5xl mx-auto px-4"></div>

      <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[60%_40%] gap-6">
        {/* LEFT SIDE */}
        <div className="min-w-0">
          <h1 className="text-[28px] sm:text-[36px] font-bold break-words whitespace-normal">
            {announce.title}
          </h1>
          <p className="text-[18px] mt-2 text-gray-700">{announce.location}</p>

          <button
            className="btn border-black rounded-full mt-3 font-semibold flex items-center gap-2"
            onClick={() => {
              const lat = announce?.mapPoint?.lat;
              const lng = announce?.mapPoint?.lng;

              if (lat && lng) {
                const url = `https://www.google.com/maps?q=${lat},${lng}`;
                window.open(url, "_blank");
              } else {
                alert("ไม่พบพิกัดของประกาศนี้ ❌");
              }
            }}
          >
            <GrMapLocation className="text-lg" />
            สำรวจบนแผนที่
          </button>

          {/* BADGES */}
          <div className="mt-7 flex flex-wrap gap-2">
            {announce.badges?.map((b) => (
              <div
                key={b.id}
                className={`${
                  Number(b?.id) === 1 ? "bg-[#FAAF1C]" : "bg-[#28A745]"
                } badge border-none font-bold text-xs sm:text-sm md:text-base px-[9px] py-[2px] text-white rounded-2xl h-[24px] w-auto`}
              >
                {b.badgeName}
              </div>
            ))}
          </div>

          <div className="mt-5 divider"></div>

          {/* PRICE & DETAILS */}
          <div className="flex items-start gap-4">
            <div>
              <div className="text-gray-500 font-semibold">ราคา</div>
              <div className="text-2xl font-bold text-[#404040]">
                ฿{announce.price.toLocaleString()}
              </div>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="flex gap-8 text-gray-600 mt-4">
              <div className="flex flex-col items-center ">
                <IoBedOutline className="w-6 h-6" />
                <span>{announce.bedroomCount} ห้องนอน</span>
              </div>
              <div className="flex flex-col items-center">
                <PiShower className="w-6 h-6" />
                <span>{announce.bathroomCount} ห้องน้ำ</span>
              </div>
              <div className="flex flex-col items-center">
                <BsTextarea className="w-6 h-6" />
                <span>{announce.areaSize} ตร.ม.</span>
              </div>
            </div>
          </div>

          <div className="mt-5 divider"></div>

          {/* FACILITIES */}
          {announce.hasPool ||
          announce.hasParking ||
          announce.hasFitness ||
          announce.hasElevator ||
          announce.hasConvenienceStore ? (
            <h2 className="font-bold text-[20px] mb-3">สิ่งอำนวยความสะดวก</h2>
          ) : (
            <>
              <h2 className="font-bold text-[20px] mb-3">สิ่งอำนวยความสะดวก</h2>
              <p className="text-gray-500">ไม่มีสิ่งอำนวยความสะดวก</p>
            </>
          )}

          <div className="grid grid-cols-2 gap-3 text-[#404040]">
            {announce.hasPool && (
              <div className="flex items-center gap-2">
                <MdPool className="w-5 h-5" /> <span>สระว่ายน้ำ</span>
              </div>
            )}
            {announce.hasFitness && (
              <div className="flex items-center gap-2">
                <MdFitnessCenter className="w-5 h-5" /> <span>ฟิตเนส</span>
              </div>
            )}
            {announce.hasParking && (
              <div className="flex items-center gap-2">
                <MdLocalParking className="w-5 h-5" /> <span>ที่จอดรถ</span>
              </div>
            )}
            {announce.hasConvenienceStore && (
              <div className="flex items-center gap-2">
                <MdStorefront className="w-5 h-5" /> <span>ร้านสะดวกซื้อ</span>
              </div>
            )}
            {announce.hasElevator && (
              <div className="flex items-center gap-2">
                <MdElevator className="w-5 h-5" /> <span>ลิฟต์</span>
              </div>
            )}
            {announce.hasSecurity && (
              <div className="flex items-center gap-2">
                <MdSecurity className="w-5 h-5" /> <span>รักษาความปลอดภัย 24/7</span>
              </div>
            )}
          </div>

          <div className="divider my-4"></div>

          {/* MAP */}
          <h2 className="font-bold text-[20px] mb-2">ที่ตั้ง & สถานที่ใกล้เคียง</h2>
          {lat && lng ? (
            <GrayscaleMap lat={lat} lng={lng} />
          ) : (
            <p className="text-gray-500">ไม่มีพิกัดแผนที่</p>
          )}

          <div className="divider my-4"></div>

          {/* MORE INFO */}
          <h2 className="font-bold text-[20px] mb-2">ข้อมูลเพิ่มเติม</h2>
          <div className="text-[#404040] text-[16px] font-medium space-y-2">
            <p>รหัสประกาศ: {announce.id}</p>
            <p>
              วันที่ลงประกาศ:{" "}
              {new Date(announce.announcementDate).toLocaleDateString("th-TH")}
            </p>
            <p>ผู้ลงประกาศ: {agentData?.name ?? "-"}</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full">
          <SalerCard agent={agentData} />
          <div className="divider my-4" />

          <div className="flex gap-x-4 mb-5">
            {userId === agentId ? (
              <Link
                to={`/edit-announce/${id}`}
                className="btn rounded-full pl-7 pr-7 border-gray-700"
              >
                แก้ไขประกาศ
              </Link>
            ) : (
              <>
                <button
                  onClick={handleBookmarkToggle}
                  className={`btn rounded-full border-gray-700 ${
                    isBookmarked ? "bg-yellow-400 text-white" : ""
                  }`}
                >
                  {isBookmarked ? (
                    <IoBookmark className="w-6 h-6" />
                  ) : (
                    <IoBookmarkOutline className="w-6 h-6" />
                  )}
                  {isBookmarked ? "บันทึกแล้ว" : "บันทึก"}
                </button>

                <button
                  onClick={sharePage}
                  className="btn rounded-full pl-12 pr-12 border-gray-700"
                >
                  <PiShareFat className="w-6 h-6" />
                  แชร์
                </button>
              </>
            )}
          </div>

          <div
            role="alert"
            className="alert alert-warning bg-[#FAAF1C40] h-[125px]"
          >
            <MdWarningAmber className="h-6 w-6 shrink-0" />
            <span>
              คำเตือน: ห้ามโอนเงินก่อนเห็นห้องจริงและตรวจสอบเอกสารสิทธิ์ให้ครบถ้วน
            </span>
          </div>
        </div>
      </div>

      {/* POPUPS */}
      <LoginPopup
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
        onOpenRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <RegisterPopup
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </>
  );
};

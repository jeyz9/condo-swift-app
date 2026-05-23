import React, { useEffect, useState } from "react";
import { CardDetails } from "../../components/details/CardDetails";
import SalerCard from "../../components/details/SalerCard";
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
import SimpleMap from "../../components/details/SimpleMap";
import AnnounceService from "../../services/AnnounceService";
import Swal from "sweetalert2";
import { Link, useParams } from "react-router-dom";
import { MdWarningAmber } from "react-icons/md";
import LoginPopup from "../../components/login/LoginPopup";
import RegisterPopup from "../../components/login/RegisterPopup";
import { useAuthContext } from "../../context/AuthContext";
import AuthService from "../../services/AuthService";
import { DetailSkeleton } from "./DetailSkeleton";
import { extractErrorMessage } from "../../utils/errorUtils";
import UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import { AgentManageModal } from "../../components/AgentManageModel";

export const Detail = () => {
  const [announce, setAnnounce] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user, login } = useAuthContext();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);

  const userId = user?.userId;

  const ownerId = announce?.agent?.id;
  const agentId = announce?.agent?.id;

  const isOwner = userId === ownerId;

  const userRoles = user?.roles || [];

  const isAgent =
    typeof userRoles === "string"
      ? userRoles.includes("ROLE_AGENT")
      : Array.isArray(userRoles) && userRoles.includes("ROLE_AGENT");

  const handleDelete = async () => {
    Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบประกาศนี้ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "ใช่, ลบเลย!",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await AnnounceService.deleteAnnounce(id);
          Swal.fire("ลบแล้ว!", "ประกาศของคุณถูกลบแล้ว.", "success");
          navigate("/");
        } catch (error) {
          Swal.fire("เกิดข้อผิดพลาด!", "ไม่สามารถลบประกาศได้ในขณะนี้", "error");
        }
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let announcementData = null;
        let isRejected = false;

        try {
          const response = await AnnounceService.showAnnounceDetail(id);
          if (response.status === 200 && response.data) {
            announcementData = response.data;
            if (announcementData.approveStatusId === 3) {
              isRejected = true;
            }
          } else {
            isRejected = true;
          }
        } catch (error) {
          isRejected = true;
          console.warn(
            "showAnnounceDetail failed, attempting showAnnounceDetailByAgent:",
            error,
          );
        }

        if (isRejected) {
          try {
            const agentResponse =
              await AnnounceService.showAnnounceDetailByAgent(id);
            if (agentResponse.status === 200) {
              setAnnounce(agentResponse.data);
            } else {
              setAnnounce(null);
            }
          } catch (agentError) {
            console.error("showAnnounceDetailByAgent also failed:", agentError);
            setAnnounce(null);
          }
        } else {
          setAnnounce(announcementData);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาดในการเชื่อมต่อ",
          text: extractErrorMessage(
            error,
            "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
          ),
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
              (bookmark) => bookmark.id === parseInt(id),
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
        text: extractErrorMessage(error, "ไม่สามารถอัปเดตรายการโปรดได้"),
        confirmButtonText: "ตกลง",
      });
    }
  };

  const sharePage = () => {
    const pageUrl = window.location.href; // URL จริง
    const encodedUrl = encodeURIComponent(pageUrl); // สำหรับแชร์
    const agentLineId = announce?.agent?.lineId;

    Swal.fire({
      title: "<span class='text-xl font-semibold'>แชร์ลิงก์หน้านี้</span>",
      html: `
    <div class="flex flex-col gap-3 mt-2">

      {/* Facebook */}
      <a
        href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}"
        target="_blank"
        rel="noreferrer"
        class="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-[#1877F2] text-white font-medium shadow hover:opacity-90 transition"
      >
        {/* Facebook SVG */}
        <svg class="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.692V11.01h3.129V8.309c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.31h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z"/>
        </svg>
        แชร์ผ่าน Facebook
      </a>

      ${
        agentLineId
          ? `
      <!-- LINE -->
      <a
        href="https://line.me/R/msg/text/?${encodedUrl}"
        target="_blank"
        rel="noreferrer"
        class="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-[#06C755] text-white font-medium shadow hover:opacity-90 transition"
      >
        {/* LINE SVG */}
        <svg class="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M19.365 9.89c0-4.203-4.214-7.62-9.394-7.62C4.793 2.27.58 5.687.58 9.89c0 3.762 3.31 6.91 7.78 7.51.303.067.716.206.82.473.095.243.062.625.03.873 0 0-.108.648-.132.785-.04.23-.184.9.787.49.97-.41 5.24-3.085 7.15-5.283 1.32-1.448 2.35-3.205 2.35-4.848z"/>
        </svg>
        แชร์ผ่าน LINE
      </a>
      `
          : ""
      }

      {/* Copy */}
      <button
        id="copy-link"
        class="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-gray-100 text-gray-800 font-medium shadow hover:bg-gray-200 transition"
      >
        {/* Copy SVG */}
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M8 16h8a2 2 0 002-2v-8a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
        </svg>
        คัดลอกลิงก์
      </button>

    </div>
  `,
      showConfirmButton: false,
      width: "420px",
    });

    document.getElementById("copy-link")?.addEventListener("click", () => {
      navigator.clipboard.writeText(pageUrl);
      Swal.fire({
        toast: true,
        position: "top",
        icon: "success",
        title: "คัดลอกลิงก์แล้ว",
        showConfirmButton: false,
        timer: 1500,
      });
    });

    // ปุ่มคัดลอกลิงก์
    const popup = Swal.getPopup();
    const copyBtn = popup?.querySelector("#copy-link");

    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(pageUrl); // ⬅ ใช้ URL จริง
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
  console.log(agentData);

  const handleLogin = async ({ email, password }) => {
    try {
      await login(email, password);
      setIsLoginOpen(false);
      Swal.fire({
        icon: "success",
        title: "เข้าสู่ระบบสำเร็จ",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (e) {
      Swal.fire({
        icon: "error",
        title: "เข้าสู่ระบบไม่สำเร็จ",
        text: extractErrorMessage(e, "เกิดข้อผิดพลาดที่ไม่คาดคิด"),
      });
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
                <MdSecurity className="w-5 h-5" />{" "}
                <span>รักษาความปลอดภัย 24/7</span>
              </div>
            )}
          </div>

          <div className="divider my-4"></div>

          {/* MAP */}
          <h2 className="font-bold text-[20px] mb-2">
            ที่ตั้ง & สถานที่ใกล้เคียง
          </h2>
          {lat && lng ? (
            <SimpleMap lat={lat} lng={lng} />
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
          <SalerCard
            agent={agentData}
            onLoginRequest={() => setIsLoginOpen(true)}
          />
          <div className="divider my-4" />

          <div className="mb-5 flex flex-wrap gap-4">
            {isOwner ? (
              <>
                <Link
                  to={`/edit-announce/${id}`}
                  className="btn rounded-full border-gray-700 px-7"
                >
                  แก้ไขประกาศ
                </Link>

                <button
                  onClick={handleDelete}
                  className="btn rounded-full border-none bg-red-500 px-7 text-white hover:bg-red-600"
                >
                  ลบประกาศ
                </button>
              </>
            ) : (
              <>
                {/* BOOKMARK */}
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

                {/* SHARE */}
                <button
                  onClick={sharePage}
                  className="btn rounded-full border-gray-700 px-8"
                >
                  <PiShareFat className="w-6 h-6" />
                  แชร์
                </button>

                {/* REQUEST AGENT */}
                {isAgent && (
                  <button
                    className="btn rounded-full border-none bg-[#8C6239] px-8 text-white hover:bg-[#704c2c]"
                    onClick={() => {
                      Swal.fire({
                        icon: "question",
                        title: "ยืนยันคำขอ",
                        text: "คุณต้องการขอเป็นตัวแทนขายประกาศนี้ใช่หรือไม่?",
                        showCancelButton: true,
                        confirmButtonText: "ยืนยัน",
                        cancelButtonText: "ยกเลิก",
                        confirmButtonColor: "#8C6239",
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          try {
                            await AnnounceService.requestToManageAnnounce(id);
                            Swal.fire({
                              icon: "success",
                              title: "ส่งคำขอสำเร็จ",
                              text: "ระบบได้ส่งคำขอไปยังเจ้าของประกาศแล้ว",
                              timer: 1800,
                              showConfirmButton: false,
                            });
                          } catch (error) {
                            Swal.fire({
                              icon: "error",
                              title: "เกิดข้อผิดพลาด",
                              text: extractErrorMessage(
                                error,
                                "ไม่สามารถส่งคำขอได้",
                              ),
                            });
                          }
                        }
                      });
                    }}
                  >
                    ขอเป็นตัวแทนขาย
                  </button>
                )}
              </>
            )}

            {userId === agentId && (
              <button
                onClick={() => setIsAgentModalOpen(true)}
                className="btn rounded-full border-gray-700"
              >
                จัดการตัวแทน
              </button>
            )}
          </div>

          <AgentManageModal
            announceId={id}
            isOpen={isAgentModalOpen}
            onClose={() => setIsAgentModalOpen(false)}
          />

          <div
            role="alert"
            className="alert alert-warning bg-[#FAAF1C40] h-[125px]"
          >
            <MdWarningAmber className="h-6 w-6 shrink-0" />
            <span>
              คำเตือน:
              ห้ามโอนเงินก่อนเห็นห้องจริงและตรวจสอบเอกสารสิทธิ์ให้ครบถ้วน
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
        onOpenLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />
    </>
  );
};

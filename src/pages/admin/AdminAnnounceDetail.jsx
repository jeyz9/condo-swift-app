import React, { useEffect, useState } from "react";
import { CardDetails } from "../../components/details/CardDetails.jsx";
import SalerCard from "../../components/details/SalerCard.jsx";
import { GrMapLocation } from "react-icons/gr";
import { IoBedOutline } from "react-icons/io5";
import { PiShower } from "react-icons/pi";
import { BsTextarea } from "react-icons/bs";
import { PiShareFat } from "react-icons/pi";
import { FaCheck, FaTimes } from "react-icons/fa";
import {
  MdPool,
  MdFitnessCenter,
  MdLocalParking,
  MdStorefront,
  MdElevator,
  MdSecurity,
  MdNavigateBefore,
  MdNavigateNext,
  MdArrowBack,
  MdWarningAmber,
} from "react-icons/md";
import SimpleMap from "../../components/details/SimpleMap.jsx";
import AnnounceService from "../../services/AnnounceService.js";
import Swal from "sweetalert2";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";
import { DetailSkeleton } from "../announcement/DetailSkeleton.jsx";
import { extractErrorMessage } from "../../utils/errorUtils.js";
import SimilarDuplicateCard from "../../components/SimilarDuplicateCard.jsx";

const AdminAnnounceDetail = () => {
  const [announce, setAnnounce] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingIds, setPendingIds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const { id } = useParams();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const userId = user?.userId;
  const agentId = announce?.owner?.id ?? announce?.agents?.[0]?.id ?? announce?.agent?.id;


  useEffect(() => {
    const fetchPending = async () => {
      try {
        const pendingResponse = await AnnounceService.showAllAnnouncePending(
          "",
          0,
          1000
        );

        if (pendingResponse.data?.content) {
          const ids = pendingResponse.data.content.map((a) => a.id);
          setPendingIds(ids);
        }
      } catch (error) {
        console.error("โหลด pending list ไม่สำเร็จ", error);
      }
    };

    fetchPending();
  }, []);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);

        const response = await AnnounceService.showAnnouncePendingDetails(id);

        if (response.status === 200) {
          setAnnounce(response.data);
        } else {
          setAnnounce(null);
        }

        if (pendingIds.length > 0) {
          const current = pendingIds.indexOf(Number(id));
          setCurrentIndex(current);
        }
      } catch (error) {
        let errorMessage = extractErrorMessage(
          error,
          "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
        );

        const lowerMessage = String(errorMessage).toLowerCase();
        if (
          lowerMessage.includes("you do not have permission to access this announcement") ||
          error?.response?.status === 403
        ) {
          errorMessage = "คุณไม่มีสิทธิ์เข้าถึงประกาศนี้";
        }

        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: errorMessage,
          confirmButtonText: "ตกลง",
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDetail();
    }
  }, [id, pendingIds]);

  const handleApprove = async () => {
    try {
      await AnnounceService.approveAnnounce(id);
      Swal.fire({
        icon: "success",
        title: "อนุมัติสำเร็จ!",
        text: "ประกาศได้รับการอนุมัติและเผยแพร่แล้ว",
      }).then(() => {
        if (currentIndex < pendingIds.length - 1) {
          handleNext();
        } else {
          navigate("/admin/announce/pending", { replace: true });
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: extractErrorMessage(error, "ไม่สามารถอนุมัติประกาศได้"),
      });
    }
  };

  const handleReject = async () => {
    const { value: reason } = await Swal.fire({
      title: "ระบุเหตุผลที่ปฏิเสธ",
      input: "textarea",
      inputPlaceholder: "เช่น รูปภาพไม่ชัดเจน, ข้อมูลติดต่อไม่ถูกต้อง...",
      showCancelButton: true,
      confirmButtonText: "ยืนยันการปฏิเสธ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#d33",
    });

    if (reason) {
      try {
        await AnnounceService.rejectAnnounce(id, { reason });
        Swal.fire({
          icon: "success",
          title: "ปฏิเสธสำเร็จ",
          text: "ประกาศถูกปฏิเสธและส่งกลับไปให้ผู้ใช้แก้ไข",
        }).then(() => {
          if (currentIndex < pendingIds.length - 1) {
            handleNext();
          } else {
            navigate("/admin/announce/pending", { replace: true });
          }
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: extractErrorMessage(error, "ไม่สามารถปฏิเสธประกาศได้"),
        });
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevId = pendingIds[currentIndex - 1];
      navigate(`/admin/announce/details/${prevId}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < pendingIds.length - 1) {
      const nextId = pendingIds[currentIndex + 1];
      navigate(`/admin/announce/details/${nextId}`);
    }
  };

  const sharePage = () => {
    if (navigator.share) {
      navigator.share({
        title: announce?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire("คัดลอกลิงก์แล้ว", "คุณสามารถนำลิงก์ไปแชร์ได้", "success");
    }
  };

  if (loading) return <DetailSkeleton />;

  if (!announce) {
    return (
      <div className="p-10 text-center text-red-500">ไม่พบข้อมูลประกาศ</div>
    );
  }

  const lat = parseFloat(announce?.mapPoint?.lat ?? 0);
  const lng = parseFloat(announce?.mapPoint?.lng ?? 0);
  const agentData =
    announce?.owner ?? announce?.agents?.[0] ?? announce?.agent ?? null;

  const similarDuplicates = announce?.similarDuplicates;
  const exactDuplicates = announce?.exactDuplicates;

  return (
    <>
      {/* Back */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-4">
        <Link
          to="/admin/announce/pending"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <MdArrowBack className="text-xl" />
          <span className="font-semibold">กลับไปหน้ารายการรออนุมัติ</span>
        </Link>
      </div>

      {/* Images */}
      <div className="mt-4 flex justify-center px-4">
        <CardDetails images={announce.imageList} />
      </div>

      <div className="mt-7 divider w-full max-w-5xl mx-auto px-4"></div>

      <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[60%_40%] gap-6">
        {/* LEFT */}
        <div className="min-w-0">
          <h1 className="text-[28px] sm:text-[36px] font-bold break-words">
            {announce.title}
          </h1>
          <p className="text-[18px] mt-2 text-gray-700">{announce.location}</p>

          <button
            className="btn border-black rounded-full mt-3 font-semibold flex items-center gap-2"
            onClick={() => {
              if (lat && lng) {
                window.open(
                  `https://www.google.com/maps?q=${lat},${lng}`,
                  "_blank"
                );
              } else {
                alert("ไม่พบพิกัดของประกาศนี้ ❌");
              }
            }}
          >
            <GrMapLocation className="text-lg" />
            สำรวจบนแผนที่
          </button>

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

          <div className="flex items-start gap-4">
            <div>
              <div className="text-gray-500 font-semibold">ราคา</div>
              <div className="text-2xl font-bold text-[#404040]">
                ฿{announce.price.toLocaleString()}
              </div>
            </div>

            <div className="divider divider-horizontal"></div>

            <div className="flex gap-8 text-gray-600 mt-4">
              <div className="flex flex-col items-center">
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

          <h2 className="font-bold text-[20px] mb-3">สิ่งอำนวยความสะดวก</h2>
          <div className="grid grid-cols-2 gap-3 text-[#404040]">
            {announce.hasPool && (
              <div className="flex items-center gap-2">
                <MdPool className="w-5 h-5" />
                <span>สระว่ายน้ำ</span>
              </div>
            )}
            {announce.hasFitness && (
              <div className="flex items-center gap-2">
                <MdFitnessCenter className="w-5 h-5" />
                <span>ฟิตเนส</span>
              </div>
            )}
            {announce.hasParking && (
              <div className="flex items-center gap-2">
                <MdLocalParking className="w-5 h-5" />
                <span>ที่จอดรถ</span>
              </div>
            )}
            {announce.hasConvenienceStore && (
              <div className="flex items-center gap-2">
                <MdStorefront className="w-5 h-5" />
                <span>ร้านสะดวกซื้อ</span>
              </div>
            )}
            {announce.hasElevator && (
              <div className="flex items-center gap-2">
                <MdElevator className="w-5 h-5" />
                <span>ลิฟต์</span>
              </div>
            )}
            {announce.hasSecurity && (
              <div className="flex items-center gap-2">
                <MdSecurity className="w-5 h-5" />
                <span>รักษาความปลอดภัย 24/7</span>
              </div>
            )}
          </div>

          <div className="divider my-4"></div>

          <h2 className="font-bold text-[20px] mb-2">
            ที่ตั้ง & สถานที่ใกล้เคียง
          </h2>
          {lat && lng ? (
            <SimpleMap lat={parseFloat(lat)} lng={parseFloat(lng)} />
          ) : (
            <p className="text-gray-500">ไม่มีพิกัดแผนที่</p>
          )}

          <div className="divider my-4"></div>

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

        {/* RIGHT */}
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
              <button
                onClick={sharePage}
                className="btn rounded-full pl-12 pr-12 border-gray-700"
              >
                <PiShareFat className="w-6 h-6" />
                แชร์
              </button>
            )}
          </div>

          <div
            role="alert"
            className="alert alert-warning bg-[#FAAF1C40] h-[125px]"
          >
            <MdWarningAmber className="w-6 shrink-0" />
            <span>
              คำเตือน:
              ห้ามโอนเงินก่อนเห็นห้องจริงและตรวจสอบเอกสารสิทธิ์ให้ครบถ้วน
            </span>
          </div>

          <div className="mt-4">
            <SimilarDuplicateCard
              similarDuplicates={similarDuplicates}
              exactDuplicates={exactDuplicates}
            />
          </div>
        </div>
      </div>

      {/* Bottom Admin Actions */}
      <div className="w-full max-w-6xl mx-auto px-4 py-8 flex justify-center items-center gap-4">


        <button onClick={handleApprove} className="btn btn-success text-white">
          <FaCheck /> อนุมัติ
        </button>

        <button onClick={handleReject} className="btn btn-error text-white">
          <FaTimes /> ปฏิเสธ
        </button>

       
      </div>
    </>
  );
};

export default AdminAnnounceDetail;

import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoBedOutline } from "react-icons/io5";
import { PiShower } from "react-icons/pi";
import { BsTextarea } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { showTermsPopup } from "../details/ShowTermsPopup";
import { showContactPopup } from "../details/ContactPopup";
import { useAuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import UserService from "../../services/UserService";

const formatPrice = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric) || !Number.isFinite(numeric)) return null;
  return numeric.toLocaleString("th-TH");
};

const AgentSection = ({ agent, agentProfileId, isVerified }) => {
  const Wrapper = agentProfileId ? Link : "div";
  const wrapperProps = agentProfileId
    ? { to: `/public-profile/${agentProfileId}` }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 transition hover:bg-gray-50"
    >
      <div className="avatar">
        <div className="w-12 rounded-full ring ring-[#f1e7dc] ring-offset-2">
          <img
            src={
              agent?.image ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                agent?.name || "Agent"
              )}&background=8C6239&color=fff`
            }
            alt={agent?.name || "Agent"}
          />
        </div>
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-semibold text-gray-900 line-clamp-1">
          {agent?.name || "ผู้ประกาศ"}
          {isVerified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-[2px] text-[11px] font-semibold text-emerald-700">
              <MdVerified className="text-emerald-500" />
              ยืนยันแล้ว
            </span>
          )}
        </p>
        <p className="text-xs text-gray-500 line-clamp-1">
          {agent?.description ||
            agent?.bio ||
            "ติดต่อเพื่อสอบถามข้อมูลเพิ่มเติม"}
        </p>
      </div>
    </Wrapper>
  );
};

const CardFilter = ({ announce }) => {
  const { user } = useAuthContext();
  const userId = user?.userId || user?.id || null;

  const [termsAccepted, setTermsAccepted] = useState(false);

  const agent = announce?.agent || {};

  console.log("announce in CardFilter:", announce);
  const badges = useMemo(() => {
    if (Array.isArray(announce?.badgeSet)) return announce.badgeSet;
    if (Array.isArray(announce?.badges)) return announce.badges;
    return [];
  }, [announce]);

  const announceId = announce?.id ?? announce?.announceId ?? "";
  const imageUrl =
    announce?.imageList?.imageUrl ||
    announce?.image ||
    announce?.coverImage ||
    announce?.imageList?.[0]?.imageUrl ||
    "https://via.placeholder.com/400x300?text=No+Image";

  const price = formatPrice(announce?.price);
  // const bedroom = announce?.bedroomCount ?? announce?.bedroom ?? "-";
  // const bathroom = announce?.bathroomCount ?? announce?.bathroom ?? "-";
  // const area = announce?.areaSize ?? announce?.area ?? "-";
  const saleType =
    announce?.saleType || announce?.effectiveType || announce?.type || "";

  const isVerified = agent?.is_verify || agent?.isVerified;
  const isPremium = badges.some((b) => b?.badgeName === "พรีเมียม");

  const agentProfileId = agent?.userId || agent?.agentId || agent?.id || null;
  const termsKey = userId ? `terms_accepted_${userId}` : null;

  useEffect(() => {
    if (termsKey && localStorage.getItem(termsKey) === "true") {
      setTermsAccepted(true);
    }
  }, [termsKey]);

  const showContact = () => {
    const phoneNumber = agent?.phone || agent?.phoneNumber;
    const phoneMasked = phoneNumber
      ? phoneNumber.replace(/(\d{3})\d+(\d{2})/, "$1xxxxx$2")
      : "ไม่พบ";
    const phoneFull = phoneNumber || "ไม่พบเบอร์";

    const rawLine = agent?.lineId;
    const lineUrl = `https://line.me/ti/p/~${rawLine}`;

    showContactPopup(phoneMasked, phoneFull, lineUrl);
  };

  const handleClickTerms = async () => {
    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบ",
        text: "ต้องเข้าสู่ระบบก่อนจึงจะสามารถติดต่อผู้ประกาศได้",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#8C6239",
      });
      return;
    }

    if (termsAccepted) {
      showContact();
      return;
    }

    const accepted = await showTermsPopup();
    if (!accepted) return;

    try {
      const response = await UserService.acceptTerms(userId);

      if (response.status === 200 || response.status === 201) {
        setTermsAccepted(true);
        if (termsKey) localStorage.setItem(termsKey, "true");
        showContact();
      } else {
        throw new Error("ไม่สามารถบันทึกการยอมรับข้อตกลงได้");
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
        confirmButtonColor: "#8C6239",
      });
    }
  };

  return (
    <motion.div
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: "0px 12px 28px rgba(0,0,0,0.15)",
      }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border ${
        isPremium
          ? "border-yellow-400 shadow-[0_8px_20px_rgba(250,175,28,0.25)]"
          : "border-gray-100 shadow-sm"
      } bg-white`}
    >
      <div className="relative h-48 w-full overflow-hidden sm:h-52">
        <Link to={`/detail/${announceId}`}>
          <img
            src={imageUrl}
            alt={announce?.title || "ประกาศ"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {saleType && (
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur">
            {saleType}
          </div>
        )}

        {badges.length > 0 && (
          <div className="absolute right-3 top-3 flex flex-wrap gap-2">
            {badges.map((badge) => {
              const isGold = badge?.badgeName === "พรีเมียม";
              return (
                <span
                  key={badge?.id || badge?.badgeName}
                  className={`rounded-full px-3 py-[6px] text-xs font-semibold text-white shadow-sm ${
                    isGold ? "bg-[#FAAF1C]" : "bg-[#28A745]"
                  }`}
                >
                  {badge?.badgeName || "Badge"}
                </span>
              );
            })}
          </div>
        )}

        {isPremium && (
          <div className="absolute inset-x-0 bottom-0 flex items-center gap-2 px-4 pb-3 text-sm font-semibold text-white">
            <span className="h-[10px] w-[10px] animate-pulse rounded-full bg-yellow-300" />
            พรีเมียม
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {announce?.title || "ยังไม่เข้าสู่ระบบประกาศ"}
            </h2>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-600  min-w-0">
              {/* ไอคอน */}
              <HiOutlineLocationMarker className="text-[#8C6239] shrink-0" />

              {/* ข้อความที่ต้องการตัด */}
              <span className="truncate">
                {announce?.address || announce?.province || "ไม่ระบุที่ตั้ง"}
              </span>
            </p>
          </div>
          {price && (
            <div className="shrink-0 rounded-2xl bg-[#f7f3ef] px-3 py-2 text-right">
              <p className="text-xs text-gray-500">ราคา</p>
              <p className="text-lg font-semibold text-[#8C6239]">฿{price}</p>
            </div>
          )}
        </div>

        <AgentSection
          agent={agent}
          agentProfileId={agentProfileId}
          isVerified={isVerified}
        />

        <div className="mt-auto flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleClickTerms}
            className="btn flex-1 rounded-full border-none bg-[#8C6239] text-white shadow-sm transition hover:bg-[#704c2c]"
          >
            ติดต่อผู้ประกาศ
          </button>
          <Link
            to={`/detail/${announceId}`}
            className="btn flex-1 rounded-full border border-[#8C6239]/30 bg-white text-[#8C6239] transition hover:bg-[#8C6239]/5"
          >
            ดูรายละเอียด
          </Link>
        </div>

        {termsAccepted && (
          <p className="text-center text-xs font-medium text-grey-200">
            กรุณาอ่านข้อตกลงก่อนติดต่อสอบถาม
          </p>
        )}
      </div>
    </motion.div>
  );
};


export default CardFilter;

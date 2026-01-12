import React from "react";
import { IoBedOutline } from "react-icons/io5";
import { PiShower } from "react-icons/pi";
import { BsTextarea } from "react-icons/bs";
import { Link } from "react-router-dom";
import { CondoCardSkeleton } from "./CondoCardSkeleton";

const formatPrice = (value) => {
  const numeric = Number(value);
  if (Number.isNaN(numeric) || !Number.isFinite(numeric)) {
    return "-";
  }
  return numeric.toLocaleString("th-TH");
};

export const CondoCard = ({ announce, isLoading }) => {
  if (isLoading) {
    return <CondoCardSkeleton />;
  }

  if (!announce) return null;

  const price = formatPrice(announce?.price);
  const bedroom = announce?.bedroomCount ?? "-";
  const bathroom = announce?.bathroomCount ?? "-";
  const area = announce?.areaSize ?? "-";

  const imageSrc =
    announce?.image ||
    announce?.coverImage ||
    announce?.imageList?.[0]?.imageUrl ||
    "https://placehold.co/600x400?text=No+Image";

  const badges = Array.isArray(announce?.badges)
    ? announce.badges
    : Array.isArray(announce?.badgeSet)
    ? announce.badgeSet
    : [];

  return (
    <Link to={`/detail/${announce?.id ?? announce?.announceId ?? ""}`}>
      <div className="card relative  h-full min-h-[420px] overflow-hidden rounded-[12px] bg-base-100 shadow-sm transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] sm:min-h-[500px]">
        {badges.length > 0 && (
          <div className="absolute right-0 top-0 flex flex-wrap justify-end gap-2 p-3 z-10">
            {badges.map((badge) => {
              const isGold = Number(badge?.id) === 3;
              const base =
                "badge border-none font-bold text-xs sm:text-sm md:text-base px-[9px] py-[2px] text-white rounded-2xl h-[24px] w-auto";
              const cls = isGold
                ? `bg-[#FAAF1C] ${base}`
                : `bg-[#28A745] ${base}`;
              return (
                <div key={badge?.id ?? badge} className={cls}>
                  {badge?.badgeName || `Badge ${badge}`}
                </div>
              );
            })}
          </div>
        )}

        <figure className="h-full">
          <img
            className="h-full w-full object-cover"
            src={imageSrc}
            alt={announce?.title || "ประกาศอสังหา"}
            loading="lazy"
          />
        </figure>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 text-left text-white sm:p-5">
          <h2 className="card-title text-lg font-medium sm:text-xl md:text-2xl">
            ฿{price}
          </h2>
          <h3 className="card-title text-base sm:text-xl md:text-2xl">
            {announce?.title ?? "ยังไม่เข้าสู่ระบบประกาศ"}
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm sm:text-base">
            <p className="flex items-center gap-1">
              <IoBedOutline /> {bedroom} ห้องนอน
            </p>
            <p className="flex items-center gap-1">
              <PiShower /> {bathroom} ห้องน้ำ
            </p>
            <p className="flex items-center gap-1">
              <BsTextarea /> {area} ตร.ม.
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

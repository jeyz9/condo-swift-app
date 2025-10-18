import React from "react";
import { IoBedOutline } from "react-icons/io5";
import { PiShower } from "react-icons/pi";
import { BsTextarea } from "react-icons/bs";
import { Link,  } from "react-router"; // 

export const CondoCard = (props ) => {
  const announce = props?.announce;

  return (
    <Link to={`/detail/${announce?.id}`}>
      <div className="card bg-base-100 shadow-sm overflow-hidden rounded-[12px] transition delay-50 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 relative"
      style={{
          height: "550px",
        }}>

        {/* badge */}
        <div className="absolute right-0 mt-3 mr-3 card-actions justify-end z-10">
          {Array.isArray(announce?.badges) && announce.badges.length > 0 ? (
            announce.badges.map((badge) => {
              const isGold = Number(badge?.id) === 1;
              const base = "badge border-none font-bold text-xs sm:text-sm md:text-base px-[9px] py-[2px] text-white rounded-2xl h-[24px] w-auto";
              const cls = isGold ? `bg-[#FAAF1C] ${base}` : `bg-[#28A745] ${base}`;
              return (
                <div key={badge.id || badge} className={cls}>
                  {badge.badgeName || `Badge ${badge}`}
                </div>
              );
            })
          ) : null}
        </div>

        {/* image */}
        <figure className="w-full min-h-full">
          <img
            className="object-cover w-full h-full"
            src={announce?.image}
            alt={announce?.title}
          />
        </figure>

        {/* overlay info */}
        <div className="absolute bottom-0 items-center justify-start content-start text-left bg-[#0A0A0A50] text-white w-full h-[140px] p-4">
          <div className="ml-2 sm:ml-3 md:ml-5">
            <h2 className="card-title text-md sm:text-xl md:text-2xl font-medium">
              {announce?.price.toLocaleString() || "-"} /เดือน
            </h2>
            <h2 className="card-title text-lg sm:text-xl md:text-2xl justify-start">
              {announce?.title}
            </h2>
            <div className="flex flex-row w-full text-base sm:text-lg justify-between pr-2">
              <p className="flex items-center gap-1">
                <IoBedOutline /> {announce?.bedroomCount} ห้องนอน
              </p>
              <p className="flex items-center gap-1">
                <PiShower /> {announce?.bathroomCount} ห้องน้ำ
              </p>
              <p className="flex items-center gap-1">
                <BsTextarea /> {announce?.areaSize} ตร.ม.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

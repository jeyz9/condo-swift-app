import React from "react";
import { IoBedOutline } from "react-icons/io5";
import { PiShower } from "react-icons/pi";
import { BsTextarea } from "react-icons/bs";

export default function CardFilter({ announce }) {
  console.log(announce)
  return (
    <div className="bg-white rounded-3xl shadow-md overflow-hidden border-none w-[455px] h-[610px]">
      {/* รูปภาพ */}
      <div className="w-full h-[55%] overflow-hidden">
        <img
          src={announce.imageList.imageUrl}
          alt={announce.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* เนื้อหา */}
      <div className="p-5">
        <h2 className="text-xl font-semibold text-gray-900">
          {announce.title}
        </h2>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {announce.location}
        </p>

        <p className="text-lg font-bold text-black mt-3">{announce.price}</p>

        {/* Agent */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <img
              // src={announce.agent?.image }
              alt="agent"
              className="w-[55px] h-[55px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900 leading-tight">
                {announce.agent.name}
              </p>
              <p className="text-sm text-gray-500 line-clamp-1">
                {announce.agent.description}
              </p>
            </div>
          </div>
          <button className="btn btn-outline btn-sm">ติดต่อเอเจนต์</button>
        </div>

        <div className="divider my-4"></div>

        {/* badges */}
        <div className="flex flex-wrap gap-2">
          {announce.agent?.is_verify && (
            <span className="px-4 py-1 rounded-full text-sm font-semibold text-white bg-[#FAAF1C]">
              ยืนยันตัวตนแล้ว
            </span>
          )}
          {announce.badgeSet?.map((badge) => {
            const isGold = badge.id === 1;
            return (
              <span
                key={badge.id}
                className={`px-4 py-1 rounded-full text-sm font-semibold text-white ${
                  isGold ? "bg-[#FAAF1C]" : "bg-[#28A745]"
                }`}
              >
                {badge.badgeName}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";

const SellCard = ({ announce }) => {

  if (!announce) return null;

  const imageSrc =
    announce?.image ||
    announce?.coverImage ||
    announce?.imageList?.[0]?.imageUrl ||
    "https://placehold.co/600x400?text=No Image";


console.log("announce object =", announce);


  return (
     <Link to={`/detail/${announce?.id}`}>
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* รูปภาพ */}
      <img
        src={imageSrc}
        alt={announce?.title || "ไม่มีชื่อประกาศ"}
        className="h-44 w-full object-cover"
      />

      {/* เนื้อหา */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* ป้ายประเภท */}
        <span className="inline-flex w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
          ขาย
        </span>

        {/* ชื่อประกาศ */}
        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
          {announce?.title || "ไม่มีชื่อประกาศ"}
        </h3>

        {/* สถานที่ */}
        <p className="line-clamp-2 text-sm text-gray-600">
          {announce?.location || "ไม่ระบุสถานที่"}
        </p>

      </div>
    </article>
    </Link>
  );
};

export default SellCard;

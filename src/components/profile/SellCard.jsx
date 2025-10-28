import React from "react";

const formatPrice = (price) => {
  const numeric = Number(price);
  if (Number.isNaN(numeric) || !Number.isFinite(numeric)) {
    return "-";
  }
  return numeric.toLocaleString("th-TH");
};

const SellCard = ({ announce }) => {
  if (!announce) return null;

  const imageSrc =
    announce?.image ||
    announce?.coverImage ||
    announce?.imageList?.[0]?.imageUrl ||
    "https://placehold.co/600x400?text=No Image";

  const price = formatPrice(announce?.price);

  return (
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

        {/* ราคาและขนาดพื้นที่ */}
        <div className="mt-auto flex items-center justify-between text-sm text-gray-700">
          <span className="font-semibold text-emerald-600">฿{price}</span>
          <span className="text-xs text-gray-500">
            {announce?.areaSize ? `${announce.areaSize} ตร.ม.` : "-"}
          </span>
        </div>
      </div>
    </article>
  );
};

export default SellCard;

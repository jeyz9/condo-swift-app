import React from "react";

const CondoCardNearby = ({ item, image }) => {
  const name = item?.name || "สถานีรถไฟฟ้าใกล้เคียง";
  const total =
    typeof item?.totalAnnounces === "number" ? item.totalAnnounces : 0;

  return (
    <div className="card relative flex h-full flex-col overflow-hidden rounded-[12px] bg-white shadow-lg transition-transform hover:-translate-y-1 hover:scale-[1.02]">
      {/* Badge */}
      <div className="absolute right-0 top-0 p-3">
        <div className="badge bg-green-600 text-white border-none rounded-2xl px-3 py-1 text-xs sm:text-sm md:text-base font-bold">
          ใกล้ BTS/MRT
        </div>
      </div>

      {/* รูปภาพ */}
      <figure className="h-56 w-full sm:h-64 bg-gray-100">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => (e.target.src = "/mrt/MRT-BLUELINE-BLE.jpg")}
        />
      </figure>

      {/* เนื้อหา */}
      <div className="flex flex-col gap-3 bg-white p-4 text-center sm:p-5 sm:text-left">
        <h2 className="card-title text-xl sm:text-2xl md:text-3xl">{name}</h2>
        <p className="text-sm text-gray-600 sm:text-base">
          {total} ประกาศที่เปิดอยู่
        </p>
      </div>
    </div>
  );
};

export default CondoCardNearby;

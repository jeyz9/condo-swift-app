import React from "react";

export const CondoCardSkeleton = () => {
  return (
    <div
      className="card bg-base-100 shadow-sm overflow-hidden rounded-[12px] relative animate-pulse"
      style={{ height: "550px" }}
    >
      {/* รูปภาพ (พื้นที่รูป) */}
      <div className="w-full h-full bg-gray-300"></div>

      {/* ส่วนล่าง overlay */}
      <div className="absolute bottom-0 w-full h-[140px] bg-[#0A0A0A50] p-4">
        <div className="ml-2 sm:ml-3 md:ml-5 space-y-2">
          <div className="h-5 w-32 bg-gray-400 rounded"></div>
          <div className="h-5 w-48 bg-gray-400 rounded"></div>

          <div className="flex flex-row justify-between pr-2 mt-2">
            <div className="h-4 w-20 bg-gray-400 rounded"></div>
            <div className="h-4 w-20 bg-gray-400 rounded"></div>
            <div className="h-4 w-20 bg-gray-400 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { IoBedOutline } from "react-icons/io5";
import { PiShower } from "react-icons/pi";
import { BsTextarea } from "react-icons/bs";

export const CondoCard = () => {
  return (
    <div className="card bg-base-100 shadow-sm overflow-hidden rounded-[12px] transition delay-50 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110">
      <div className="absolute right-0 mt-3 mr-3 card-actions justify-end">
        <div className="badge bg-[#28A745] border-none font-bold text-xs sm:text-sm md:text-base px-[9px] py-[2px] text-white rounded-2xl h-[24px] w-auto">คอนโด</div>
        <div className="badge bg-[#28A745] border-none font-bold px-[9px] py-[2px] text-white rounded-2xl  h-[24px] w-auto text-xs sm:text-sm md:text-base">เช่า</div>
      </div>
      <figure className="w-full min-h-[200px]">
        <img
          className="object-cover w-full h-full"
          src="https://thumbs.dreamstime.com/b/vertical-view-white-scandinavian-playroom-tent-teddy-bear-wooden-ladder-beige-blanket-real-photo-130740136.jpg"
          alt="Shoes"
        />
      </figure>
      <div className="absolute bottom-0 items-center justify-center content-center text-center bg-[#0A0A0A43] text-white w-full h-[140px] p-4">
        <div className="ml-2 sm:ml-3 md:ml-5">
        <h2 className="card-title text-xl sm:text-2xl md:text-3xl">
          ฿25,000 /เดือน
        </h2>
        <h2 className="card-title text-lg sm:text-xl md:text-2xl">
          Aspire Rama 9
        </h2>
        
        <div className="flex flex-row  w-full text-base sm:text-lg justify-between pr-2">
        <p className="flex items-center gap-1">
          <IoBedOutline /> 1 ห้องนอน
        </p>
        <p className="flex items-center gap-1">
          <PiShower /> 1 ห้องน้ำ
        </p>
        <p className="flex items-center gap-1">
          <BsTextarea />42.5 ตร.ม.
        </p>
        </div>
        </div>
      </div>
    </div>
  );
};

import React from "react";
import { CardDetails } from "../components/details/CardDetails";
import SalerCard from "../components/details/SalerCard";

export const Detail = () => {
  return (
    <>
      <div className="mt-10 flex justify-center   px-4">
        <CardDetails />
      </div>
      <div className="mt-7 divider w-full max-w-5xl mx-auto px-4"></div>
      <div className="w-full max-w-5xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-[28px] sm:text-[36px] font-bold break-words md:pr-4 flex-1">
            {" "}
            Habitia Proud Prachauthit 72 : ฮาบิเทีย พราวด์ ประชาอุทิศ 72, กรุงเทพ
          </h1>
          <div className="w-full md:w-1/2 md:ml-auto">
            <SalerCard />
            <div className="divider my-4"></div>
          </div>
        </div>
        
        <p className="text-[18px] sm:text-[20px] font-normal mt-2">ทุ่งครุ, ทุ่งครุ, กรุงเทพ</p>
      </div>
    </>
  );
};

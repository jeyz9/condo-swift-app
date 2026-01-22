import React from "react";
import { SalerCardSkeleton } from "../../components/details/SalerCardSkeleton";

export const DetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="mt-10 flex justify-center px-4">
        <div className="skeleton h-[400px] w-full max-w-5xl rounded-lg"></div>
      </div>

      <div className="mt-7 divider w-full max-w-5xl mx-auto px-4"></div>

      <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-[60%_40%] gap-6">
        {/* LEFT SIDE */}
        <div className="min-w-0">
          <div className="skeleton h-9 w-3/4 rounded"></div>
          <div className="skeleton h-6 w-1/2 mt-4 rounded"></div>

          <div className="skeleton h-10 w-48 mt-3 rounded-full"></div>

          {/* BADGES */}
          <div className="mt-7 flex flex-wrap gap-2">
            <div className="skeleton h-6 w-20 rounded-full"></div>
            <div className="skeleton h-6 w-24 rounded-full"></div>
          </div>

          <div className="mt-5 divider"></div>

          {/* PRICE & DETAILS */}
          <div className="flex items-start gap-4">
            <div>
              <div className="skeleton h-5 w-16 rounded"></div>
              <div className="skeleton h-8 w-32 mt-1 rounded"></div>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="flex gap-8 mt-4">
              <div className="flex flex-col items-center gap-1">
                <div className="skeleton h-6 w-6 rounded-full"></div>
                <div className="skeleton h-4 w-20 rounded"></div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="skeleton h-6 w-6 rounded-full"></div>
                <div className="skeleton h-4 w-20 rounded"></div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="skeleton h-6 w-6 rounded-full"></div>
                <div className="skeleton h-4 w-20 rounded"></div>
              </div>
            </div>
          </div>

          <div className="mt-5 divider"></div>

          {/* FACILITIES */}
          <div className="skeleton h-6 w-40 mb-3 rounded"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="skeleton h-5 w-32 rounded"></div>
            <div className="skeleton h-5 w-28 rounded"></div>
            <div className="skeleton h-5 w-36 rounded"></div>
            <div className="skeleton h-5 w-40 rounded"></div>
          </div>

          <div className="divider my-4"></div>

          {/* MAP */}
          <div className="skeleton h-6 w-48 mb-2 rounded"></div>
          <div className="skeleton h-64 w-full rounded-lg"></div>

          <div className="divider my-4"></div>

          {/* MORE INFO */}
          <div className="skeleton h-6 w-36 mb-2 rounded"></div>
          <div className="space-y-2">
            <div className="skeleton h-4 w-full rounded"></div>
            <div className="skeleton h-4 w-full rounded"></div>
            <div className="skeleton h-4 w-3/4 rounded"></div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full">
          <SalerCardSkeleton />
          <div className="divider my-4"></div>
          <div className="flex gap-x-4 mb-5">
            <div className="skeleton h-12 w-32 rounded-full"></div>
            <div className="skeleton h-12 w-32 rounded-full"></div>
          </div>
          <div className="skeleton h-32 w-full rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

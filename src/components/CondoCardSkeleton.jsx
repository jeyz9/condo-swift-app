import React from "react";

export const CondoCardSkeleton = () => {
  return (
    <div className="card relative h-full min-h-[420px] overflow-hidden rounded-[12px] bg-base-100 shadow-sm animate-pulse sm:min-h-[480px]">
      <div className="skeleton h-full w-full"></div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent p-4 sm:p-5">
        <div className="space-y-2">
          <div className="skeleton h-5 w-32"></div>
          <div className="skeleton h-5 w-48"></div>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <div className="skeleton h-4 w-20"></div>
            <div className="skeleton h-4 w-20"></div>
            <div className="skeleton h-4 w-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

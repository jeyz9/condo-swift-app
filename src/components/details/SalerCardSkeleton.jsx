import React from "react";

export const SalerCardSkeleton = () => {
  return (
    <div className="card bg-base-100 w-full shadow-sm border border-gray-200 rounded-2xl relative animate-pulse">
      <div className="absolute top-2 right-2">
        <div className="badge bg-gray-300 h-6 w-28 rounded-full"></div>
      </div>

      <div className="flex items-center gap-4 p-4 sm:p-5">
        <div className="avatar">
          <div className="w-16 sm:w-20 rounded-full bg-gray-300"></div>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-5 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-full"></div>
        </div>
      </div>

      <div className="px-4 sm:px-5 pb-4">
        <div className="h-10 bg-gray-300 rounded-full w-full"></div>
      </div>
    </div>
  );
};

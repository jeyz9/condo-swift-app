import React from "react";
import { IoArrowBack } from "react-icons/io5";
import { MdNotificationsActive } from "react-icons/md";

export const NotificationDetailSkeleton = () => {
  return (
    <div
      className="max-w-2xl mx-auto mt-10 px-6 sm:px-10 py-8 bg-gradient-to-br from-white via-[#f9f7f4] to-[#f3eee9] rounded-2xl shadow-lg border border-[#e8e2da]/50 relative overflow-hidden animate-pulse"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-300" />

      <div className="flex items-center gap-3 mb-6">
        <div className="bg-gray-300/20 p-3 rounded-full">
          <div className="skeleton w-7 h-7 rounded-full"></div>
        </div>
        <div className="skeleton h-7 w-56 rounded"></div>
      </div>

      <div className="space-y-3">
        <div className="skeleton h-6 w-3/4 rounded"></div>
        <div className="skeleton h-4 w-full rounded"></div>
        <div className="skeleton h-4 w-full rounded"></div>
        <div className="skeleton h-4 w-5/6 rounded"></div>
        <div className="skeleton h-4 w-1/2 mt-4 pt-2 rounded"></div>
      </div>

      <div className="mt-8 flex justify-end">
        <div className="skeleton h-12 w-28 rounded-full"></div>
      </div>
    </div>
  );
};

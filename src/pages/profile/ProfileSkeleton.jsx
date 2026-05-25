import React from "react";
import { CondoCardSkeleton } from "../../components/CondoCardSkeleton";

export const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-y-10 animate-pulse">
      <div className="w-full">
        <div className="w-full h-[320px] bg-gray-300" />
        <div className="relative -mt-[100px] flex flex-col gap-6 px-6 sm:flex-row sm:items-end sm:justify-between sm:px-12">
          <div className="flex items-center gap-6 sm:ml-[100px]">
            <div className="h-[180px] w-[180px] rounded-full bg-gray-400 border-4 border-white"></div>
          </div>
          <div className="space-y-3">
            <div className="skeleton h-12 w-64 rounded"></div>
            <div className="skeleton h-4 w-80 rounded"></div>
            <div className="skeleton h-4 w-72 rounded"></div>
          </div>
          <div className="flex justify-start sm:ml-auto sm:justify-start sm:items-center gap-4">
            <div className="skeleton h-8 w-8 rounded-full"></div>
            <div className="skeleton h-12 w-24 rounded-lg"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-y-8 sm:gap-x-20 w-full max-w-6xl rounded-3xl bg-white p-8 border border-gray-200">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-2">
              <div className="skeleton h-9 w-24 rounded"></div>
              <div className="skeleton h-4 w-32 rounded"></div>
              <div className="skeleton h-3 w-40 rounded mt-1"></div>
            </div>
          ))}
        </div>
      </div>

      <section className="w-full max-w-6xl px-6 pb-16">
        <div className="skeleton h-8 w-48 rounded"></div>
        <div className="flex mt-5">
          <div className="skeleton h-12 w-24 rounded-l-xl"></div>
          <div className="skeleton h-12 w-24 rounded-r-xl"></div>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <CondoCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

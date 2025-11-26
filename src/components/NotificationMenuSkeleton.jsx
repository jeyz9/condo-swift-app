import React from "react";

export const NotificationMenuSkeleton = () => {
  return (
    <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <li
          key={i}
          className="flex items-center justify-between px-4 py-3"
        >
          <div className="flex flex-col flex-grow space-y-2">
            <div className="skeleton h-4 w-3/4 rounded"></div>
            <div className="skeleton h-3 w-1/2 rounded"></div>
          </div>
        </li>
      ))}
    </ul>
  );
};

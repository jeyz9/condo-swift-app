import React from "react";

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return [...Array(rows)].map((_, i) => (
    <tr key={i} className="animate-pulse">
      {[...Array(cols)].map((_, j) => (
        <td key={j}>
          <div className="skeleton h-5 w-full bg-gray-200 rounded"></div>
        </td>
      ))}
    </tr>
  ));
};

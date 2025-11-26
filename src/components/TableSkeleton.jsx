import React from "react";

export const TableSkeleton = ({ rows = 5, cols = 8 }) => {
  return (
    <div className="w-full overflow-x-auto animate-pulse">
      <table className="table table-zebra w-full text-sm">
        <thead>
          <tr>
            {[...Array(cols)].map((_, i) => (
              <th key={i}>
                <div className="skeleton h-5 w-full"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <tr key={i}>
              {[...Array(cols)].map((_, j) => (
                <td key={j}>
                  <div className="skeleton h-5 w-full"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

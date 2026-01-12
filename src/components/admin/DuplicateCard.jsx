import React from "react";
import { Link } from "react-router-dom";

const statusStyles = {
  Published: "bg-success text-success-content",
  Pending: "bg-warning text-warning-content",
  Rejected: "bg-error text-error-content",
  Draft: "bg-neutral text-neutral-content",
};

const DuplicateCard = ({ duplicate, isExact = false }) => {
  const similarityPercentage = (duplicate.similarity * 100).toFixed(1);
  const similarityColor = isExact
    ? "text-red-600"
    : similarityPercentage > 80
    ? "text-orange-500"
    : "text-yellow-500";

  return (
    <div className={`p-4 rounded-lg border shadow-sm ${isExact ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
      <div className="flex justify-between items-start">
        <p className="font-semibold text-gray-800 break-all">{duplicate.title}</p>
        <span className={`badge ${statusStyles[duplicate.status] || "badge-ghost"}`}>
          {duplicate.status}
        </span>
      </div>
      <div className="mt-2 flex justify-between items-end">
        <div className="text-sm">
            <p className="font-semibold">
                Similarity:{" "}
                <span className={`font-bold ${similarityColor}`}>{similarityPercentage}%</span>
            </p>
        </div>
        <Link
          to={`/admin/announce/pending/${duplicate.id}`}
          target="_blank"
          className="btn btn-xs btn-outline btn-primary"
        >
          View
        </Link>
      </div>
    </div>
  );
};

export default DuplicateCard;

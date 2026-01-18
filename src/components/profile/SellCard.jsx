import React from "react";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";

const SellCard = ({ announce, onDelete }) => {

  const handleCardClick = (e) => {
    // We only allow navigation to the public detail page if the announcement is approved.
    // Assuming `1` is the ID for "Approved" status.
    if (announce?.approveStatusId !== 1) {
      e.preventDefault();
      Swal.fire({
        icon: 'info',
        title: 'ประกาศยังไม่ได้รับการอนุมัติ',
        text: 'คุณจะสามารถดูหน้ารายละเอียดได้หลังจากที่ประกาศได้รับการอนุมัติแล้ว',
        confirmButtonColor: '#8C6239'
      });
    }
  };

  if (!announce) return null;

  const imageSrc =
    announce?.image ||
    announce?.coverImage ||
    announce?.imageList?.[0]?.imageUrl ||
    "https://placehold.co/600x400?text=No Image";


console.log("announce object =", announce);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(announce.id);
  }


  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/detail/${announce?.id}`} onClick={handleCardClick} className="flex flex-col h-full">
        {/* รูปภาพ */}
        <img
          src={imageSrc}
          alt={announce?.title || "ไม่มีชื่อประกาศ"}
          className="h-44 w-full object-cover"
        />

        {/* เนื้อหา */}
        <div className="flex flex-1 flex-col gap-2 p-4">
          {/* ป้ายประเภท */}
          <span className="inline-flex w-fit rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
            ขาย
          </span>

          {/* ชื่อประกาศ */}
          <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">
            {announce?.title || "ไม่มีชื่อประกาศ"}
          </h3>

          {/* สถานที่ */}
          <p className="line-clamp-2 text-sm text-gray-600">
            {announce?.location || "ไม่ระบุสถานที่"}
          </p>

        </div>
      </Link>
      <div className="flex justify-end gap-2 p-4 pt-0">
          <Link to={`/edit-announce/${announce?.id}`} className="btn btn-ghost btn-sm">
            <FaEdit />
          </Link>
          <button onClick={handleDelete} className="btn btn-ghost btn-sm text-red-500">
            <FaTrash />
          </button>
        </div>
    </article>
  );
};

export default SellCard;

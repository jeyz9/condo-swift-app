import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // ✅ เพิ่ม useLocation

export default function Publish() {
  const location = useLocation(); // ✅ ตรวจ path ปัจจุบัน
  const currentPath = location.pathname;

  const data = [
    { id: 1, name: "Lumpini condo", owner: "Matt Dickerson", date: "13/05/2022", price: 25000, image: "https://placeimg.com/80/80/arch" },
    { id: 2, name: "Dcondo Leaf", owner: "Wiktoria", date: "22/05/2022", price: 88000, image: "https://placeimg.com/80/80/arch" },
    { id: 3, name: "Singapore condo", owner: "Trixie Byrd", date: "15/06/2022", price: 76000, image: "https://placeimg.com/80/80/arch" },
    { id: 4, name: "Supakit condo", owner: "Brad Mason", date: "06/09/2022", price: 81000, image: "https://placeimg.com/80/80/arch" },
    { id: 5, name: "Supalai condo", owner: "Sanderson", date: "25/09/2022", price: 83000, image: "https://placeimg.com/80/80/arch" },
    { id: 6, name: "Supalai condo", owner: "Jun Redfern", date: "04/10/2022", price: 49000, image: "https://placeimg.com/80/80/arch" },
    { id: 7, name: "Siri condo", owner: "Miriam Kidd", date: "17/10/2022", price: 75000, image: "https://placeimg.com/80/80/arch" },
    { id: 8, name: "Plum condo", owner: "Dominic", date: "24/10/2022", price: 31000, image: "https://placeimg.com/80/80/arch" },
    { id: 9, name: "Plam condo", owner: "Shanice", date: "01/11/2022", price: 22000, image: "https://placeimg.com/80/80/arch" },
    { id: 10, name: "Keyboard", owner: "Poppy-Rose", date: "22/11/2022", price: 15000, image: "https://placeimg.com/80/80/arch" },
  ];

  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginated = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="p-6 bg-base-100 rounded-xl shadow-md">
      {/* ✅ Navigation Tabs */}
      <div className="flex gap-6 items-center mb-6 border-b border-gray-200 pb-2">
        <Link
          to="/admin/pending"
          className={`pb-1 font-semibold transition-all ${
            currentPath === "/pending"
              ? "text-[#8C6239] border-b-2 border-[#8C6239]"
              : "text-gray-600 hover:text-[#8C6239]"
          }`}
        >
          ประกาศรอตรวจ
        </Link>

        <Link
          to="/admin/published"
          className={`pb-1 font-semibold transition-all ${
            currentPath === "/published"
              ? "text-[#8C6239] border-b-2 border-[#8C6239]"
              : "text-[#8C6239] hover:text-[#72502e] underline"
          }`}
        >
          เผยแพร่แล้ว
        </Link>

        <Link
          to="/admin/history"
          className={`pb-1 font-semibold transition-all ${
            currentPath === "/history"
              ? "text-[#8C6239] border-b-2 border-[#8C6239]"
              : "text-gray-600 hover:text-[#8C6239]"
          }`}
        >
          ประวัติการตรวจ
        </Link>

        <input
          type="text"
          placeholder="🔍 ค้นหา..."
          className="ml-auto input input-sm input-bordered w-48 focus:border-[#8C6239] focus:outline-none"
        />
      </div>

      {/* ✅ Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-sm">
          <thead className="bg-[#f8f5f1] text-[#8C6239]">
            <tr>
              <th>ID</th>
              <th>อสังหาริมทรัพย์</th>
              <th>ผู้อัปโหลด</th>
              <th>วันที่</th>
              <th className="text-right">ราคา</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((item) => (
              <tr key={item.id} className="hover:bg-[#f7f3ef] transition">
                <td>{item.id}</td>
                <td className="flex items-center gap-3">
                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                  <span className="font-medium">{item.name}</span>
                </td>
                <td>{item.owner}</td>
                <td>{item.date}</td>
                <td className="text-right text-[#8C6239] font-semibold">
                  {item.price.toLocaleString()} ฿
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="btn btn-sm btn-outline border-[#8C6239] text-[#8C6239]"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ◀ ก่อนหน้า
        </button>

        <div className="join">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`join-item btn btn-sm ${
                page === i + 1
                  ? "bg-[#8C6239] text-white"
                  : "btn-outline border-[#8C6239] text-[#8C6239]"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          className="btn btn-sm btn-outline border-[#8C6239] text-[#8C6239]"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          ถัดไป ▶
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AnnounceService from "../services/AnnounceService";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { TableSkeleton } from "../components/TableSkeleton";

export default function Publish() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [announces, setAnnounces] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [ordered, setOrdered] = useState(0);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    fetchAnnounceHistory(keyword, page, size);
  }, [page, keyword]);

  const fetchAnnounceHistory = async (searchKey, pageValue, pageSize) => {
    try {
      setLoading(true);
      const response = await AnnounceService.showAllAnnounceApprove(
        searchKey,
        pageValue,
        pageSize
      );

      const items = response.data.data || [];
      const total = response.data.total || 0;
      const order = pageValue * pageSize;
      setOrdered(order);

      setAnnounces(items);

      const pages = Math.max(1, Math.ceil(total / pageSize));
      setTotalPages(pages);
    } catch (error) {
      console.error("Error fetching announce history", error);
    } finally {
      setLoading(false);
    }
  };

  const triggerSearch = () => {
    setKeyword(search);
    setPage(0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      triggerSearch();
    }
  };

  const clearSearch = () => {
    setSearch("");
    setKeyword("");
    setPage(0);
  };

  return (
    <div className="p-6 bg-base-100 rounded-xl shadow-md">
      <div className="flex gap-6 items-center mb-6 border-b border-gray-200 pb-2">
        <Link
          to="/admin/announce/pending"
          className={`pb-1 font-semibold transition-all ${
            currentPath === "/admin/announce/pending"
              ? "text-[#8C6239] border-b-2 border-[#8C6239]"
              : "text-gray-600 hover:text-[#8C6239]"
          }`}
        >
          รออนุมัติ
        </Link>

        <Link
          to="/admin/announce/published"
          className={`pb-1 font-semibold transition-all ${
            currentPath === "/admin/announce/published"
              ? "text-[#8C6239] border-b-2 border-[#8C6239]"
              : "text-gray-600 hover:text-[#8C6239]"
          }`}
        >
          เผยแพร่แล้ว
        </Link>

        <Link
          to="/admin/announce/history"
          className={`pb-1 font-semibold transition-all ${
            currentPath === "/admin/announce/history"
              ? "text-[#8C6239] border-b-2 border-[#8C6239]"
              : "text-gray-600 hover:text-[#8C6239]"
          }`}
        >
          ประวัติ
        </Link>

        <div className="relative ml-auto w-48">
          <input
            type="text"
            placeholder="ค้นหาประกาศ..."
            className="input input-sm input-bordered w-full pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {search.length > 0 && (
            <button
              onClick={clearSearch}
              className="absolute top-1/2 -translate-y-1/2 right-8 text-gray-400 hover:text-gray-600"
            >
              ล้าง
            </button>
          )}

          <button
            onClick={triggerSearch}
            className="absolute top-1/2 -translate-y-1/2 right-2 text-gray-600 hover:text-gray-800"
          >
            ค้นหา
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading ? (
          <TableSkeleton rows={5} cols={7} />
        ) : announces.length > 0 ? (
          <table className="table table-zebra w-full text-sm">
            <thead className="bg-[#f8f5f1] text-[#8C6239]">
              <tr>
                <th>#</th>
                <th>ประกาศ</th>
                <th>ตัวแทน</th>
                <th>วันที่ลงประกาศ</th>
                <th>ราคา</th>
                <th>วันที่อนุมัติ</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {announces.map((item, index) => (
                <tr key={item.id} className="hover:bg-[#f7f3ef] transition">
                  <td>{ordered + index + 1}</td>
                  <td className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <span className="font-medium">{item.title}</span>
                  </td>
                  <td>{item.agentName}</td>
                  <td>
                    {dayjs(item.announcementDate)
                      .locale("th")
                      .format("DD MMMM YYYY เวลา HH:mm น.")}
                  </td>
                  <td className="text-[#8C6239] font-semibold">
                    {item.price?.toLocaleString()} บาท
                  </td>
                  <td>
                    {dayjs(item.approveDate)
                      .locale("th")
                      .format("DD MMMM YYYY เวลา HH:mm น.")}
                  </td>
                  <td>
                    <button className="btn btn-active btn-warning">
                      ดูรายละเอียด
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-gray-500">
            ไม่พบบันทึกประกาศที่เผยแพร่
          </div>
        )}
      </div>

      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          className="btn btn-sm btn-outline border-[#8C6239] text-[#8C6239]"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          ก่อนหน้า
        </button>

        <div className="join">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`join-item btn btn-sm ${
                page === i
                  ? "bg-[#8C6239] text-white"
                  : "btn-outline border-[#8C6239] text-[#8C6239]"
              }`}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <button
          className="btn btn-sm btn-outline border-[#8C6239] text-[#8C6239]"
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={page + 1 === totalPages}
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
}

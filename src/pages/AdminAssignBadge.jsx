import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { extractErrorMessage } from "../utils/errorUtils";
import AnnounceService from "../services/AnnounceService";

export default function AdminAssignBadge() {
  const [announces, setAnnounces] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");
  const [filterBadge, setFilterBadge] = useState("");

  const [selectedAnnounceId, setSelectedAnnounceId] = useState(null);
  const [selectedBadgeId, setSelectedBadgeId] = useState(null);

  useEffect(() => {
    loadData(keyword, filterBadge);
  }, []);

  const loadData = async (keywordValue = "", badgeFilterValue = "") => {
    try {
      setLoading(true);

      console.log("📡 เรียก API ด้วย:", { keywordValue, badgeFilterValue });

      const resAnn = await AnnounceService.getAllAnnouncesWithBadges(
        keywordValue,
        badgeFilterValue,
        0,
        10
      );

      const resBad = await AnnounceService.getAllBadges();

      setAnnounces(resAnn.data?.data || []);
      setBadges(resBad.data || []);
    } catch (e) {
      Swal.fire("Error", extractErrorMessage(e, "โหลดข้อมูลไม่สำเร็จ"), "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 ใช้กดค้นหา + filter
  const handleSearchFilter = () => {
    loadData(keyword, filterBadge);
  };

  const handleAddBadge = async () => {
    if (!selectedAnnounceId || !selectedBadgeId) {
      Swal.fire("แจ้งเตือน", "กรุณาเลือก badge", "warning");
      return;
    }

    try {
      await AnnounceService.addAnnounceBadge(
        selectedAnnounceId,
        selectedBadgeId
      );

      Swal.fire("สำเร็จ", "เพิ่ม badge แล้ว", "success");
      setSelectedBadgeId(null);
      setSelectedAnnounceId(null);
      await loadData(keyword, filterBadge);
    } catch (e) {
      Swal.fire("ผิดพลาด", extractErrorMessage(e, "เกิดข้อผิดพลาด"), "error");
    }
  };

  const handleRemoveBadge = async (announceId, badgeId) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "ลบ Badge นี้?",
      showCancelButton: true,
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    });

    if (!confirm.isConfirmed) return;

    try {
      await AnnounceService.deleteAnnounceBadge(announceId, badgeId);
      Swal.fire("สำเร็จ", "ลบ badge แล้ว", "success");
      await loadData(keyword, filterBadge);
    } catch (e) {
      Swal.fire("ผิดพลาด", extractErrorMessage(e, "เกิดข้อผิดพลาด"), "error");
    }
  };

  return (
    <div className="p-5 space-y-6">
      <h1 className="text-2xl font-bold">จัดการ Badge ของประกาศ</h1>

      {/* 🔍 ส่วนค้นหา + Filter */}
      <div className="flex gap-3 items-end">
        {/* input keyword */}
        <div className="flex flex-col w-1/3">
          <label className="text-sm font-semibold">ค้นหา</label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="ค้นหาหัวข้อหรือผู้สร้าง..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        {/* filter badge */}
        <div className="flex flex-col w-1/4">
          <label className="text-sm font-semibold">Filter Badge</label>
          <select
            className="select select-bordered"
            value={filterBadge}
            onChange={(e) => setFilterBadge(e.target.value)}
          >
            <option value="">ทั้งหมด</option>
            {badges.map((b) => (
              <option key={b.id} value={b.badgeName}>
                {b.badgeName}
              </option>
            ))}
          </select>
        </div>

        {/* button search */}
        <button
          onClick={handleSearchFilter}
          className="btn bg-[#8C6239] text-white"
        >
          ค้นหา
        </button>

        {/* button reset */}
        <button
          onClick={() => {
            setKeyword("");
            setFilterBadge("");
            loadData("", "");
          }}
          className="btn btn-ghost"
        >
          รีเซ็ต
        </button>
      </div>

      {/* ตารางประกาศ */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>หัวข้อประกาศ</th>
              <th>ผู้สร้าง</th>
              <th>Badges</th>
              <th>จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {announces.map((ann) => (
              <tr key={ann.id}>
                <td>{ann.id}</td>
                <td>{ann.title}</td>
                <td>{ann.agent}</td>

                <td>
                  {ann.badges.length === 0 ? (
                    <span className="text-gray-400">— ไม่มีแบดจ์ —</span>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {ann.badges.map((b) => (
                        <div
                          key={b.id}
                          className="px-2 py-1 bg-yellow-100 rounded-lg border flex items-center gap-2"
                        >
                          <span>{b.badgeName}</span>
                          <span className="text-xs text-gray-500">
                            {b.expiredAt.split("T")[0]}
                          </span>

                          <button
                            className="text-red-500 text-sm"
                            onClick={() => handleRemoveBadge(ann.id, b.id)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </td>

                <td>
                  <button
                    className="btn btn-sm bg-[#8C6239] text-white"
                    onClick={() => setSelectedAnnounceId(ann.id)}
                  >
                    เพิ่ม Badge
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal เพิ่ม Badge */}
      {selectedAnnounceId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h2 className="text-lg font-semibold">
              เพิ่ม Badge ให้ประกาศ #{selectedAnnounceId}
            </h2>

            <select
              className="select select-bordered w-full"
              value={selectedBadgeId || ""}
              onChange={(e) => setSelectedBadgeId(Number(e.target.value))}
            >
              <option value="">เลือก Badge</option>
              {badges.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.badgeName}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                className="btn btn-ghost"
                onClick={() => setSelectedAnnounceId(null)}
              >
                ยกเลิก
              </button>
              <button
                className="btn bg-[#8C6239] text-white"
                onClick={handleAddBadge}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

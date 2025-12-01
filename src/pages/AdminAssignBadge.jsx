import React, { useEffect, useState } from "react";
import { FaPaperclip, FaSave, FaMedal, FaBuilding } from "react-icons/fa";
import Swal from "sweetalert2";
import BadgesService from "../services/BadgesService";

export default function AdminAssignBadge() {
  const [announceId, setAnnounceId] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        const res = await BadgesService.getAllBadges();
        setBadges(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "โหลดรายชื่อแบดจ์ไม่สำเร็จ",
          text: error?.response?.data?.message || error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedAnnounceId = announceId?.toString().trim();
    const parsedBadgeId = badgeId?.toString().trim();

    if (!parsedAnnounceId || !parsedBadgeId) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาระบุ announceId และ badgeId",
      });
      return;
    }

    try {
      setSaving(true);
      await BadgesService.addAnnounceBadge({
        announceId: parsedAnnounceId,
        badgeId: parsedBadgeId,
      });

      Swal.fire({
        icon: "success",
        title: "ผูกแบดจ์ให้ประกาศแล้ว",
      });
      setAnnounceId("");
      setBadgeId("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถผูกแบดจ์ได้",
        text: error?.response?.data?.message || error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-xl p-5">
        <div className="w-12 h-12 rounded-full bg-[#8C6239]/10 flex items-center justify-center text-[#8C6239]">
          <FaPaperclip className="text-xl" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            เพิ่มแบดจ์ให้ประกาศ
          </h1>
          <p className="text-sm text-gray-500">
            ส่งค่า announceId และ badgeId ไปที่ API /api/v1/badges/addAnnounceBadge
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 space-y-5 max-w-3xl"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaBuilding className="text-[#8C6239]" />
              announceId
            </label>
            <input
              type="text"
              inputMode="numeric"
              className="input input-bordered w-full"
              placeholder="กรอก announceId"
              value={announceId}
              onChange={(e) => setAnnounceId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaMedal className="text-[#8C6239]" />
              badgeId
            </label>
            <select
              className="select select-bordered w-full"
              value={badgeId}
              onChange={(e) => setBadgeId(e.target.value)}
              disabled={loading}
            >
              <option value="">เลือกแบดจ์</option>
              {badges.map((b) => (
                <option key={b.id} value={b.id}>
                  #{b.id} - {b.badgeName}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500">
              ถ้าไม่พบแบดจ์ที่ต้องการ ให้เพิ่มจากหน้า “จัดการแบดจ์” ก่อน
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setAnnounceId("");
              setBadgeId("");
            }}
            disabled={saving}
          >
            ล้างฟอร์ม
          </button>
          <button
            type="submit"
            className="btn bg-[#8C6239] hover:bg-[#704c2c] text-white"
            disabled={saving}
          >
            {saving ? "กำลังบันทึก..." : "ผูกแบดจ์ให้ประกาศ"}
          </button>
        </div>
      </form>
    </div>
  );
}

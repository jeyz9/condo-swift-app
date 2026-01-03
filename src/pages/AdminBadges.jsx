import React, { useEffect, useMemo, useState } from "react";
import { FaPlus, FaRegEdit, FaTrash, FaMedal } from "react-icons/fa";
import Swal from "sweetalert2";
import { extractErrorMessage } from "../utils/errorUtils";
import AnnounceService from "../services/AnnounceService";

const defaultForm = { id: null, badgeName: "" };

const AdminBadges = () => {
  const [badges, setBadges] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");

  const filteredBadges = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return badges;
    return badges.filter((b) =>
      (b.badgeName || "").toLowerCase().includes(keyword)
    );
  }, [badges, search]);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      setLoading(true);
      const res = await AnnounceService.getAllBadges();
      setBadges(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ดึงข้อมูลแบดจ์ไม่สำเร็จ",
        text: extractErrorMessage(error, "ไม่สามารถโหลดแบดจ์ได้"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = form.badgeName.trim();
    if (!name) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกชื่อแบดจ์",
      });
      return;
    }

    try {
      setSaving(true);
      if (form.id) {
        await AnnounceService.updateBadge(form.id, { badgeName: name });
        Swal.fire({
          icon: "success",
          title: "อัปเดตแบดจ์เรียบร้อย",
        });
      } else {
        await AnnounceService.addBadge({ badgeName: name });
        Swal.fire({
          icon: "success",
          title: "เพิ่มแบดจ์สำเร็จ",
        });
      }

      setForm(defaultForm);
      await fetchBadges();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "บันทึกไม่สำเร็จ",
        text: extractErrorMessage(error, "เกิดข้อผิดพลาดขณะบันทึก"),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (badge) => {
    setForm({ id: badge.id, badgeName: badge.badgeName || "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (badge) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "ยืนยันการลบ?",
      text: `ต้องการลบแบดจ์ "${badge.badgeName}" หรือไม่`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonText: "ยกเลิก",
      confirmButtonText: "ลบ",
    });

    if (!confirm.isConfirmed) return;

    try {
      await AnnounceService.deleteBadge(badge.id);
      Swal.fire({
        icon: "success",
        title: "ลบแบดจ์แล้ว",
      });
      await fetchBadges();
      if (form.id === badge.id) {
        setForm(defaultForm);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ลบไม่สำเร็จ",
        text: extractErrorMessage(error, "เกิดข้อผิดพลาดขณะลบ"),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-xl p-5">
        <div className="w-12 h-12 rounded-full bg-[#8C6239]/10 flex items-center justify-center text-[#8C6239]">
          <FaMedal className="text-xl" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">จัดการแบดจ์</h1>
          <p className="text-sm text-gray-500">
            เพิ่ม แก้ไข หรือลบชื่อแบดจ์ที่ใช้ติดประกาศบนเว็บไซต์
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <FaPlus className="text-[#8C6239]" />
              <span className="font-semibold">
                {form.id ? "แก้ไขแบดจ์" : "เพิ่มแบดจ์ใหม่"}
              </span>
            </div>
            {form.id && (
              <button
                type="button"
                className="text-sm text-[#8C6239] underline"
                onClick={() => setForm(defaultForm)}
              >
                ล้างฟอร์ม
              </button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              ชื่อแบดจ์
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="เช่น แนะนำ, พรีเมียม, มาใหม่"
              value={form.badgeName}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, badgeName: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setForm(defaultForm)}
              disabled={saving}
            >
              รีเซ็ต
            </button>
            <button
              type="submit"
              className="btn bg-[#8C6239] hover:bg-[#704c2c] text-white"
              disabled={saving}
            >
              {saving
                ? "กำลังบันทึก..."
                : form.id
                ? "อัปเดตแบดจ์"
                : "เพิ่มแบดจ์"}
            </button>
          </div>
        </form>

        <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <p className="font-semibold text-gray-800">รายการแบดจ์</p>
              <p className="text-sm text-gray-500">
                ทั้งหมด {badges.length} รายการ
              </p>
            </div>
            <div className="sm:ml-auto w-full sm:w-64">
              <input
                type="text"
                placeholder="ค้นหาแบดจ์"
                className="input input-bordered w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10 text-gray-500">
                กำลังโหลด...
              </div>
            ) : filteredBadges.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                ไม่พบแบดจ์ที่ตรงกับคำค้นหา
              </div>
            ) : (
              <table className="table w-full">
                <thead className="bg-[#f8f5f1] text-[#8C6239]">
                  <tr>
                    <th>ชื่อแบดจ์</th>
                    <th>จำนวนประกาศที่ติด</th>
                    <th className="w-28 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBadges.map((badge) => (
                    <tr key={badge.id} className="hover:bg-[#f7f3ef]">
                      <td className="font-semibold text-gray-800">
                        {badge.badgeName}
                      </td>
                      <td className="text-gray-600">
                        {badge.totalAnnounce ?? 0} รายการ
                      </td>
                      <td className="flex items-center gap-3 justify-end">
                        <button
                          className="btn btn-ghost btn-xs text-[#8C6239]"
                          onClick={() => handleEdit(badge)}
                        >
                          <FaRegEdit className="mr-1" />
                          แก้ไข
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-red-600"
                          onClick={() => handleDelete(badge)}
                        >
                          <FaTrash className="mr-1" />
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBadges;

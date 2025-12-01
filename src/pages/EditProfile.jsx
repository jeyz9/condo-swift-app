import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthContext } from "../context/AuthContext";
import UserService from "../services/UserService";

const initialForm = {
  name: "",
  description: "",
  phone: "",
  email: "",
  lineId: "",
};

export default function EditProfile() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.userId) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบ",
        text: "ต้องเข้าสู่ระบบก่อนแก้ไขโปรไฟล์",
      }).then(() => navigate("/profile"));
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const res = await UserService.profilePublic(user.userId, "เช่า");
        const data = res?.data || {};
        const fallbackEmail = user?.email || user?.username || "";
        const fallbackPhone = user?.phone || "";
        const fallbackLine = user?.lineId || "";
        setForm({
          name: data.name || "",
          description: data.description || "",
          phone: data.phone || fallbackPhone,
          email: data.email || fallbackEmail,
          lineId: data.lineId || fallbackLine,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "โหลดข้อมูลโปรไฟล์ไม่สำเร็จ",
          text: error?.response?.data?.message || error.message,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.userId) return;

    try {
      setSaving(true);
      await UserService.editProfile(form);
      Swal.fire({
        icon: "success",
        title: "บันทึกโปรไฟล์เรียบร้อย",
      }).then(() => navigate("/profile"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "บันทึกไม่สำเร็จ",
        text: error?.response?.data?.message || error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px] text-gray-500">
        กำลังโหลด...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="bg-white shadow-sm border border-gray-100 rounded-2xl p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">แก้ไขโปรไฟล์</h1>
          <p className="text-sm text-gray-500">
            ปรับข้อมูลติดต่อและคำอธิบายที่จะแสดงบนหน้าโปรไฟล์ของคุณ
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">ชื่อ</span>
              </div>
              <input
                type="text"
                name="name"
                className="input input-bordered w-full"
                placeholder="ชื่อที่จะแสดง"
                value={form.name}
                onChange={handleChange}
              />
            </label>

            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">อีเมล</span>
              </div>
              <input
                type="email"
                name="email"
                className="input input-bordered w-full"
                placeholder="you@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </label>
          </div>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">เบอร์โทร</span>
            </div>
            <input
              type="tel"
              name="phone"
              className="input input-bordered w-full"
              placeholder="เช่น 0891234567"
              value={form.phone}
              onChange={handleChange}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">Line ID</span>
            </div>
            <input
              type="text"
              name="lineId"
              className="input input-bordered w-full"
              placeholder="เช่น condo_agent"
              value={form.lineId}
              onChange={handleChange}
            />
          </label>

          <label className="form-control w-full">
            <div className="label">
              <span className="label-text">คำอธิบาย</span>
            </div>
            <textarea
              name="description"
              className="textarea textarea-bordered w-full"
              placeholder="แนะนำตัวหรือบอกบริการของคุณ"
              rows="4"
              value={form.description}
              onChange={handleChange}
            />
          </label>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => navigate("/profile")}
              disabled={saving}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn bg-[#8C6239] hover:bg-[#704c2c] text-white"
              disabled={saving}
            >
              {saving ? "กำลังบันทึก..." : "บันทึกโปรไฟล์"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

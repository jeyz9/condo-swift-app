import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { User, FileText, Phone, Mail, MessageSquare } from 'lucide-react';

const MySwal = withReactContent(Swal);

const EditProfilePopup = ({ onClose, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    lineId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await UserService.showUserDetails();
        if (res.status === 200) {
          setFormData({
            name: res.data.name || '',
            description: res.data.description || '',
            phone: res.data.phone || '',
            email: res.data.email || '',
            lineId: res.data.lineId || '',
          });
        }
      } catch (err) {
        MySwal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: err.response?.data?.message || 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้',
        });
      } finally {
        setIsFetching(false);
      }
    };
    fetchUserDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await UserService.editProfile(formData);
      if (res.status === 200) {
        MySwal.fire({
          icon: 'success',
          title: 'บันทึกข้อมูลสำเร็จ',
          showConfirmButton: false,
          timer: 1500,
        });
        onProfileUpdate(formData);
        onClose();
      }
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: err.response?.data?.message || 'ไม่สามารถบันทึกข้อมูลได้',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">แก้ไขโปรไฟล์</h2>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-xs"
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="ชื่อ"
              value={formData.name}
              onChange={handleChange}
              className="w-full input input-bordered input-sm pl-10"
              required
            />
          </div>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <textarea
              name="description"
              placeholder="คำอธิบาย"
              value={formData.description}
              onChange={handleChange}
              className="w-full textarea textarea-bordered textarea-sm pl-10"
              rows="3"
            ></textarea>
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="tel"
              name="phone"
              placeholder="เบอร์โทรศัพท์"
              value={formData.phone}
              onChange={handleChange}
              className="w-full input input-bordered input-sm pl-10"
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="อีเมล"
              value={formData.email}
              onChange={handleChange}
              className="w-full input input-bordered input-sm pl-10"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
            />
          </div>
          <div className="relative">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="lineId"
              placeholder="Line ID"
              value={formData.lineId}
              onChange={handleChange}
              className="w-full input input-bordered input-sm pl-10"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-ghost"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="btn btn-sm btn-primary"
              disabled={isLoading}
            >
              {isLoading ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePopup;

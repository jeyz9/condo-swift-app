import React, { useState, useEffect } from 'react';
import UserService from '../../services/UserService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { User, FileText, Phone, Mail, MessageSquare } from 'lucide-react';
import { extractErrorMessage } from '../../utils/errorUtils';
import { useAuthContext } from '../../context/AuthContext';

import { motion, AnimatePresence } from 'framer-motion';

const MySwal = withReactContent(Swal);

const EditProfilePopup = ({ onClose, onProfileUpdate }) => {
  const { logout } = useAuthContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    lineId: '',
  });
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await UserService.showUserDetails();
        if (res.status === 200) {
          const nextData = {
            name: res.data.name || '',
            description: res.data.description || '',
            phone: res.data.phone || '',
            email: res.data.email || '',
            lineId: res.data.lineId || '',
          };
          setFormData(nextData);
          setInitialData(nextData);
        }
      } catch (err) {
        MySwal.fire({
          icon: 'error',
          title: 'เกิดข้อผิดพลาด',
          text: extractErrorMessage(err, 'ไม่สามารถโหลดข้อมูลผู้ใช้ได้'),
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
    const emailChanged = initialData ? formData.email !== initialData.email : false;
    const phoneChanged = initialData ? formData.phone !== initialData.phone : false;
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
        if (emailChanged || phoneChanged) {
          logout();
          window.location.href = '/';
          return;
        }
        onClose();
      }
    } catch (err) {
      MySwal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: extractErrorMessage(err, 'ไม่สามารถบันทึกข้อมูลได้'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const backdropVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  };

  const popupVariant = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut" },
    },
    exit: { opacity: 0, scale: 0.85, y: -20, transition: { duration: 0.25 } },
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
        variants={backdropVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
      />
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        variants={popupVariant}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto relative">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              แก้ไขโปรไฟล์
            </h2>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
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
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none pl-10"
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
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none pl-10"
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
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none pl-10"
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
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none pl-10"
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
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none pl-10"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="btn bg-[#8C6239] text-white hover:bg-[#7d5a32]"
                disabled={isLoading}
              >
                {isLoading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProfilePopup;

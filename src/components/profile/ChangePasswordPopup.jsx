import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { extractErrorMessage } from '../../utils/errorUtils';
import { useAuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const MySwal = withReactContent(Swal);

const ChangePasswordPopup = ({ onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      MySwal.fire({
        icon: 'warning',
        title: 'รหัสผ่านไม่ตรงกัน',
        text: 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน',
        confirmButtonText: 'ตกลง',
      });
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.changePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      logout();
      
      MySwal.fire({
        icon: 'success',
        title: 'เปลี่ยนรหัสผ่านสำเร็จ!',
        text: 'รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว กรุณาเข้าสู่ระบบใหม่',
        confirmButtonText: 'ตกลง',
      }).then(() => {
        window.location.href = '/login';
        onClose(); // Close the popup after the user clicks OK
      });

      // Clear form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      MySwal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: extractErrorMessage(error, 'ไม่สามารถเปลี่ยนรหัสผ่านได้'),
        confirmButtonText: 'ตกลง',
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
            <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              เปลี่ยนรหัสผ่าน
            </h2>
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                รหัสผ่านเก่า
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none [&::-ms-reveal]:hidden"
                  placeholder="รหัสผ่านเก่า"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                >
                  {showOldPassword ? "ซ่อน" : "แสดง"}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                รหัสผ่านใหม่
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none [&::-ms-reveal]:hidden"
                  placeholder="รหัสผ่านใหม่"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                >
                  {showNewPassword ? "ซ่อน" : "แสดง"}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                อย่างน้อย 8 ตัวอักษร
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ยืนยันรหัสผ่านใหม่
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none [&::-ms-reveal]:hidden"
                  placeholder="ยืนยันรหัสผ่านใหม่"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-sm text-gray-600"
                >
                  {showConfirmPassword ? "ซ่อน" : "แสดง"}
                </button>
              </div>
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
                {isLoading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "บันทึกการเปลี่ยนแปลง"
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChangePasswordPopup;
import React, { useState } from 'react';
import AuthService from '../../services/AuthService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import { extractErrorMessage } from '../../utils/errorUtils';
import { useAuthContext } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const MySwal = withReactContent(Swal);

const ChangePasswordForm = () => {
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
        text: 'โปรดตรวจสอบรหัสผ่านใหม่อีกครั้ง',
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
      MySwal.fire({
        icon: 'success',
        title: 'เปลี่ยนรหัสผ่านสำเร็จ!',
        text: 'กรุณาเข้าสู่ระบบอีกครั้งด้วยรหัสผ่านใหม่',
        confirmButtonText: 'ตกลง',
      }).then(() => {
        logout(); // Force logout as backend deletes token
        navigate('/login'); // Redirect to login page
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

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">เปลี่ยนรหัสผ่าน</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Old Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">รหัสผ่านเก่า</label>
          <div className="relative">
            <input
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8C6239] focus:border-[#8C6239] pr-10"
              required
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowOldPassword(!showOldPassword)}
            >
              {showOldPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-500" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-500" />
              )}
            </span>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">รหัสผ่านใหม่</label>
          <div className="relative">
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8C6239] focus:border-[#8C6239] pr-10"
              required
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-500" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-500" />
              )}
            </span>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">ยืนยันรหัสผ่านใหม่</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#8C6239] focus:border-[#8C6239] pr-10"
              required
            />
            <span
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="h-5 w-5 text-gray-500" />
              ) : (
                <FaEye className="h-5 w-5 text-gray-500" />
              )}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8C6239] hover:bg-[#6f4f2e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8C6239]"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'เปลี่ยนรหัสผ่าน'
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;



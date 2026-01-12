import React, { useState } from 'react';
import AuthService from '../../services/AuthService';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import { extractErrorMessage } from '../../utils/errorUtils';
import { useAuthContext } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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

  return (
    <div className="fixed inset-0 backdrop-blur-xl bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
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
                onClick={(e) => { e.preventDefault(); setShowOldPassword(!showOldPassword); }}
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
                onClick={(e) => { e.preventDefault(); setShowNewPassword(!showNewPassword); }}
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
                onClick={(e) => { e.preventDefault(); setShowConfirmPassword(!showConfirmPassword); }}
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
            className="btn w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8C6239] hover:bg-[#6f4f2e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8C6239]"
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
    </div>
  );
};

export default ChangePasswordPopup;
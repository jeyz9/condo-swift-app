import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { extractErrorMessage } from '../utils/errorUtils';

function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setMessage('Token not found in URL.');
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่พบ Token สำหรับรีเซ็ตรหัสผ่านใน URL',
        confirmButtonText: 'ตกลง',
      }).then(() => {
        navigate('/'); // Redirect to home or login if no token
      });
    }
  }, [location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setMessage('Reset token is missing.');
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่พบ Token สำหรับรีเซ็ตรหัสผ่าน',
        confirmButtonText: 'ตกลง',
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      Swal.fire({
        icon: 'warning',
        title: 'รหัสผ่านไม่ตรงกัน',
        text: 'รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน',
        confirmButtonText: 'ตกลง',
      });
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.resetPassword(token, newPassword, confirmPassword);
      setMessage('Password has been reset successfully!');
      
      AuthService.logout();

      Swal.fire({
        icon: 'success',
        title: 'รีเซ็ตรหัสผ่านสำเร็จ!',
        text: 'รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว กรุณาเข้าสู่ระบบใหม่',
        confirmButtonText: 'ตกลง',
      }).then(() => {
        window.location.href = '/';
      });
    } catch (error) {
      setMessage(extractErrorMessage(error, "เกิดข้อผิดพลาดที่ไม่คาดคิด"));
      Swal.fire({
        icon: 'error',
        title: 'รีเซ็ตรหัสผ่านไม่สำเร็จ',
        text: extractErrorMessage(error, "เกิดข้อผิดพลาดที่ไม่คาดคิด"),
        confirmButtonText: 'ตกลง',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">รีเซ็ตรหัสผ่าน</h1>
        {message && (
          <p className={`mb-4 text-center ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
        {token ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">รหัสผ่านใหม่</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
            <div>
              <label className="block text-sm font-medium text-gray-700">ยืนยันรหัสผ่านใหม่</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                'รีเซ็ตรหัสผ่าน'
              )}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-500">กำลังตรวจสอบ Token...</p>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;

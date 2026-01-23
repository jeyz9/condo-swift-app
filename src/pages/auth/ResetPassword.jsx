import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import Swal from 'sweetalert2';
import { extractErrorMessage } from '../../utils/errorUtils';

export const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = passwords;

    if (!newPassword || !confirmPassword) {
      Swal.fire('ข้อมูลไม่ครบถ้วน', 'กรุณากรอกข้อมูลให้ครบ', 'warning');
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire('รหัสผ่านไม่ตรงกัน', 'รหัสผ่านใหม่และการยืนยันไม่ตรงกัน', 'error');
      return;
    }

    if (!token) {
      Swal.fire('Token ไม่ถูกต้อง', 'ไม่พบ token สำหรับการรีเซ็ตรหัสผ่าน', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.resetPassword(token, newPassword, confirmPassword);
      Swal.fire({
        icon: 'success',
        title: 'รีเซ็ตรหัสผ่านสำเร็จ',
        text: 'คุณสามารถใช้รหัสผ่านใหม่เพื่อเข้าสู่ระบบได้แล้ว',
      }).then(() => {
        navigate('/');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'รีเซ็ตรหัสผ่านไม่สำเร็จ',
        text: extractErrorMessage(error, "เกิดข้อผิดพลาดที่ไม่คาดคิด"),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">รีเซ็ตรหัสผ่าน</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">รหัสผ่านใหม่</label>
            <div className="relative">
              <input
                type='password'
                name="newPassword"
                value={passwords.newPassword}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none"
                placeholder="รหัสผ่านใหม่"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">ยืนยันรหัสผ่านใหม่</label>
            <div className="relative">
              <input
                type='password'
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8C6239] focus:outline-none"
                placeholder="ยืนยันรหัสผ่านใหม่"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full btn bg-[#8C6239] hover:bg-[#6f4f2e] text-white font-semibold py-2 rounded-lg transition"
            disabled={isLoading}
          >
            {isLoading ? 'กำลังดำเนินการ...' : 'รีเซ็ตรหัสผ่าน'}
          </button>
        </form>
      </div>
    </div>
  );
};

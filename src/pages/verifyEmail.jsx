import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const effectRan = useRef(false);

  const [status, setStatus] = useState('pending'); // pending | success | error
  const [message, setMessage] = useState('กำลังยืนยันอีเมลของคุณ...');
  console.log("token is :", token)
  useEffect(() => {
    if (effectRan.current === true) {
      return;
    }

    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('ไม่พบโทเค็นสำหรับยืนยันอีเมล');
        return;
      }

      try {
        setStatus('pending');
        const res = await AuthService.verifyEmail(token);
        if (res.status === 200 || res.status === 201) {
          setStatus('success');
          setMessage('ยืนยันอีเมลเรียบร้อยแล้ว คุณสามารถกลับไปยังหน้าหลักได้เลย');
        } else {
          throw new Error(res?.data?.message || 'ไม่สามารถยืนยันอีเมลได้');
        }
      } catch (error) {
        const fallback = 'ไม่สามารถยืนยันอีเมลได้ โปรดลองอีกครั้งหรือติดต่อผู้ดูแลระบบ';
        const errorMsg =
          error?.response?.data?.message ||
          error?.response?.data ||
          error?.message ||
          fallback;
        setStatus('error');
        setMessage(errorMsg);
      }
    };

    verify();

    return () => {
      effectRan.current = true;
    }
  }, [token]);

  const isPending = status === 'pending';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 space-y-4 border border-gray-100">
        <div className="text-center space-y-3">
          <div className="text-2xl font-semibold text-gray-800">ยืนยันอีเมล</div>
          <p className="text-sm text-gray-600">{message}</p>
        </div>

        <div className="flex items-center justify-center py-2">
          {isPending && <span className="loading loading-spinner loading-md text-[#8C6239]" aria-label="กำลังยืนยัน" />}
          {isSuccess && (
            <div className="badge badge-success gap-2 px-4 py-3 text-white text-sm font-medium border-none">
              ✓ สำเร็จ
            </div>
          )}
          {isError && (
            <div className="badge badge-error gap-2 px-4 py-3 text-white text-sm font-medium border-none">
              ! ไม่สำเร็จ
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => navigate(-1)}
          >
            ย้อนกลับ
          </button>
          <button
            type="button"
            className="btn bg-[#8C6239] text-white hover:bg-[#704e2e] border-none"
            onClick={() => navigate('/')}
          >
            ไปหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

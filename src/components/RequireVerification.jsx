import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import UserService from '../services/UserService';
import Swal from 'sweetalert2';

const RequireVerification = ({ children }) => {
  const { user } = useAuthContext();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.userId) {
      UserService.profilePublic(user.userId)
        .then((res) => {
          if (res.status === 200) {
            setProfile(res.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch profile:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user?.userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    Swal.fire({
      icon: 'info',
      title: 'กรุณาเข้าสู่ระบบ',
      text: 'คุณต้องเข้าสู่ระบบเพื่อเข้าถึงหน้านี้',
      confirmButtonText: 'ตกลง',
    });
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!profile || !profile.emailVerified || !profile.phoneVerified) {
    Swal.fire({
      icon: 'warning',
      title: 'คุณยังไม่ได้ยืนยันตัวตน',
      text: 'กรุณายืนยันตัวตนทั้งอีเมลและเบอร์โทรศัพท์ก่อนเข้าถึงหน้านี้',
      confirmButtonText: 'ไปที่หน้าโปรไฟล์',
      showCancelButton: true,
      cancelButtonText: 'กลับหน้าหลัก',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = '/profile';
      } else {
        window.location.href = '/';
      }
    });
    return null; 
  }

  return children;
};

export default RequireVerification;

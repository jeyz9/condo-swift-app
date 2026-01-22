import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import LoginPopup from "../../components/login/LoginPopup";
import { useAuthContext } from "../../context/AuthContext";

export default function Forbidden() {
  const location = useLocation();
  const [loginOpen, setLoginOpen] = useState(false);
  const { user } = useAuthContext();

  const reason = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("reason");
  }, [location.search]);

  const isUnauthenticated = !user || reason === "unauthenticated";

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-[#f9f5f0] to-white px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-[#e9dfd4] max-w-xl w-full p-8 space-y-6 text-center">
        <div className="text-5xl">🚫</div>
        <h1 className="text-2xl font-semibold text-gray-800">Access denied</h1>
        <p className="text-gray-600">
          {isUnauthenticated
            ? "กรุณาเข้าสู่ระบบก่อนเพื่อเข้าถึงหน้านี้"
            : "คุณไม่มีสิทธิ์เข้าถึงหน้าผู้ดูแลระบบ"}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="btn btn-outline border-[#8C6239] text-[#8C6239] hover:bg-[#8C6239] hover:text-white"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>

      <LoginPopup isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}

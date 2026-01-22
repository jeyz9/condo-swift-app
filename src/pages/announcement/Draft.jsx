import React, { useEffect, useState } from "react";
import { DraftCard } from "../../components/DraftCard";
import { CondoCardSkeleton } from "../../components/CondoCardSkeleton";
import Swal from "sweetalert2";
import AnnounceService from "../../services/AnnounceService.js";
import { extractErrorMessage } from "../../utils/errorUtils.js";

const Draft = () => {
  const [draft, setDraft] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDraft = async () => {
      try {
        setLoading(true);
        const response = await AnnounceService.showAllAnnounceDraft();
        if (response?.data) {
          setDraft(response?.data);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: extractErrorMessage(error, "ไม่สามารถโหลดรายแบบร่างได้"),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDraft();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ประกาศของฉัน</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <CondoCardSkeleton key={i} />
          ))}
        </div>
      ) : draft.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {draft.map((announce) => (
            <DraftCard key={announce.id} announce={announce} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>คุณยังไม่มีประกาศ แบบร่าง และ ประกาศที่ตีกลับ  </p>
        </div>
      )}
    </div>
  );
};

export default Draft;

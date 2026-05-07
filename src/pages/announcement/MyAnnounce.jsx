import React, { useEffect, useState } from "react";
import { AnnounceCard } from "../../components/AnnounceCard.jsx";
import { CondoCardSkeleton } from "../../components/CondoCardSkeleton.jsx";
import Swal from "sweetalert2";
import AnnounceService from "../../services/AnnounceService.js";
import { extractErrorMessage } from "../../utils/errorUtils.js";
import { AgentAnnounceCard } from "../../components/AgentAnnounceCard.jsx";

const MyAnnounce = () => {
  const [draft, setDraft] = useState([]);
  const [managedAnnounces, setManagedAnnounces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [draftResponse, managedResponse] = await Promise.all([
          AnnounceService.showAllAnnounceDraft(),
          AnnounceService.getMyManagedAnnounces(),
        ]);

        if (draftResponse?.data) {
          setDraft(draftResponse.data);
        }

        if (managedResponse?.data) {
          setManagedAnnounces(managedResponse.data);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: extractErrorMessage(error, "ไม่สามารถโหลดข้อมูลประกาศได้"),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const hasDraft = draft.length > 0;
  const hasManaged = managedAnnounces.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* ================= Draft Section ================= */}
      {loading ? (
        <div>
          <div className="mb-6 h-8 w-52 animate-pulse rounded bg-gray-200" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <CondoCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        hasDraft && (
          <section>
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  ประกาศของฉัน
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  แบบร่าง และ ประกาศที่ถูกตีกลับ
                </p>
              </div>

              <div className="rounded-full bg-[#8C6239]/10 px-4 py-2 text-sm font-medium text-[#8C6239]">
                {draft.length} รายการ
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {draft.map((announce) => (
                <AnnounceCard key={announce.id} announce={announce} />
              ))}
            </div>
          </section>
        )
      )}

      {/* ================= Managed Section ================= */}
      {loading ? (
        <div>
          <div className="mb-6 h-8 w-52 animate-pulse rounded bg-gray-200" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <CondoCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : (
        hasManaged && (
          <section>
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  ประกาศที่ต้องดูแล
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  ประกาศที่ได้รับมอบหมายให้ดูแล
                </p>
              </div>

              <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                {managedAnnounces.length} รายการ
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {managedAnnounces.map((announce) => (
                <AgentAnnounceCard
                  key={announce.id}
                  announce={announce}
                  onCancelSuccess={(announceAgentId) => {
                    setManagedAnnounces((prev) =>
                      prev.filter((item) => item.id !== announceAgentId),
                    );
                  }}
                />
              ))}
            </div>
          </section>
        )
      )}

      {/* ================= Empty State ================= */}
      {!loading && !hasDraft && !hasManaged && (
        <div className="py-20 text-center text-gray-500">
          <p className="text-lg">คุณยังไม่มีประกาศ หรือ ประกาศที่ต้องดูแล</p>
        </div>
      )}
    </div>
  );
};

export default MyAnnounce;

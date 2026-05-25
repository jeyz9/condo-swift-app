import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import AnnounceService from "../services/AnnounceService";
import { extractErrorMessage } from "../utils/errorUtils";

const permissions = [
  {
    value: "VIEW_ONLY",
    label: "ดูประกาศเท่านั้น",
  },
  {
    value: "EDIT_CONTENT",
    label: "แก้ไขเนื้อหา",
  },
  {
    value: "FULL_ACCESS",
    label: "สิทธิ์เต็มรูปแบบ",
  },
];

export const AgentManageModal = ({ announceId, isOpen, onClose }) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (isOpen && announceId) {
      fetchAgents();
    }
  }, [isOpen, announceId]);

  const fetchAgents = async () => {
    try {
      setLoading(true);

      const response = await AnnounceService.getAgentsByAnnounce(announceId);

      setAgents(response.data || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: extractErrorMessage(error, "ไม่สามารถโหลดตัวแทนได้"),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (announceAgentId) => {
    try {
      await AnnounceService.revokeAgent(announceAgentId);
      setAgents((prev) =>
        prev.filter((agent) => agent.announceAgentId !== announceAgentId),
      );
      Swal.fire({
        icon: "success",
        title: "ถอดสิทธิ์ตัวแทนสำเร็จ",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: extractErrorMessage(error, "ไม่สามารถถอดสิทธิ์ตัวแทนได้"),
      });
    }
  };

  const handleApprove = async (announceAgentId, permission) => {
    try {
      await AnnounceService.approveAgent(announceAgentId, {
        permission,
      });
      setAgents((prev) =>
        prev.map((agent) =>
          agent.announceAgentId === announceAgentId
            ? {
                ...agent,
                permission,
              }
            : agent,
        ),
      );
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: extractErrorMessage(error, "ไม่สามารถอนุมัติตัวแทนได้"),
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-0 w-full max-w-lg relative border border-gray-200 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] rounded-t-2xl">
          <h2 className="text-lg sm:text-xl font-bold text-[#8C6239]">
            จัดการตัวแทน
          </h2>
          <button
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition text-2xl text-gray-500"
            onClick={onClose}
            aria-label="ปิด"
          >
            <span className="leading-none">×</span>
          </button>
        </div>
        {/* Content */}
        <div className="px-6 py-5">
          {loading ? (
            <div className="flex flex-col items-center py-10 text-[#8C6239]">
              <svg
                className="animate-spin h-7 w-7 mb-2 text-[#8C6239]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              กำลังโหลดข้อมูลตัวแทน...
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              ไม่มีตัวแทนในประกาศนี้
            </div>
          ) : (
            <ul className="space-y-4">
              {agents.map((agent) => (
                <li
                  key={agent.id}
                  className="border border-gray-200 rounded-xl p-4 flex flex-col gap-2 bg-gray-50"
                >
                  <div className="font-semibold text-[#404040] text-base flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#8C6239] mr-2"></span>
                    {agent.name}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <span className="text-sm text-gray-600">สิทธิ์:</span>
                    <select
                      className="border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#8C6239] focus:border-[#8C6239] transition"
                      value={(() => {
                        if (!agent.permission) return "";
                        const perm = String(agent.permission).toUpperCase();
                        const found = permissions.find((p) => p.value === perm);
                        return found ? found.value : "";
                      })()}
                      onChange={(e) =>
                        handleApprove(agent.announceAgentId, e.target.value)
                      }
                    >
                      <option value="">เลือกสิทธิ์</option>
                      {permissions.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    <button
                      className="cursor-pointer ml-0 sm:ml-3 mt-2 sm:mt-0 px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition text-sm font-medium"
                      onClick={() => handleRevoke(agent.announceAgentId)}
                      type="button"
                    >
                      ถอดสิทธิ์
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] rounded-b-2xl flex justify-end">
          <button
            className="btn rounded-full border-gray-700 px-6 bg-[#8C6239] text-white hover:bg-[#704c2c] font-semibold shadow"
            onClick={onClose}
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};

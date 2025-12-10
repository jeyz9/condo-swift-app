import React, { useMemo, useState } from "react";
import NotificationService from "../services/NotificationService";
import Swal from "sweetalert2";
import { FaBell, FaPaperPlane, FaUserFriends } from "react-icons/fa";

export default function SendNotification() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [rawUserIds, setRawUserIds] = useState("");
  const [sendType, setSendType] = useState("");
  const [loading, setLoading] = useState(false);

  // parse comma separated IDs -> number[] | empty | invalid
  const parsedUserIds = useMemo(() => {
    const ids = rawUserIds
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (ids.length === 0) return { type: "empty", value: [] };

    const numbers = ids.map((id) => Number(id));
    if (numbers.some((n) => Number.isNaN(n))) {
      return { type: "invalid", value: [] };
    }

    return { type: "valid", value: numbers };
  }, [rawUserIds]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      Swal.fire({
        icon: "warning",
        title: "ต้องกรอก Title และ Message",
      });
      return;
    }

    if (!sendType.trim()) {
      Swal.fire({
        icon: "warning",
        title: "ต้องระบุ sendType",
        text: "เลือก ALL หรือ SELECTED",
      });
      return;
    }

    const requiresUserIds = sendType === "SELECTED";

    if (requiresUserIds && parsedUserIds.type === "empty") {
      Swal.fire({
        icon: "warning",
        title: "ต้องระบุ userIds (ตัวเลขอย่างน้อย 1 รายการ)",
        text: "กรอกด้วยเครื่องหมายคั่นจุลภาค เช่น 1001,1002",
      });
      return;
    }

    if (requiresUserIds && parsedUserIds.type === "invalid") {
      Swal.fire({
        icon: "warning",
        title: "userIds ต้องเป็นตัวเลขเท่านั้น",
        text: "ลบตัวอักษรหรือเครื่องหมายที่ไม่ใช่ตัวเลขออก",
      });
      return;
    }

    try {
      setLoading(true);

      // ส่งเป็น array ของ userIds และ sendType ตามสเปกใหม่
      await NotificationService.sendNotification({
        title: title.trim(),
        message: message.trim(),
        userIds: requiresUserIds ? parsedUserIds.value : [],
        sendType: sendType.trim(),
      });

      Swal.fire({
        icon: "success",
        title: "ส่งแจ้งเตือนเรียบร้อย",
        text:
          sendType === "ALL"
            ? "ส่งไปยังผู้ใช้ทั้งหมด"
            : `ส่งไปยัง userIds: ${parsedUserIds.value.join(", ")} (${sendType.trim()})`,
      });

      setTitle("");
      setMessage("");
      setRawUserIds("");
      setSendType("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถส่งแจ้งเตือน",
        text: error?.response?.data || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrefill = () => {
    setTitle("แจ้งปิดปรับปรุงระบบชั่วคราว");
    setMessage(
      "ระบบจะปรับปรุงภายใน 30 นาทีข้างหน้า การใช้งานอาจสะดุดเล็กน้อย ขออภัยในความไม่สะดวกค่ะ"
    );
    setRawUserIds("1001, 1002");
    setSendType("SELECTED");
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#8C6239]/10 flex items-center justify-center text-[#8C6239]">
          <FaBell className="text-xl" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            Send Notification
          </h1>
          <p className="text-sm text-gray-500">
            Compose a short title and message, choose the audience, and push it
            instantly.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-700">
              <FaPaperPlane className="text-[#8C6239]" />
              <span className="font-semibold">New message</span>
            </div>
            <button
              type="button"
              onClick={handlePrefill}
              className="text-sm text-[#8C6239] hover:text-[#704c2c] underline"
            >
              Prefill example
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short title"
              className="input input-bordered w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What do recipients need to know?"
              rows="6"
              className="textarea textarea-bordered w-full"
            />
            <p className="text-xs text-gray-400">
              Keep it concise; short texts are easier to read in the notification
              menu.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Send type</label>
            <select
              className="select select-bordered w-full"
              value={sendType}
              onChange={(e) => {
                const val = e.target.value;
                setSendType(val);
                if (val === "ALL") setRawUserIds("");
              }}
            >
              <option value="">เลือก send type</option>
              <option value="ALL">ALL</option>
              <option value="SELECTED">SELECTED</option>
            </select>
            <p className="text-xs text-gray-400">
              เลือก ALL เพื่อส่งถึงทุกคน หรือ SELECTED เพื่อส่งเฉพาะ userIds
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FaUserFriends className="text-[#8C6239]" />
              Target user ids
            </label>
            <input
              type="text"
              value={rawUserIds}
              onChange={(e) => setRawUserIds(e.target.value)}
              placeholder="เช่น 1001, 1002"
              className="input input-bordered w-full"
              disabled={sendType === "ALL"}
            />
            <p className="text-xs text-gray-400">
              ระบุ userIds หลายรายการคั่นด้วยจุลภาค (จำเป็นเมื่อเลือก SELECTED)
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setTitle("");
                setMessage("");
                setRawUserIds("");
                setSendType("");
              }}
              disabled={loading}
            >
              Clear
            </button>
            <button
              type="submit"
              className="btn bg-[#8C6239] hover:bg-[#704c2c] text-white"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send now"}
            </button>
          </div>
        </form>

        <div className="bg-gradient-to-b from-white to-[#f8f3ee] rounded-xl border border-[#e9dfd4] shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8C6239]/10 flex items-center justify-center text-[#8C6239]">
              <FaBell />
            </div>
            <div>
              <p className="text-sm text-gray-500">Preview</p>
              <p className="font-semibold text-gray-800">
                {title || "Notification title"}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white border border-gray-100 shadow-inner min-h-[120px]">
            <p className="text-gray-700 whitespace-pre-line">
              {message || "Your message will appear here."}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white border border-gray-100 shadow-inner">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Audience
            </p>
            {sendType === "ALL" ? (
              <div className="text-sm text-gray-700">All users</div>
            ) : parsedUserIds.type === "valid" ? (
              <div className="text-sm text-gray-700">
                {parsedUserIds.value.join(", ")}
              </div>
            ) : parsedUserIds.type === "invalid" ? (
              <p className="text-sm text-red-500">userIds ต้องเป็นตัวเลขเท่านั้น</p>
            ) : (
              <p className="text-sm text-gray-400">Waiting for target user ids.</p>
            )}

            <div className="mt-3">
              <p className="text-sm font-semibold text-gray-700 mb-1">Send type</p>
              {sendType ? (
                <span className="text-sm text-gray-700">{sendType}</span>
              ) : (
                <span className="text-sm text-gray-400">Waiting for send type.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

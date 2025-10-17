import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import { useAuthContext } from "../context/AuthContext";
import {
  FaMapMarkedAlt,
  FaFileAlt,
  FaImages,
  FaCheckCircle,
  FaCheck,
} from "react-icons/fa";
import AnnounceService from "../services/AnnounceService";
import Swal from "sweetalert2";
import AddressMapPreview from "../components/AddressMapPreview";

export const AddAnnounce = () => {
  const user = useAuthContext()
  const navigate = useNavigate();
  const [images, setImages] = useState([]);

  // ✅ อัปโหลดเฉพาะไฟล์รูปภาพ
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)
    );

    // ❌ ถ้ามีไฟล์ที่ไม่ใช่รูป
    if (validFiles.length !== files.length) {
      Swal.fire({
        icon: "warning",
        title: "อัปโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น",
        text: "รองรับ .jpg .jpeg .png .webp เท่านั้น",
      });
      return;
    }

    // 
    if (images.length + validFiles.length > 5) {
      Swal.fire({
        icon: "error",
        title: "อัปโหลดได้สูงสุด 5 รูปเท่านั้น",
      });
      return;
    }

    // ✅ สร้าง URL Preview
    const newFiles = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newFiles]);
  };

  // ✅ ลบรูปภาพ
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ เก็บข้อมูลฟอร์มทั้งหมด
  const [announce, setAnnounce] = useState({
    title: "",
    location: "",
    price: 0,
    bedroomCount: 0,
    bathroomCount: 0,
    areaSize: 0,
    hasPool: false,
    hasParking: false,
    hasFitness: false,
    hasElevator: false,
    hasSecurity: false,
    mapPoints: [{ lat: "", lng: "" }],
    announceType: 0,
    saleType: 0,
    userId: user?.id || 0,
  });

  console.log(user?.id)

  useEffect(() => {
  if (!user) {
    Swal.fire({
      icon: "warning",
      title: "กรุณาเข้าสู่ระบบก่อนเพิ่มประกาศ",
    }).then(() => navigate("/login"));
  }
}, [user]);

  // ✅ ตัวช่วยเปลี่ยนค่าในฟอร์ม
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAnnounce((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Tabs config
  const tabs = [
    { name: "รายละเอียดที่ตั้ง", icon: <FaMapMarkedAlt /> },
    { name: "รายละเอียด", icon: <FaFileAlt /> },
    { name: "รูปและวิดีโอ", icon: <FaImages /> },
    { name: "สรุป", icon: <FaCheckCircle /> },
  ];
  const [activeTab, setActiveTab] = useState(0);

  // ✅ Animation
  const fadeAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  // ✅ เปลี่ยนแท็บ
  const handleNext = () => {
    // ตรวจ validation เฉพาะแต่ละ tab
    if (activeTab === 0) {
      if (!announce.location || !announce.mapPoints[0].lat) {
        Swal.fire({
          icon: "warning",
          title: "กรุณาเลือกตำแหน่งที่ตั้ง",
          text: "กรุณากรอกชื่อสถานที่หรือปักหมุดบนแผนที่",
        });
        return;
      }
    }

    if (activeTab === 1) {
      if (!announce.title || !announce.price) {
        Swal.fire({
          icon: "warning",
          title: "กรุณากรอกข้อมูลให้ครบ",
          text: "กรุณากรอกหัวข้อและราคา",
        });
        return;
      }
    }

    if (activeTab < tabs.length - 1) setActiveTab(activeTab + 1);
  };

  const handleBack = () => {
    if (activeTab === 0) navigate("/");
    else setActiveTab(activeTab - 1);
  };

  // ✅ ส่งข้อมูล
  const handleSubmit = async () => {
    if (!announce.title || !announce.location || !announce.price) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบ",
        text: "ต้องกรอกชื่อประกาศ ที่ตั้ง และราคา",
      });
      return;
    }

    try {
      const response = await AnnounceService.createAnnounce(announce);
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "บันทึกประกาศสำเร็จ!",
          text: "ระบบได้เพิ่มข้อมูลเรียบร้อยแล้ว",
        }).then(() => navigate("/"));
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถบันทึกประกาศได้",
      });
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      {/* Tabs ด้านบน */}
      <div className="flex gap-10 border-b border-gray-200 mb-6">
        {tabs.map((tab, index) => {
          const isActive = index === activeTab;
          const isCompleted = index < activeTab;

          return (
            <div key={index} className="flex items-center gap-2">
              <button
                disabled={index > activeTab}
                onClick={() => setActiveTab(index)}
                className={`pb-2 text-lg font-medium flex items-center gap-2 transition-all duration-200 ${
                  isActive
                    ? "text-green-600 border-b-2 border-green-600"
                    : isCompleted
                    ? "text-green-500"
                    : index > activeTab
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-500 hover:text-green-500"
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
                {isCompleted && <FaCheck className="text-green-500 ml-1" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* เนื้อหาแต่ละแท็บ */}
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* ✅ Tab 1: รายละเอียดที่ตั้ง */}
{activeTab === 0 && (
  <motion.div key="tab1" {...fadeAnimation}>
    <h2 className="text-xl font-semibold text-green-700 mb-4">
      รายละเอียดที่ตั้ง
    </h2>

    <div className="flex flex-col md:flex-row gap-6 items-start">
      {/* LEFT: แผนที่ */}
      <div className="w-full md:w-[65%] relative z-0">
        <div className="text-sm font-medium mb-2 text-gray-700">
          แผนที่ตำแหน่งที่ตั้ง
        </div>

        <div className="rounded-lg overflow-hidden shadow-sm">
          <AddressMapPreview
            query={announce.location}
            onGeocode={(lat, lng, result) => {
              const formattedAddress =
                result?.formatted_address || announce.location;
              setAnnounce((prev) => ({
                ...prev,
                location: formattedAddress,
                mapPoints: [{ lat, lng }],
              }));
            }}
          />
        </div>

        {announce.mapPoints[0].lat && (
          <div className="mt-3 text-sm text-gray-600">
            📍 <span className="font-medium">{announce.location}</span>
            <br />
            🌐 พิกัด:{" "}
            <span className="text-gray-800">
              {announce.mapPoints[0].lat.toFixed(5)},{" "}
              {announce.mapPoints[0].lng.toFixed(5)}
            </span>
          </div>
        )}
      </div>

      {/* RIGHT: input + tip */}
      <div className="w-full md:w-[35%] relative z-10">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ค้นหาสถานที่ / โครงการ
        </label>

        <input
          name="location"
          value={announce.location}
          onChange={handleChange}
          type="text"
          placeholder="พิมพ์ชื่อโครงการหรือสถานที่ เช่น คอนโด เอ บี ซี"
          className="input input-bordered w-full mb-4"
        />

        {/* Tip card */}
        <div className="mt-2 rounded-xl border border-[#550080] bg-[#55008014] p-4 shadow-sm">
          <div className="text-[#550080] text-sm font-semibold mb-1">
            ไม่พบตำแหน่งที่ตั้งของคอนโด/โครงการ จากรายการของเราใช่หรือไม่?
          </div>
          <div className="text-[#550080] text-sm leading-relaxed">
            คุณสามารถระบุตำแหน่งของประกาศได้เองทันที
            โดยคลิกเลือกตำแหน่งบนแผนที่ด้านซ้าย
          </div>
        </div>
      </div>
    </div>

    <p className="text-sm text-gray-600 mt-5">
      เมื่อพิมพ์ชื่อสถานที่ ระบบจะค้นหาและปักหมุดให้อัตโนมัติ
      หรือคลิกบนแผนที่เพื่อเลือกตำแหน่งเอง
    </p>
  </motion.div>
)}



          {/* ✅ Tab 2: รายละเอียด */}
{activeTab === 1 && (
  <motion.div key="tab2" {...fadeAnimation}>
    <h2 className="text-xl font-semibold text-green-700 mb-6">รายละเอียด</h2>

    {/* หัวข้อ */}
    <label className="block font-medium text-gray-700 mb-2">หัวข้อ</label>
    <input
      name="title"
      value={announce.title}
      onChange={handleChange}
      type="text"
      placeholder="รายละเอียดหัวข้อ"
      className="input input-bordered w-full mb-6"
    />

    {/* สิ่งอำนวยความสะดวก */}
    <p className="font-medium mb-2">สิ่งอำนวยความสะดวก</p>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
      {[
        { key: "hasPool", label: "สระว่ายน้ำ" },
        { key: "hasParking", label: "ที่จอดรถ" },
        { key: "hasFitness", label: "ฟิตเนส" },
        { key: "hasElevator", label: "ลิฟต์" },
        { key: "hasSecurity", label: "รปภ." },
      ].map(({ key, label }) => (
        <label key={key} className="flex items-center gap-2">
          <input
            type="checkbox"
            name={key}
            checked={announce[key]}
            onChange={handleChange}
            className="checkbox checkbox-success"
          />
          <span>{label}</span>
        </label>
      ))}
    </div>

    {/* Dropdowns */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          ประเภทของการประกาศ
        </label>
        <select
          name="announceType"
          value={announce.announceType}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value="">เลือกประเภทของการประกาศ</option>
          <option value={1}>ให้เช่า</option>
          <option value={2}>ขาย</option>
        </select>
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-2">
          ประเภทอสังหาริมทรัพย์
        </label>
        <select
          name="saleType"
          value={announce.saleType}
          onChange={handleChange}
          className="select select-bordered w-full"
        >
          <option value="">เลือกประเภทอสังหาริมทรัพย์</option>
          <option value={1}>คอนโด</option>
          <option value={2}>ที่ดิน</option>
          <option value={3}>บ้านหรู</option>
          <option value={4}>วิลล่า</option>
        </select>
      </div>
    </div>

    {/* ราคา */}
    <label className="block font-medium text-gray-700 mb-2">ราคา</label>
    <input
      name="price"
      value={announce.price}
      onChange={handleChange}
      type="number"
      placeholder="ระบุราคา"
      className="input input-bordered w-full mb-6"
    />

    {/* ที่อยู่ */}
    <label className="block font-medium text-gray-700 mb-2">ที่อยู่</label>
    <input
      name="location"
      value={announce.location}
      onChange={handleChange}
      type="text"
      placeholder="รายละเอียดที่อยู่"
      className="input input-bordered w-full mb-6"
    />

    {/* ห้องนอน ห้องน้ำ */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          รายละเอียด ห้องนอน
        </label>
        <input
          name="bedroomCount"
          value={announce.bedroomCount}
          onChange={handleChange}
          type="number"
          placeholder="เช่น 2 ห้องนอน"
          className="input input-bordered w-full"
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          รายละเอียด ห้องน้ำ
        </label>
        <input
          name="bathroomCount"
          value={announce.bathroomCount}
          onChange={handleChange}
          type="number"
          placeholder="เช่น 2 ห้องน้ำ"
          className="input input-bordered w-full"
        />
      </div>
    </div>
  </motion.div>
)}


          {/* ✅ Tab 3: รูปและวิดีโอ */}
{/* ✅ Tab 3: รูปและวิดีโอ */}
{activeTab === 2 && (
  <motion.div key="tab3" {...fadeAnimation}>
    <h2 className="text-xl font-semibold text-green-700 mb-4">
      รูปภาพประกาศ (สูงสุด 10 รูป)
    </h2>

    <label
      htmlFor="uploadInput"
      className="border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition"
    >
      <span className="text-lg mb-1">📷 คลิกเพื่อเลือกไฟล์</span>
      <span className="text-sm">หรือวางไฟล์รูปลงที่นี่</span>
      <input
        id="uploadInput"
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
    </label>

    {/* แสดงตัวอย่างรูป */}
    {images.length > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative group border rounded-lg overflow-hidden shadow-sm"
          >
            <img
              src={img.url}
              alt={`uploaded-${index}`}
              className="object-cover w-full h-40"
            />
            <button
              onClick={() => handleRemoveImage(index)}
              className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
            >
              ✕ ลบ
            </button>
          </div>
        ))}
      </div>
    )}
  </motion.div>
)}

          {/* ✅ Tab 4: สรุป */}
          {activeTab === 3 && (
            <motion.div key="tab4" {...fadeAnimation}>
              <h2 className="text-xl font-semibold text-green-700 mb-4">
                ตรวจสอบข้อมูลก่อนบันทึก
              </h2>
              <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">
                {JSON.stringify(announce, null, 2)}
              </pre>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ปุ่มถัดไป / ย้อนกลับ */}
      <div className="flex justify-between w-full max-w-5xl mt-6">
        <button
          onClick={handleBack}
          className="btn btn-outline px-8 hover:bg-gray-100"
        >
          {activeTab === 0 ? "⬅ ออก" : "⬅ ย้อนกลับ"}
        </button>

        {activeTab < tabs.length - 1 ? (
          <button
            onClick={handleNext}
            className="btn bg-[#8C6239] text-white px-8 hover:bg-[#704c2c]"
          >
            ถัดไป ➜
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="btn bg-green-600 text-white px-8"
          >
            ✅ เสร็จสิ้น
          </button>
        )}
      </div>
    </div>
  );
};

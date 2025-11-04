import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useAuthContext } from "../context/AuthContext";

// 🧩 Components
import AddressMapPreview from "../components/AddressMapPreview";
import { CardDetails } from "../components/details/CardDetails";
import GrayscaleMap from "../components/details/GrayscaleMap";
import AnnounceService from "../services/AnnounceService";
import UserService from "../services/UserService";

// 🧱 Icons
import {
  FaMapMarkedAlt,
  FaFileAlt,
  FaImages,
  FaCheckCircle,
  FaCheck,
  FaSwimmingPool,
} from "react-icons/fa";
import { IoIosFitness } from "react-icons/io";
import {
  MdStorefront,
  MdPool,
  MdFitnessCenter,
  MdLocalParking,
  MdElevator,
  MdSecurity,
  MdWarningAmber,
} from "react-icons/md";
import { CiParking1 } from "react-icons/ci";
import { PiElevatorDuotone, PiShower } from "react-icons/pi";
import { GoShieldCheck } from "react-icons/go";
import { IoBedOutline } from "react-icons/io5";
import { BsTextarea } from "react-icons/bs";
import { GrMapLocation } from "react-icons/gr";

export const AddAnnounce = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [images, setImages] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  const [announce, setAnnounce] = useState({
    title: "",
    location: "",
    price: "",
    bedroomCount: "",
    bathroomCount: "",
    areaSize: "",
    hasPool: false,
    hasParking: false,
    hasFitness: false,
    hasElevator: false,
    hasSecurity: false,
    hasConvenienceStore: false,
    approveStatusId: 4,
    mapPoints: [{ lat: "", lng: "" }],
    announceType: 0,
    saleType: 0,
    userId: user?.userId || 0,
  });

    const displayName =
    userProfile?.name?.trim() ||
    user?.name?.trim() ||
    user?.sub ||
    "User";

  const displayImage =
    userProfile?.image ||
    user?.image ||
    "https://ui-avatars.com/api/?name=" + encodeURIComponent(displayName);

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "ไม่พบผู้ใช้",
      }).then(() => navigate("/"));
    } else {
      setAnnounce((prev) => ({ ...prev, userId: user?.userId || 0 }));
    }
  }, [user]);

  useEffect(() => {
    let ignore = false;

    const fetchUserProfile = async () => {
      if (!user?.userId) {
        if (!ignore) {
          setUserProfile(null);
        }
        return;
      }

      try {
        const response = await UserService.getUserProfileOverview(user.userId);
        if (!ignore) {
          setUserProfile(response?.status === 200 ? response?.data : null);
        }
      } catch (_error) {
        if (!ignore) {
          setUserProfile(null);
        }
      }
    };

    fetchUserProfile();

    return () => {
      ignore = true;
    };
  }, [user?.userId]);

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบก่อนเพิ่มประกาศ",
      }).then(() => navigate("/"));
    } else {
      setAnnounce((prev) => ({ ...prev, userId: user?.userId || 0 }));
    }
  }, [user]);

  // ✅ ฟังก์ชันเปลี่ยนค่าฟอร์ม
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;
  setAnnounce((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};


  // 📸 Upload รูป
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      Swal.fire({
        icon: "warning",
        title: "อัปโหลดได้เฉพาะไฟล์รูปภาพเท่านั้น",
      });
      return;
    }

    if (images.length + validFiles.length > 5) {
      Swal.fire({
        icon: "error",
        title: "อัปโหลดได้สูงสุด 5 รูปเท่านั้น",
      });
      return;
    }

    const newFiles = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const tabs = [
    { name: "รายละเอียดที่ตั้ง", icon: <FaMapMarkedAlt /> },
    { name: "รายละเอียด", icon: <FaFileAlt /> },
    { name: "รูปและวิดีโอ", icon: <FaImages /> },
    { name: "สรุป", icon: <FaCheckCircle /> },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const fadeAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3, ease: "easeInOut" },
  };

  const handleNext = () => {
    if (activeTab < tabs.length - 1) setActiveTab(activeTab + 1);
  };

  const handleBack = () => {
    if (activeTab === 0) navigate("/");
    else setActiveTab(activeTab - 1);
  };

  const handleSubmit = async () => {
    try {
      const response = await AnnounceService.createAnnounce(
        announce,
        images.map((i) => i.file)
      );
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "บันทึกประกาศสำเร็จ!",
        }).then(() => navigate("/"));
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
      });
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      {/* Tabs */}
      <div className="flex gap-10 border-b border-gray-200 mb-6">
        {tabs.map((tab, index) => {
          const isActive = index === activeTab;
          const isCompleted = index < activeTab;
          return (
            <div key={index} className="flex items-center gap-2">
              <button
                disabled={index > activeTab}
                onClick={() => setActiveTab(index)}
                className={`pb-2 text-lg font-medium flex items-center gap-2 ${
                  isActive
                    ? "text-green-600 border-b-2 border-green-600"
                    : isCompleted
                    ? "text-green-500"
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

      {/* ✅ Tabs 1–3 (คงของเดิมไว้) */}
      <div className="w-full max-w-5xl bg-white rounded-xl p-8 min-h-[400px]">
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
            query={searchText.trim() || null}
            onGeocode={(lat, lng, result) => {
              const formattedAddress = result?.formatted_address || searchText;
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
            📍{" "}
            <span className="font-medium">{announce.location}</span>
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
          name="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
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
            คุณสามารถระบุตำแหน่งของประกาศได้เองทันที โดยคลิกเลือกตำแหน่งบนแผนที่ด้านซ้าย
          </div>
        </div>
      </div>
    </div>
    <p className="text-sm text-gray-600 mt-5">
      เมื่อพิมพ์ชื่อสถานที่ ระบบจะค้นหาและปักหมุดให้อัตโนมัติ หรือคลิกบนแผนที่เพื่อเลือกตำแหน่งเอง
    </p>
  </motion.div>
)}

{/* ✅ Tab 2: รายละเอียด */}
{activeTab === 1 && (
  <motion.div key="tab2" {...fadeAnimation}>
    <h2 className="text-xl font-semibold text-grey-700 mb-6">รายละเอียด</h2>

    {/* หัวข้อ */}
    <label className="block font-medium text-gray-700 mb-2">หัวข้อ</label>
    <input
      name="title"
      value={announce.title}
      onChange={handleChange}
      type="text"
      placeholder="รายละเอียดหัวข้อ"
      className="input input-bordered w-full mb-6 rounded-xl"
    />

    {/* สิ่งอำนวยความสะดวก */}
    <p className="font-medium text-[20px] ">สิ่งอำนวยความสะดวก</p>
    <p className="font-medium text-[16px] mb-8 text-gray-600">
      คุณสามารถเลือกสิ่งอำนวยความสะดวกลงในประกาศ
    </p>

    <div className="grid grid-cols-2 md:grid-cols-2 gap-5 mb-6">
      {[
        { key: "hasPool", label: "สระว่ายน้ำ", icon: <FaSwimmingPool /> },
        { key: "hasParking", label: "ที่จอดรถ", icon: <CiParking1 /> },
        { key: "hasFitness", label: "ฟิตเนส", icon: <IoIosFitness /> },
        { key: "hasElevator", label: "ลิฟต์", icon: <PiElevatorDuotone /> },
        { key: "hasSecurity", label: "รปภ.", icon: <GoShieldCheck /> },
        { key: "hasConvenienceStore", label: "ร้านสะดวกซื้อ", icon: <MdStorefront /> },
      ].map(({ key, label, icon }) => (
        <div
          key={key}
          onClick={() =>
            setAnnounce((prev) => ({
              ...prev,
              [key]: !Boolean(prev[key]),
            }))
          }
          className={`flex items-center gap-3 px-2 h-9 border-none cursor-pointer transition-all duration-200 rounded-full w-fit ${
            announce[key]
              ? "bg-[#EBEBEB] text-gray-700"
              : "bg-gray-100 text-gray-700 hover:bg-[#ebebebb9]"
          }`}
        >
          <div
            className={`rounded-full transition-all duration-200 ${
              announce[key] ? "bg-gray-800" : "bg-gray-400"
            }`}
          />
          <span className="text-lg">{icon}</span>
          <span className="text-base font-medium">{label}</span>
        </div>
      ))}
    </div>

    {/* Dropdowns */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          ประเภทของการประกาศ
        </label>
        <select
          name="saleType"
          value={announce.saleType}
          onChange={handleChange}
          className="select select-bordered w-full rounded-xl"
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
          name="announceType"
          value={announce.announceType}
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
      className="input input-bordered w-full mb-6 rounded-xl"
    />

    {/* ที่อยู่ */}
    <label className="block font-medium text-gray-700 mb-2">ที่อยู่</label>
    <input
      name="location"
      value={announce.location}
      onChange={handleChange}
      type="text"
      placeholder="รายละเอียดที่อยู่"
      className="input input-bordered w-full mb-6 rounded-xl"
    />

    {/* ห้องนอน ห้องน้ำ */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          className="input input-bordered w-full rounded-xl"
        />
      </div>
      <div>
        <label className="block font-medium text-gray-700 mb-2">
          รายละเอียด ขนาดห้อง
        </label>
        <input
          name="areaSize"
          value={announce.areaSize}
          onChange={handleChange}
          type="number"
          placeholder="เช่น 20 ตารางเมตร"
          className="input input-bordered w-full rounded-xl"
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
          className="input input-bordered w-full rounded-xl"
        />
      </div>
    </div>
  </motion.div>
)}

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

        </AnimatePresence>
      </div>

      {/* ✅ Tab 4 (ใหม่ เต็มจอ) */}
{activeTab === 3 && (
  <motion.div
    key="tab4"
    {...fadeAnimation}
    className="w-full bg-white min-h-screen py-10 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 -translate-y-100"
  >
    <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
      🔍 ตัวอย่างประกาศของคุณ
    </h2>

    {/* ✅ รูป CardDetails กลางหน้า */}
    <div className="mb-10 flex justify-center">
      <CardDetails
        images={images.map((img, i) => ({
          id: i,
          imageUrl: img.url || URL.createObjectURL(img.file),
          imageName: img.file?.name || `uploaded-${i}`,
        }))}
      />
    </div>

    {/* ✅ ข้อมูลประกาศ */}
    <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10">
      {/* ฝั่งซ้าย */}
      <div>
        <h1 className="text-[30px] sm:text-[38px] font-bold text-[#404040]">
          {announce.title || "ยังไม่มีชื่อประกาศ"}
        </h1>
        <p className="text-[18px] mt-2 text-gray-700">
          {announce.location || "ยังไม่ได้ระบุที่อยู่"}
        </p>

        {announce.mapPoints[0]?.lat && (
          <button
            className="btn border-black rounded-full mt-4 font-semibold flex items-center gap-2"
            onClick={() => {
              const { lat, lng } = announce.mapPoints[0];
              window.open(
                `https://www.google.com/maps?q=${lat},${lng}`,
                "_blank"
              );
            }}
          >
            <GrMapLocation className="text-lg" />
            สำรวจบนแผนที่
          </button>
        )}

        <div className="divider my-6"></div>

        {/* ราคา */}
        <div className="flex items-start gap-4 flex-wrap">
          <div>
            <div className="text-gray-500 font-semibold">ราคา</div>
            <div className="text-3xl font-bold text-[#8C6239]">
              {announce.price
                ? `฿${Number(announce.price).toLocaleString()}`
                : "—"}
            </div>
          </div>

          <div className="flex gap-6 text-gray-600 mt-4">
            <div className="flex flex-col items-center">
              <IoBedOutline className="w-6 h-6" />
              <span>{announce.bedroomCount || 0} ห้องนอน</span>
            </div>
            <div className="flex flex-col items-center">
              <PiShower className="w-6 h-6" />
              <span>{announce.bathroomCount || 0} ห้องน้ำ</span>
            </div>
            <div className="flex flex-col items-center">
              <BsTextarea className="w-6 h-6" />
              <span>{announce.areaSize || 0} ตร.ม.</span>
            </div>
          </div>
        </div>

        <div className="divider my-6"></div>

        {/* สิ่งอำนวยความสะดวก */}
        <h2 className="font-bold text-[20px] mb-3 text-gray-800">
          สิ่งอำนวยความสะดวก
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[#404040]">
          {announce.hasPool && (
            <div className="flex items-center gap-2">
              <MdPool className="text-[#8C6239]" /> สระว่ายน้ำ
            </div>
          )}
          {announce.hasFitness && (
            <div className="flex items-center gap-2">
              <MdFitnessCenter className="text-[#8C6239]" /> ฟิตเนส
            </div>
          )}
          {announce.hasParking && (
            <div className="flex items-center gap-2">
              <MdLocalParking className="text-[#8C6239]" /> ที่จอดรถ
            </div>
          )}
          {announce.hasElevator && (
            <div className="flex items-center gap-2">
              <MdElevator className="text-[#8C6239]" /> ลิฟต์
            </div>
          )}
          {announce.hasSecurity && (
            <div className="flex items-center gap-2">
              <MdSecurity className="text-[#8C6239]" /> รปภ.
            </div>
          )}
          {announce.hasConvenienceStore && (
            <div className="flex items-center gap-2">
              <MdStorefront className="text-[#8C6239]" /> ร้านสะดวกซื้อ
            </div>
          )}
        </div>

        {announce.mapPoints[0]?.lat && (
          <>
            <div className="divider my-6"></div>
            <h2 className="font-bold text-[20px] mb-3">
              ที่ตั้ง & สถานที่ใกล้เคียง
            </h2>
            <GrayscaleMap
              lat={announce.mapPoints[0].lat}
              lng={announce.mapPoints[0].lng}
            />
          </>
        )}

        {/* ✅ ข้อมูลเพิ่มเติม */}
        <div className="divider my-6"></div>
        <div className="space-y-2 text-gray-700">
          <p>
            <span className="font-semibold">รหัสประกาศ:</span>{" "}
            {announce.id || "ยังไม่ได้ระบุ"}
          </p>
          <p>
            <span className="font-semibold">วันที่ลงประกาศ:</span>{" "}
            {new Date().toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p>
            <span className="font-semibold">ผู้ลงประกาศ:</span>{" "}
            {displayName || "ไม่ระบุชื่อผู้ประกาศ"}
          </p>
        </div>
      </div>

      {/* ฝั่งขวา */}
      <div>
        <div className="bg-[#f9f9f9] p-5 rounded-xl shadow-inner">
          <p className="font-bold text-lg mb-3 text-gray-800">
            ข้อมูลผู้ประกาศ
          </p>
          <div className="flex items-center gap-4">
            <img
              src={
                displayImage ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user?.name || "User")
              }
              alt="user"
              className="rounded-full w-16 h-16 object-cover"
            />
            <div>
              <p className="font-semibold text-gray-900">
                {displayName || "ยังไม่ได้เข้าสู่ระบบ"}
              </p>
              <p className="text-gray-600 text-sm">
                {user?.sub || "ไม่พบอีเมลผู้ใช้"}
              </p>
            </div>
          </div>
        </div>

        <div className="divider my-4" />
        <div className="alert alert-warning bg-[#FAAF1C40] h-[125px] flex items-center gap-3">
          <MdWarningAmber className="h-6 w-6 shrink-0" />
          <span>
            ⚠️ ห้ามโอนเงินก่อนเห็นห้องจริงและตรวจสอบเอกสารสิทธิ์ให้ครบถ้วน
          </span>
        </div>
      </div>
    </div>
  </motion.div>
)}

      {/* ปุ่ม */}
      <div className="flex justify-between w-full max-w-5xl mt-6 mb-20">
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

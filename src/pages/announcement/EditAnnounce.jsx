import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthContext } from "../../context/AuthContext";

import SearchableDropdown from "../../components/SearchableDropdown";
import AddressMapPreview from "../../components/AddressMapPreview";
import { CardDetails } from "../../components/details/CardDetails";
import SimpleMap from "../../components/details/SimpleMap";

import AnnounceService from "../../services/AnnounceService";
import UserService from "../../services/UserService";
import ProvinceService from "../../services/ProvinceService";

import { provinces as fallbackProvinces } from "../../data/provinces";
import { stations as fallbackStations } from "../../data/stations";
import { extractErrorMessage } from "../../utils/errorUtils";

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

const initialAnnounceState = {
  title: "",
  location: "",
  province: "",
  station: "",
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
  mapPoints: [{ lat: "", lng: "" }],
  announceType: "",
  saleType: "",
};

const normalizeBoolean = (value) => {
  if (value === true || value === 1 || value === "1" || value === "true" || value === "TRUE") return true;
  return false;
};

const normalizeProvince = (province) => {
  if (!province && province !== 0) return { id: "", name: "" };
  if (typeof province === "object" && province !== null) {
    return {
      id: province.id || province.value || "",
      name: province.name || province.label || "",
    };
  }
  return { id: String(province), name: String(province) };
};

const get413ErrorMessage = (error, fallbackMessage) => {
  if (error?.response?.status === 413) {
    return "ขนาดไฟล์หรือรูปภาพใหญ่เกินไป โปรดเลือกรูปภาพที่มีขนาดเล็กลง";
  }
  return extractErrorMessage(error, fallbackMessage);
};

export const EditAnnounce = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { id: announceId } = useParams();

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const [announce, setAnnounce] = useState(initialAnnounceState);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  const [provinceOptions, setProvinceOptions] = useState(fallbackProvinces);
  const [stationOptions, setStationOptions] = useState(fallbackStations);
  const [announceTypes, setAnnounceTypes] = useState([]);
  const [permission, setPermission] = useState("");

  useEffect(() => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "กรุณาเข้าสู่ระบบ",
        text: "คุณต้องเข้าสู่ระบบก่อนแก้ไขประกาศ",
      }).then(() => navigate("/login"));
      return;
    }

    const fetchAnnounceData = async () => {
      try {
        setLoading(true);
        let response;

        try {
          response = await AnnounceService.showAnnounceDetail(announceId);
        } catch (error) {
          if (error?.response?.status === 403) {
            response = await AnnounceService.showAnnounceDetailByAgent(announceId);
          } else {
            throw error;
          }
        }

        const data = response.data;

        setPermission(data?.announceAgent?.permission || "");
        const ownerId = String(
          data?.owner?.id ?? data?.agent?.id ?? data?.agent?.userId ?? data?.userId ?? "",
        );
        const currentUserId = String(user?.userId ?? user?.sub ?? "");
        const hasAgentPermission =
          String(data?.announceAgent?.permission || "").includes("EDIT_CONTENT") ||
          String(data?.announceAgent?.permission || "").includes("FULL_ACCESS");

        if (ownerId !== currentUserId && !hasAgentPermission) {
          Swal.fire({
            icon: "error",
            title: "เข้าถึงถูกปฏิเสธ",
            text: "คุณไม่มีสิทธิ์แก้ไขประกาศนี้",
          }).then(() => navigate(-1));
          return;
        }
        
        setAnnounce({
          id: Number(announceId),
          title: data.title || "",
          location: data.location || "",
          province: normalizeProvince(data.province),
          station: data.station || "",
          price: data.price || "",
          bedroomCount: data.bedroomCount || "",
          bathroomCount: data.bathroomCount || "",
          areaSize: data.areaSize || "",
          hasPool: normalizeBoolean(data.hasPool),
          hasParking: normalizeBoolean(data.hasParking),
          hasFitness: normalizeBoolean(data.hasFitness),
          hasElevator: normalizeBoolean(data.hasElevator),
          hasSecurity: normalizeBoolean(data.hasSecurity),
          hasConvenienceStore: normalizeBoolean(data.hasConvenienceStore),
          mapPoints: data.mapPoint ? [{ lat: data.mapPoint.lat, lng: data.mapPoint.lng }] : [{ lat: "", lng: "" }],
          announceType: String(data.announceType?.id || data.announceType || ""),
          saleType: String(data.saleType?.id || data.saleType || ""),
        });

        setExistingImages(data.imageList || []);

      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: extractErrorMessage(error, "ไม่สามารถโหลดข้อมูลประกาศได้"),
        }).then(() => navigate("/"));
      } finally {
        setLoading(false);
      }
    };
    
    const fetchInitialData = async () => {
        try {
            const [provincesRes, userProfileRes, announceTypesRes] = await Promise.all([
                ProvinceService.getAllProvinces(),
                UserService.profilePublic(user?.userId),
                ProvinceService.showAllAnnounceTypes(),
            ]);

            const provinceNames = provincesRes.data?.map(item => item?.provinceName || item?.name).filter(Boolean) || [];
            
            const formattedOptions = (
              provinceNames.length > 0
                ? provinceNames
                : fallbackProvinces
            ).map((province, index) => ({
              value: province.id || index + 1,
              label: province.name || province,
            }));

            setProvinceOptions(formattedOptions);

            if (userProfileRes.status === 200) {
                setUserProfile(userProfileRes.data);
            }

            if (announceTypesRes.data && Array.isArray(announceTypesRes.data)) {
              setAnnounceTypes(announceTypesRes.data);
            }

        } catch (error) {
            console.error("Failed to fetch initial data:", error);
            Swal.fire({
              icon: "error",
              title: "เกิดข้อผิดพลาด",
              text: extractErrorMessage(error, "ไม่สามารถโหลดข้อมูลเริ่มต้นได้"),
            });
            setProvinceOptions(fallbackProvinces);
        }
    };

    fetchAnnounceData();
    fetchInitialData();
  }, [announceId, user, navigate]);

  const isEditContentAgent = permission.includes('EDIT_CONTENT');
  const displayName = userProfile?.name?.trim() || user?.name?.trim() || user?.sub || "User";
  const displayImage = userProfile?.image || user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAnnounce((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDropdownChange = (field, value) => {
    setAnnounce((prev) => ({ ...prev, [field]: value || "" }));
  };
  
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).filter(file => ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type));
    if (existingImages.length + newImages.length + files.length > 10) {
        Swal.fire({ icon: "error", title: "อัปโหลดรูปภาพได้สูงสุด 10 รูป" });
        return;
    }
    const newFilesWithUrls = files.map(file => ({ file, url: URL.createObjectURL(file) }));
    setNewImages(prev => [...prev, ...newFilesWithUrls]);
  };
  
  const handleRemoveNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleRemoveExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
    setImagesToRemove(prev => [...prev, imageId]);
  };

  const tabs = [
    { name: "รายละเอียดที่ตั้ง", icon: <FaMapMarkedAlt /> },
    { name: "รายละเอียด", icon: <FaFileAlt /> },
    { name: "รูปภาพ", icon: <FaImages /> },
    { name: "สรุป", icon: <FaCheckCircle /> },
  ];
  
  const fadeAnimation = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.3, ease: "easeInOut" } };

  const validate = (step = null) => {
    const errors = [];
    const validations = {
      0: () => { if (!announce.mapPoints[0]?.lat) errors.push("กรุณาปักหมุดตำแหน่งบนแผนที่"); },
      1: () => {
        if (!announce.title.trim()) errors.push("กรุณากรอกหัวข้อประกาศ");
        if (!announce.location.trim()) errors.push("กรุณากรอกรายละเอียดที่อยู่");
        if (!announce.saleType) errors.push("กรุณาเลือกประเภทการประกาศ");
        if (!announce.announceType) errors.push("กรุณาเลือกประเภทอสังหาฯ");
        if (!announce.price) errors.push("กรุณาระบุราคา");
        if (Number(announce.price) <= 0) errors.push("ราคาต้องมากกว่า 0");
        if (!announce.province) errors.push("กรุณาเลือกจังหวัด");
        if (!announce.bedroomCount) errors.push("กรุณาระบุจำนวนห้องนอน");
        if (!announce.bathroomCount) errors.push("กรุณาระบุจำนวนห้องน้ำ");
        if (!announce.areaSize) errors.push("กรุณาระบุขนาดพื้นที่");
      },
      2: () => { if (existingImages.length + newImages.length === 0) errors.push("กรุณาอัปโหลดรูปภาพอย่างน้อย 1 รูป"); },
    };

    if (step !== null) validations[step]?.();
    else Object.values(validations).forEach(v => v());

    if (errors.length > 0) {
      Swal.fire({ icon: "warning", title: "ข้อมูลไม่ครบถ้วน", html: errors.map(e => `• ${e}`).join("<br>"), confirmButtonColor: "#8C6239" });
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validate(activeTab)) {
      if (activeTab < tabs.length - 1) setActiveTab(activeTab + 1);
    }
  };

  const handleBack = () => {
    if (activeTab === 0) navigate(`/detail/${announceId}`);
    else setActiveTab(activeTab - 1);
  };
  
  const submitUpdateByAgent = async () => {
    if (!validate()) return;
    try {
      const announcePayload = {
        title: announce.title,
        bathroomCount: Number(announce.bathroomCount) || 0,
        bedroomCount: Number(announce.bedroomCount) || 0,
        areaSize: Number(announce.areaSize) || 0,
        hasPool: announce.hasPool,
        hasConvenienceStore: announce.hasConvenienceStore,
        hasFitness: announce.hasFitness,
        hasElevator: announce.hasElevator,
        hasParking: announce.hasParking,
        hasSecurity: announce.hasSecurity,
      };
      const formData = new FormData();
      formData.append('announce', new Blob([JSON.stringify(announcePayload)], { type: 'application/json' }));
      newImages.forEach((img, idx) => {
        formData.append('files', img.file);
      });
      const response = await AnnounceService.updateAnnounceByAgent(announceId, formData);
      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "แก้ไขประกาศสำเร็จ!",
        });
        navigate(`/detail/${announceId}`);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: get413ErrorMessage(err, "ไม่สามารถบันทึกการเปลี่ยนแปลงได้"),
      });
    }
  };  
  
  const submitUpdate = async () => {
    if (!validate()) return;
  
    try {
      const payload = {
        id: Number(announceId),
        title: announce.title,
        location: announce.location,
        province: typeof announce.province === "object" && announce.province !== null ? announce.province.name : announce.province,
        station: announce.station,
        price: Number(announce.price) || 0,
        bedroomCount: Number(announce.bedroomCount) || 0,
        bathroomCount: Number(announce.bathroomCount) || 0,
        areaSize: Number(announce.areaSize) || 0,
        hasPool: announce.hasPool,
        hasParking: announce.hasParking,
        hasFitness: announce.hasFitness,
        hasElevator: announce.hasElevator,
        hasSecurity: announce.hasSecurity,
        hasConvenienceStore: announce.hasConvenienceStore,
        mapPoints: announce.mapPoints,
        announceType: announce.announceType ? Number(announce.announceType) : null,
        saleType: announce.saleType ? Number(announce.saleType) : null,
        approveStatusId: 3,
        userId: user.userId,
      };

      const newImageFiles = newImages.map(i => i.file);
  
      const response = await AnnounceService.updateAnnounce(announceId, payload, newImageFiles, imagesToRemove);
  
      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "แก้ไขประกาศสำเร็จ!",
        });
        navigate(`/detail/${announceId}`);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: get413ErrorMessage(err, "ไม่สามารถบันทึกการเปลี่ยนแปลงได้"),
      });
    }
  };
  

  if (loading) {
    return <div className="flex items-center justify-center h-screen">กำลังโหลดข้อมูลประกาศ...</div>;
  }

  const allImagesForPreview = [
    ...existingImages.map(img => ({ ...img, url: img.imageUrl })),
    ...newImages
  ];

  return (
    <div className="flex flex-col items-center w-full mt-6 sm:mt-8 lg:mt-10 px-3 sm:px-4 lg:px-6">
      <div className="w-full max-w-5xl flex flex-wrap gap-4 sm:gap-8 border-b border-gray-200 mb-4 sm:mb-6 justify-center">
        {tabs.map((tab, index) => {
          const isActive = index === activeTab;
          const isCompleted = index < activeTab;
          return (
            <div key={index} className="flex items-center gap-2">
              <button disabled={index > activeTab && !isCompleted} onClick={() => setActiveTab(index)} className={`pb-2 text-sm sm:text-base lg:text-lg font-medium flex items-center gap-2 ${isActive ? "text-green-600 border-b-2 border-green-600" : isCompleted ? "text-green-500" : "text-gray-500 hover:text-green-500"}`}>
                <span className="text-base sm:text-lg">{tab.icon}</span>
                <span className="truncate max-w-30 sm:max-w-none">{tab.name}</span>
                {isCompleted && <FaCheck className="text-green-500 ml-1 hidden sm:inline-block" />}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="w-full max-w-5xl rounded-xl p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 0 && (
            <motion.div key="tab1" {...fadeAnimation}>
              <h2 className="text-xl font-semibold text-green-700 mb-4">แก้ไขรายละเอียดที่ตั้ง</h2>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-[65%] relative z-0">
                  <AddressMapPreview
                    query={searchText.trim() || null}
                    initialCenter={announce.mapPoints?.[0]?.lat ? { lat: parseFloat(announce.mapPoints[0].lat), lng: parseFloat(announce.mapPoints[0].lng) } : undefined}
                    onGeocode={(lat, lng) => setAnnounce(prev => ({ ...prev, mapPoints: [{ lat: parseFloat(lat), lng: parseFloat(lng) }] }))}
                  />
                  {announce.mapPoints[0]?.lat && (
                    <div className="mt-3 text-sm text-gray-600">
                      📍 <span className="font-medium">ปักหมุดสำเร็จ</span>
                    </div>
                  )}
                </div>
                 <div className="w-full md:w-[35%] relative z-10">
                  <label className="block text-sm font-medium text-gray-700 mb-2">ค้นหาสถานที่ / โครงการ</label>
                  <input
                    name="search"
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    type="text"
                    placeholder="พิมพ์ชื่อโครงการหรือสถานที่"
                    className="input input-bordered w-full mb-4"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 1 && (
             <motion.div key="tab2" {...fadeAnimation}>
             <h2 className="text-xl font-semibold text-grey-700 mb-6">
               รายละเอียด
             </h2>
             <label className="block font-medium text-gray-700 mb-2">หัวข้อ</label>
             <input name="title" value={announce.title} onChange={handleChange} type="text" placeholder="รายละเอียดหัวข้อ" className="input input-bordered w-full mb-6 rounded-xl"/>
             <p className="font-medium text-[20px] ">สิ่งอำนวยความสะดวก</p>
             <p className="font-medium text-[16px] mb-8 text-gray-600">คุณสามารถเลือกสิ่งอำนวยความสะดวกลงในประกาศ</p>
             <div className="grid grid-cols-2 md:grid-cols-2 gap-5 mb-6">
                {[ { key: "hasPool", label: "สระว่ายน้ำ", icon: <FaSwimmingPool /> }, { key: "hasParking", label: "ที่จอดรถ", icon: <CiParking1 /> }, { key: "hasFitness", label: "ฟิตเนส", icon: <IoIosFitness /> }, { key: "hasElevator", label: "ลิฟต์", icon: <PiElevatorDuotone /> }, { key: "hasSecurity", label: "รปภ.", icon: <GoShieldCheck /> }, { key: "hasConvenienceStore", label: "ร้านสะดวกซื้อ", icon: <MdStorefront /> }, ].map(({ key, label, icon }) => (
                  <div key={key} onClick={() => setAnnounce((prev) => ({ ...prev, [key]: !Boolean(prev[key]) }))} className={`flex items-center gap-3 px-2 h-9 border-none cursor-pointer transition-all duration-200 rounded-full w-fit ${ announce[key] ? "bg-gray-600 text-gray-100 hover:bg-[#ebebebb9]" : "bg-[#EBEBEB] text-gray-700 hover:bg-[#d4d4d4]" }`}>
                    <div className={`rounded-full transition-all duration-200 ${ announce[key] ? "bg-gray-800" : "bg-gray-400" }`}/>
                    <span className="text-lg">{icon}</span>
                    <span className="text-base font-medium">{label}</span>
                  </div>
                ))}
              </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
               <div>
                 <label className="block font-medium text-gray-700 mb-2">ประเภทของการประกาศ</label>
                 <select name="saleType" value={announce.saleType} onChange={handleChange} className="select select-bordered w-full rounded-xl">
                   <option value="">เลือกประเภทของการประกาศ</option>
                   <option value="1">ให้เช่า</option>
                   <option value="2">ขาย</option>
                 </select>
               </div>
               <div>
                 <label className="block font-medium text-gray-700 mb-2">ประเภทอสังหาริมทรัพย์</label>
                 <select name="announceType" value={announce.announceType} onChange={handleChange} className="select select-bordered w-full">
                   <option value="">เลือกประเภทอสังหาริมทรัพย์</option>
                   {announceTypes.map((type) => (
                     <option key={type.id} value={type.id}>
                       {type.typeName}
                     </option>
                   ))}
                 </select>
               </div>
             </div>
             <label className="block font-medium text-gray-700 mb-2">ราคา</label>
             <input name="price" value={announce.price} onChange={handleChange} type="number" placeholder="ระบุราคา" className="input input-bordered w-full mb-6 rounded-xl"/>
             <label className="block font-medium text-gray-700 mb-2">ที่อยู่</label>
             <input name="location" value={announce.location} onChange={handleChange} type="text" placeholder="รายละเอียดที่อยู่" className="input select-bordered w-full mb-6 rounded-xl"/>
             
             <label className="block font-medium text-gray-700 mb-2">
                จังหวัด
              </label>
              <SearchableDropdown
                options={provinceOptions}
                value={announce.province?.id || announce.province?.value || ""}
                onChange={(value) => {
                  const selected = provinceOptions.find((p) => p.value === value);
                  setAnnounce((prev) => ({
                    ...prev,
                    province: selected
                      ? { id: selected.value, name: selected.label }
                      : { id: value, name: value },
                  }));
                }}
                placeholder="เลือกจังหวัด"
              />

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
               <div>
                 <label className="block font-medium text-gray-700 mb-2">รายละเอียด ห้องนอน</label>
                 <input name="bedroomCount" value={announce.bedroomCount} onChange={handleChange} type="number" placeholder="เช่น 2 ห้องนอน" className="input input-bordered w-full rounded-xl"/>
               </div>
               <div>
                 <label className="block font-medium text-gray-700 mb-2">รายละเอียด ขนาดห้อง</label>
                 <input name="areaSize" value={announce.areaSize} onChange={handleChange} type="number" placeholder="เช่น 20 ตารางเมตร" className="input input-bordered w-full rounded-xl"/>
               </div>
               <div>
                 <label className="block font-medium text-gray-700 mb-2">รายละเอียด ห้องน้ำ</label>
                 <input name="bathroomCount" value={announce.bathroomCount} onChange={handleChange} type="number" placeholder="เช่น 2 ห้องน้ำ" className="input input-bordered w-full rounded-xl"/>
               </div>
             </div>
           </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div key="tab3" {...fadeAnimation}>
                <h2 className="text-xl font-semibold text-green-700 mb-4">รูปภาพประกาศ (สูงสุด 10 รูป)</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                    {existingImages.map((img) => (
                        <div key={img.id} className="relative group border rounded-lg overflow-hidden shadow-sm">
                            <img src={img.imageUrl} alt={img.imageName} className="object-cover w-full h-40" />
                            <button onClick={() => handleRemoveExistingImage(img.id)} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">✕</button>
                        </div>
                    ))}
                    {newImages.map((img, index) => (
                        <div key={index} className="relative group border rounded-lg overflow-hidden shadow-sm">
                            <img src={img.url} alt={`new-upload-${index}`} className="object-cover w-full h-40" />
                            <button onClick={() => handleRemoveNewImage(index)} className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition">✕</button>
                        </div>
                    ))}
                </div>
                <label htmlFor="uploadInput" className="mt-6 border-2 border-dashed border-gray-300 rounded-lg h-48 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition">
                    <span className="text-lg mb-1">📷 คลิกเพื่อเพิ่มรูปภาพ</span>
                    <span className="text-sm">หรือวางไฟล์รูปลงที่นี่</span>
                    <input id="uploadInput" type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                </label>
            </motion.div>
          )}

          {activeTab === 3 && (
            <motion.div key="tab4" {...fadeAnimation} className="w-full min-h-screen py-8 sm:py-10 px-3 sm:px-6 lg:px-10 max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">ตัวอย่างประกาศของคุณ</h2>
              <div className="mb-10 flex justify-center">
                <CardDetails images={allImagesForPreview.map((img, i) => ({ id: img.id || i, imageUrl: img.url || img.imageUrl, imageName: img.imageName || `image-${i}` }))} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-10">
                <div>
                  <h1 className="text-[30px] sm:text-[38px] font-bold text-[#404040]">{announce.title || "ยังไม่มีชื่อประกาศ"}</h1>
                  <p className="text-[18px] mt-2 text-gray-700">{announce.location || "ยังไม่ได้ระบุที่อยู่"}</p>
                  {announce.mapPoints[0]?.lat && (
                    <button className="btn border-black rounded-full mt-4 font-semibold flex items-center gap-2" onClick={() => window.open(`https://www.google.com/maps?q=${announce.mapPoints[0].lat},${announce.mapPoints[0].lng}`, "_blank")}>
                      <GrMapLocation className="text-lg" /> สำรวจบนแผนที่
                    </button>
                  )}
                  <div className="divider my-6"></div>
                  <div className="flex items-start gap-4 flex-wrap">
                    <div>
                      <div className="text-gray-500 font-semibold">ราคา</div>
                      <div className="text-2xl font-bold text-[#404040]">{announce.price ? `฿${Number(announce.price).toLocaleString()}` : "—"}</div>
                    </div>
                    <div className="divider divider-horizontal"></div>
                    <div className="flex gap-6 text-gray-600 mt-4">
                      <div className="flex flex-col items-center"><IoBedOutline className="w-6 h-6" /><span>{announce.bedroomCount || 0} ห้องนอน</span></div>
                      <div className="flex flex-col items-center"><PiShower className="w-6 h-6" /><span>{announce.bathroomCount || 0} ห้องน้ำ</span></div>
                      <div className="flex flex-col items-center"><BsTextarea className="w-6 h-6" /><span>{announce.areaSize || 0} ตร.ม.</span></div>
                    </div>
                  </div>
                  <div className="divider my-6"></div>
                  <h2 className="font-bold text-[20px] mb-3 text-gray-800">สิ่งอำนวยความสะดวก</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[#404040]">
                    {announce.hasPool && <div className="flex items-center gap-2"><MdPool className="text-[#8C6239]" /> สระว่ายน้ำ</div>}
                    {announce.hasFitness && <div className="flex items-center gap-2"><MdFitnessCenter className="text-[#8C6239]" /> ฟิตเนส</div>}
                    {announce.hasParking && <div className="flex items-center gap-2"><MdLocalParking className="text-[#8C6239]" /> ที่จอดรถ</div>}
                    {announce.hasElevator && <div className="flex items-center gap-2"><MdElevator className="text-[#8C6239]" /> ลิฟต์</div>}
                    {announce.hasSecurity && <div className="flex items-center gap-2"><MdSecurity className="text-[#8C6239]" /> รปภ.</div>}
                    {announce.hasConvenienceStore && <div className="flex items-center gap-2"><MdStorefront className="text-[#8C6239]" /> ร้านสะดวกซื้อ</div>}
                  </div>
                  {announce.mapPoints[0]?.lat && (
                    <>
                      <div className="divider my-6"></div>
                      <h2 className="font-bold text-[20px] mb-3">ที่ตั้ง & สถานที่ใกล้เคียง</h2>
                      <SimpleMap lat={parseFloat(announce.mapPoints[0].lat)} lng={parseFloat(announce.mapPoints[0].lng)} />
                    </>
                  )}
                  <div className="divider my-6"></div>
                  <div className="space-y-2 text-gray-700">
                    <p><span className="font-semibold">รหัสประกาศ:</span> {announceId}</p>
                    <p><span className="font-semibold">ผู้ลงประกาศ:</span> {displayName}</p>
                  </div>
                </div>
                <div>
                  <div className="bg-[#f9f9f9] p-5 rounded-xl shadow-inner">
                    <p className="font-bold text-lg mb-3 text-gray-800">ข้อมูลผู้ประกาศ</p>
                    <div className="flex items-center gap-4">
                      <img src={displayImage} alt="user" className="rounded-full w-16 h-16 object-cover" />
                      <div>
                        <p className="font-semibold text-gray-900">{displayName}</p>
                        <p className="text-gray-600 text-sm">{user?.sub || "ไม่พบอีเมลผู้ใช้"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="divider my-4" />
                  <div className="alert alert-warning bg-[#FAAF1C40] h-31.25 flex items-center gap-3">
                    <MdWarningAmber className="h-6 w-6 shrink-0" />
                    <span>⚠️ ห้ามโอนเงินก่อนเห็นห้องจริงและตรวจสอบเอกสารสิทธิ์ให้ครบถ้วน</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="w-full max-w-5xl mt-6 mb-20">
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 sm:gap-0 items-stretch sm:items-center">
          <button onClick={handleBack} className="btn btn-outline w-full sm:w-auto px-6 sm:px-8 hover:bg-gray-100">
            {activeTab === 0 ? "⬅ ยกเลิก" : "⬅ ย้อนกลับ"}
          </button>
          {activeTab < tabs.length - 1 ? (
            <button onClick={handleNext} className="btn bg-[#8C6239] text-white w-full sm:w-auto px-6 sm:px-8 hover:bg-[#704c2c]">
              ถัดไป ➜
            </button>
          ) : (
            <button
              onClick={isEditContentAgent ? submitUpdateByAgent : submitUpdate}
              className="btn bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto px-6 sm:px-8"
            >
              บันทึกการเปลี่ยนแปลง
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

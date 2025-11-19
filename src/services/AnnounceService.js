import api from "./api"; // <— axios instance มี interceptor token, header ฯลฯ

const DEFAULT_BASE_URL = "https://condo-swift.onrender.com";
const baseUrl =
  (import.meta.env.VITE_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");

const resolveEndpoint = (rawValue, fallbackPath) => {
  if (rawValue) {
    const trimmed = rawValue.replace(/\/$/, "");
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }
    if (trimmed.startsWith("/")) {
      return `${baseUrl}${trimmed}`;
    }
  }
  return `${baseUrl}${fallbackPath}`;
};

const API_URL = resolveEndpoint(
  import.meta.env.VITE_ANNOUNCE_API,
  "/api/v1/announces"
);

// 🏗 CRUD หลัก
const createAnnounce = async (announce, imageFiles = []) => {
  const formData = new FormData();

  const payload = {
    ...announce,
    mapPoints: (announce?.mapPoints || []).map((point) => ({
      lat: `${point?.lat ?? ""}`,
      lng: `${point?.lng ?? ""}`,
    })),
  };

  try {
    const blob = new Blob([JSON.stringify(payload)], {
      type: "application/json",
    });
    formData.append("announce", blob);
  } catch (_error) {
    formData.append("announce", JSON.stringify(payload));
  }

  if (Array.isArray(imageFiles)) {
    imageFiles.forEach((file, index) => {
      if (file) {
        const filename = file.name || `image_${index}.jpg`;
        formData.append("images", file, filename);
      }
    });
  }

  return api.post(`${API_URL}/addAnnounceWithImage`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const updateAnnounce = async (id, Announce) => api.put(`${API_URL}/${id}`, Announce);
const getAnnounceById = async (id) => api.get(`${API_URL}/${id}`);
const deleteAnnounce = async (id) => api.delete(`${API_URL}/${id}`);

// 🔍 Announce Detail
const showAnnounceDetail = async (id) => api.get(`${API_URL}/showAnnounceDetails/${id}`);

// 📦 รวม category ทั้งหมด
const getAnnounceWithCategory = async () => api.get(`${API_URL}/showAnnounceWithCategory`);

// 🧠 ฟังก์ชันใหม่ — สำหรับหน้า /filter
const getFilterAnnounceWithAgent = async (arg1, arg2, arg3, arg4) => {
  if (typeof arg1 === 'object' && arg1 !== null) {
    // ✅ ดึงค่าที่เกี่ยวข้องจาก arg1
    const {
      keyword,
      filter,
      type,
      saleType,
      effectiveType, // ✅ เพิ่มรองรับชื่อใหม่
      badge, // ✅ เพิ่ม badge
      bedroomCount,
      minPrice,
      maxPrice,
      page = 0,
      size = 8,
    } = arg1;

    // ✅ ใช้ effectiveType ถ้ามี (เช่นจาก SearchBarWithFilter)
    const finalSaleType = saleType ?? effectiveType ?? "";

    // ✅ สร้าง params พร้อม clean undefined ออก
    const params = {
      keyword,
      type: type ?? filter,
      saleType: finalSaleType, // ✅ key เดิมที่ backend ใช้
      badge, // ✅ เพิ่ม badge
      bedroomCount,
      minPrice,
      maxPrice,
      page,
      size,
    };

    Object.keys(params).forEach((key) => {
      const value = params[key];
      const isEmptyString = typeof value === "string" && value.trim() === "";
      const isZeroBedroom = key === "bedroomCount" && value === 0;
      if (value === undefined || value === null || isEmptyString || isZeroBedroom) {
        delete params[key];
      }
    });

    return await api.get(`${API_URL}/filterAnnounceWithAgent`, { params });
  }

  // ✅ fallback mode: เรียกแบบเดิม (arg1,arg2,arg3,arg4)
  const keyword = arg1;
  const filter = arg2;
  const page = arg3 ?? 0;
  const size = arg4 ?? 8;

  return await api.get(`${API_URL}/filterAnnounceWithAgent`, {
    params: { keyword, type: filter, page, size },
  });
};

const showAllAnnouncePending = async (keyword, page, size) => {
  return await api.get(`${API_URL}/showAllAnnouncePendingByAdmin?keyword=${keyword? keyword:''}&page=${page? page:0}&size=${size? size:10}`)
}
const showAllAnnounceApprove = async (keyword, page, size) => {
  return await api.get(`${API_URL}/showAllAnnounceApproveByAdmin?keyword=${keyword? keyword:''}&page=${page? page:0}&size=${size? size:10}`)
}
const showAllAnnounceHistory = async (keyword, page, size) => {
  return await api.get(`${API_URL}/showAllAnnounceHistoryByAdmin?keyword=${keyword? keyword:''}&page=${page? page:0}&size=${size? size:10}`)
}

const approveAnnounce = async (id) => {
  return await api.put(`${API_URL}/approveAnnounce/${id}`);
}

const rejectAnnounce = async (id, data) => {
  return await api.put(`${API_URL}/rejectAnnounce/${id}`, data);
}



// ✅ export ฟังก์ชันทั้งหมดไว้ให้เรียกง่าย
const AnnounceService = {
  deleteAnnounce,
  createAnnounce,
  updateAnnounce,
  getAnnounceById,
  showAnnounceDetail,
  getAnnounceWithCategory,
  getFilterAnnounceWithAgent,
  showAllAnnouncePending,
  showAllAnnounceApprove,
  showAllAnnounceHistory,
  approveAnnounce,
  rejectAnnounce
};

export default AnnounceService;



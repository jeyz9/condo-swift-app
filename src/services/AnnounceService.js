import api from "./api";
import BadgesService from "./BadgesService";

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


// /api/v1/announces/editAnnounce/{announceId}
const updateAnnounce = async (
  announceId,
  announce,
  imageFiles = [],
  imagesToRemove = []
) => {
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

  //  Append IDs of images to remove
  if (Array.isArray(imagesToRemove) && imagesToRemove.length > 0) {
    formData.append("removeImageIds", JSON.stringify(imagesToRemove));
  }

  return api.put(`${API_URL}/editAnnounce/${announceId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
const getAnnounceById = async (id) => api.get(`${API_URL}/${id}`);
const deleteAnnounce = async (id) => api.delete(`${API_URL}/deletedAnnounce/${id}`);

// 🔍 Announce Detail
const showAnnounceDetail = async (id) => api.get(`${API_URL}/showAnnounceDetails/${id}`);
const showAnnouncePendingDetails = async (id) => api.get(`${API_URL}/showAnnouncePendingDetails/${id}`);
const showAnnounceDetailByAgent = async (id) => api.get(`${API_URL}/showAnnounceDetailsByAgent/${id}`);

// 📦 รวม category ทั้งหมด
const getAnnounceWithCategory = async () => api.get(`${API_URL}/showAnnounceWithCategory`);

// 🧠 ฟังก์ชันใหม่ — สำหรับหน้า /filter
const getFilterAnnounceWithAgent = async (params) => {
  if (typeof params !== "object" || params === null) {
    throw new Error("getFilterAnnounceWithAgent ต้องเรียกด้วย object เท่านั้น");
  }

  const {
    keyword,
    filter,
    type,
    saleType,
    effectiveType,
    badge,
    bedroomCount,
    minPrice,
    maxPrice,
    station,
    province,
    page = 0,
    size,
  } = params;

  const finalSaleType = saleType ?? effectiveType ?? "";

  const finalParams = {
    keyword,
    type: type ?? filter,
    saleType: finalSaleType,
    badge,
    bedroomCount,
    minPrice,
    maxPrice,
    station,
    province,
    page,
    size,
  };

  // ลบค่าที่ว่างออก
  Object.keys(finalParams).forEach((key) => {
    const value = finalParams[key];
    const isEmptyString = typeof value === "string" && value.trim() === "";
    if (value === undefined || value === null || isEmptyString) {
      delete finalParams[key];
    }
  });

  return api.get(`${API_URL}/filterAnnounceWithAgent`, {
    params: finalParams,
  });
};


const showAllAnnouncePending = async (keyword = "", page = 0, size = 1000) => {
  return await api.get(
    `${API_URL}/showAllAnnouncePendingByAdmin`,
    {
      params: {
        keyword,
        page,
        size,
      },
    }
  );
};


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

const getAllAnnouncesWithBadges = async (keyword, badges, page, size) => {
  return await api.get(`${API_URL}/showAllAnnounceBadges?keyword=${keyword}&badges=${badges}&page=${page}&size=${size}`)
}

const showAllAnnounceDraft = async () => {
  return await api.get(`${API_URL}/showAllAnnounceDraft`);
};



//  export ฟังก์ชันทั้งหมดไว้ให้เรียกง่าย
const AnnounceService = {
  deleteAnnounce,
  createAnnounce,
  updateAnnounce,
  getAnnounceById,
  showAnnounceDetail,
  showAnnouncePendingDetails,
  getAnnounceWithCategory,
  getFilterAnnounceWithAgent,
  showAllAnnouncePending,
  showAllAnnounceApprove,
  showAllAnnounceHistory,
  approveAnnounce,
  rejectAnnounce,
  getAllAnnouncesWithBadges,
  showAllAnnounceDraft,
  getAllBadges: BadgesService.getAllBadges,
  addBadge: BadgesService.addBadge,
  updateBadge: BadgesService.updateBadge,
  deleteBadge: BadgesService.deleteBadge,
  addAnnounceBadge: BadgesService.addAnnounceBadge,
  deleteAnnounceBadge: BadgesService.deleteAnnounceBadge,
  showAnnounceDetailByAgent,
};

export default AnnounceService;

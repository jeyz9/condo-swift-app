import api from "./api"; // <— axios instance มี interceptor token, header ฯลฯ

const API_URL =
  import.meta.env.VITE_ANNOUNCE_API ||
  "https://condo-swift.onrender.com/api/v1/announces";

// 🏗 CRUD หลัก
const createAnnounce = async (Announce) => api.post(`${API_URL}/addAnnounce`, Announce);
const getAllAnnounce = async () => api.get(`${API_URL}/`);
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
    const { keyword, filter, type, bedroomCount, minPrice, maxPrice, page = 0, size = 8 } = arg1;
    const params = { keyword, type: type ?? filter, bedroomCount, minPrice, maxPrice, page, size };
    return await api.get(`${API_URL}/filterAnnounceWithAgent`, { params });
  }
  const keyword = arg1;
  const filter = arg2;
  const page = arg3 ?? 0;
  const size = arg4 ?? 8;
  return await api.get(`${API_URL}/filterAnnounceWithAgent`, { params: { keyword, type: filter, page, size } });
};

// ✅ export ฟังก์ชันทั้งหมดไว้ให้เรียกง่าย
const AnnounceService = {
  getAllAnnounce,
  deleteAnnounce,
  createAnnounce,
  updateAnnounce,
  getAnnounceById,
  showAnnounceDetail,
  getAnnounceWithCategory,
  getFilterAnnounceWithAgent,
};

export default AnnounceService;

import api from "./api"; // <— axios instance มี interceptor token, header ฯลฯ
const API_URL = import.meta.env.VITE_SELECTOR_API

// service
const getAllProvinces = async () => {
    return api.get(`${API_URL}/showAllProvinces`)
}

const getAllStations = async () => {
    return api.get(`${API_URL}/showAllStations`)
}

const showAllAnnounceTypes = async () => {
  console.log("Calling showAllAnnounceTypes from ProvinceService");
  return await api.get(`${API_URL}/showAllAnnounceTypes`);
}

const ProvinceService = {
    getAllProvinces,
    getAllStations,
    showAllAnnounceTypes
}

export default ProvinceService

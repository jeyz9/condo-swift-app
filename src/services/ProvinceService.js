import api from "./api"; // <— axios instance มี interceptor token, header ฯลฯ
const API_URL = import.meta.env.VITE_SELECTOR_API

// service
const getAllProvinces = async () => {
    return api.get(`${API_URL}/showAllProvinces`)
}

const getAllStations = async () => {
    return api.get(`${API_URL}/showAllStations`)
}

const ProvinceService = {
    getAllProvinces,
    getAllStations
}

export default ProvinceService

import api from "./api"; // <— axios instance มี interceptor token, header ฯลฯ
const API_URL = import.meta.env.VITE_PROVINCE_API

// service
const getAllProvinces = async () => {
    return api.get(`${API_URL}/showAllProvinces`)
}

const ProvinceService = {
    getAllProvinces
}

export default ProvinceService

import api from "./api";
const API_URL = import.meta.env.VITE_SELECTOR_API

const getAllProvinces = async () => {
    return api.get(`${API_URL}/showAllProvinces`)
}

const getAllStations = async () => {
    return api.get(`${API_URL}/showAllStations`)
}

const showAllAnnounceTypes = async () => {
  return await api.get(`${API_URL}/showAllAnnounceTypes`);
}

const showAllRoles = async () => {
    return await api.get(`${API_URL}/showAllRoles`)
}

const showAllRecipients = async () => {
    return await api.get(`${API_URL}/showAllRecipients`)
}
const ProvinceService = {
    getAllProvinces,
    getAllStations,
    showAllAnnounceTypes,
    showAllRoles,
    showAllRecipients
}

export default ProvinceService

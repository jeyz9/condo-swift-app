import api from "./api";

const API_URL = import.meta.env.VITE_Condo_API || "https://condoSwift-api-er7t.onrender.com/api/Condo"

const createCondo = async (data) => {
  return await api.post(`${API_URL}/`, data);
};

const getAllCondo = async () => {
  return await api.get(`${API_URL}/`);
};

const updateCondo = async (id, Condo) => {
  return await api.put(`${API_URL}/${id}`, Condo);
};

const getCondoById = async (id) => {
  return await api.get(`${API_URL}/${id}`);
};

const deleteCondo = async (id) => {
  return await api.delete(`${API_URL}/${id}`);
};

const CondoService = {
  getAllCondo,
  deleteCondo,
  createCondo,
  updateCondo,
  getCondoById,
};

export default CondoService;
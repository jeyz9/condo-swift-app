import api from "./api";

const API_URL = import.meta.env.VITE_USER_API;

const getUserProfileOverview = async (userId, type = "เช่า") => {
  return await api.get(`${API_URL}/showUserProfileOverview/${userId}?type=${type}`);
};

export default {
  getUserProfileOverview,
};

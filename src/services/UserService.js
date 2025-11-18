import api from "./api";

const API_URL = import.meta.env.VITE_USER_API;

const getUserProfileOverview = async (userId, type = "เช่า") => {
  return await api.get(`${API_URL}/showUserProfileOverview/${userId}?type=${type}`);
};

const showRecommendedAgents = async () => {
  return await api.get(`${API_URL}/showRecommendedAgents`)
}

const uploadProfilePicture = async (userId, imageFile) => {
  const formData = new FormData();
  formData.append("imageFile", imageFile);
  return await api.post(`${API_URL}/${userId}/uploadProfilePicture`, formData,{
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
}

const acceptTerms = async (userId) => {
  return await api.post(`${API_URL}/${userId}/acceptTerms`)
}
export default {
  getUserProfileOverview,
  uploadProfilePicture,
  showRecommendedAgents,
  acceptTerms
};

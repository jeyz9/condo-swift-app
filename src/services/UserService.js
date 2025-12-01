import api from "./api";

const API_URL = import.meta.env.VITE_USER_API;

const profilePublic = async (userId, type = "เช่า") => {
  console.log("Calling profilePublic with userId:", userId); // Logging for diagnosis
  if (!userId) {
    console.error("User ID is missing or invalid. Aborting API call.");
    return Promise.reject(new Error("User ID is missing or invalid."));
  }
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

const deleteProfilePicture = async (userId) => {
  return await api.delete(`${API_URL}/${userId}/deleteProfilePicture`);
};

const acceptTerms = async (userId) => {
  return await api.post(`${API_URL}/${userId}/acceptTerms`)
}

const showAllAnnounceBookmark = async () => {
  return await api.get(`${API_URL}/showAllAnnounceBookmark`);
};

const bookmarkAnnounce = async (announceId) => {
  return await api.put(`${API_URL}/bookmarkAnnounce/${announceId}`);
};

const removeFromBookmark = async (announceId) => {
  return await api.put(`${API_URL}/removeFromBookmark/${announceId}`);
};

const editProfile = async (data) => {
  return await api.put(`${API_URL}/editProfile`, data);
};

export default {
  profilePublic,
  uploadProfilePicture,
  deleteProfilePicture,
  showRecommendedAgents,
  acceptTerms,
  showAllAnnounceBookmark,
  bookmarkAnnounce,
  removeFromBookmark,
  editProfile,
};

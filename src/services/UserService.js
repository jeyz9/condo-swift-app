import api from "./api";

// Standardize URL resolution to be consistent with other services
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

const API_URL = resolveEndpoint(import.meta.env.VITE_USER_API, "/api/v1/users");

const profilePublic = async (userId) => {
  if (!userId) {
    console.error("User ID is missing or invalid. Aborting API call.");
    return Promise.reject(new Error("User ID is missing or invalid."));
  }
  return await api.get(`${API_URL}/showUserProfileOverview/${userId}`);
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

const showUserDetails = async () => {
  return await api.get(`${API_URL}/showUserDetails`);
};

const showAllUser = async (keyword = "", page = 0, size = 10) => {
  return await api.get(`${API_URL}/showAllUser`, {
    params: {
      keyword,
      page,
      size,
    },
  });
};

const addUserRole = async (data) => {
  return await api.post(`${API_URL}/addUserRole`, data)
}

const deleteUserRole = async (data) => {
  return await api.delete(`${API_URL}/deleteUserRole`, {data})
}

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
  showUserDetails,
  showAllUser,
  addUserRole,
  deleteUserRole
};

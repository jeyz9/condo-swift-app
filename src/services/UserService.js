import api from "./api";

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

const normalizeRoles = (rawRoles) => {
  if (!rawRoles) return [];
  if (Array.isArray(rawRoles)) return rawRoles.map((r) => `${r}`.trim()).filter(Boolean);
  if (typeof rawRoles === "string") {
    return rawRoles
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const profileAgent = async (userId, saleType = "") => {
  const query = saleType ? `?saleType=${encodeURIComponent(saleType)}` : "";
  return await api.get(`${baseUrl}/api/v1/agents/profile/${userId}${query}`);
};

const profileOwner = async (userId, saleType = "") => {
  const query = saleType ? `?saleType=${encodeURIComponent(saleType)}` : "";
  return await api.get(`${baseUrl}/api/v1/owners/profile/${userId}${query}`);
};

const profileUser = async (userId) => {
  return await api.get(`${API_URL}/profile/${userId}`);
};


const profilePublic = async (userId, type = "") => {
  if (!userId) {
    console.error("User ID is missing or invalid. Aborting API call.");
    return Promise.reject(new Error("User ID is missing or invalid."));
  }
  let userProfile;
  try {
    const res = await profileUser(userId);
    userProfile = res?.data || {};
  } catch (err) {
    try {
      return await profileAgent(userId, type);
    } catch (err2) {
      try {
        return await profileOwner(userId, type);
      } catch (err3) {
        throw err3;
      }
    }
  }

  const normalizedRoles = normalizeRoles(userProfile.roles)
    .map((role) => role.replace(/^ROLE_/i, "").toUpperCase());

  if (normalizedRoles.includes("AGENT")) {
    return await profileAgent(userId, type);
  }
  if (normalizedRoles.includes("OWNER")) {
    return await profileOwner(userId, type);
  }
  return await profileUser(userId);
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

const acceptTerms = async () => {
  return await api.post(`${API_URL}/acceptTerms`)
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

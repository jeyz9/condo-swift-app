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

const API_URL = resolveEndpoint(
  import.meta.env.VITE_BADGES_API,
  "/api/v1/badges"
);

const getAllBadges = async () => api.get(`${API_URL}/showAllBadges`);


const filterBadges = async (params) =>
  api.get(`${API_URL}/filterBadges`, { params });


const addBadge = async (data) => api.post(`${API_URL}/addedBadge`, data);


const addAnnounceBadge = async (announceId, badgeId) =>
  api.post(`${API_URL}/addAnnounceBadge?announceId=${announceId}&badgeId=${badgeId}`);


const updateBadge = async (id, data) =>
  api.put(`${API_URL}/updatedBadge/${id}`, data);

const deleteBadge = async (id) => api.delete(`${API_URL}/deletedBadge/${id}`);

const deleteAnnounceBadge = async (announceId, badgeId) => {
  return await api.delete(`${API_URL}/deleteBadgeFromAnnounce?announceId=${announceId}&badgeId=${badgeId}`)
}

const BadgesService = {
  getAllBadges,
  filterBadges,
  addBadge,
  addAnnounceBadge,
  updateBadge,
  deleteBadge, 
  deleteAnnounceBadge
};

export default BadgesService;
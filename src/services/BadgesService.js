import api from "./api"; // Use the configured axios instance with interceptors

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

/**
 * GET /api/v1/badges/showAllBadges
 * Fetches all badges.
 */
const getAllBadges = async () => api.get(`${API_URL}/showAllBadges`);

/**
 * GET /api/v1/badges/filterBadges
 * Filters badges based on query parameters.
 * @param {object} params - The filter parameters
 */
const filterBadges = async (params) =>
  api.get(`${API_URL}/filterBadges`, { params });

/**
 * POST /api/v1/badges/addedBadge
 * Adds a new badge.
 * @param {object} data - The badge data to add
 */
const addBadge = async (data) => api.post(`${API_URL}/addedBadge`, data);

/**
 * POST /api/v1/badges/addAnnounceBadge
 * Adds a badge to an announcement.
 * @param {object} data - The announcement badge data
 */
const addAnnounceBadge = async (data) =>
  api.post(`${API_URL}/addAnnounceBadge`, data);

/**
 * PUT /api/v1/badges/updatedBadge/{id}
 * Updates an existing badge.
 * @param {string} id - The ID of the badge to update
 * @param {object} data - The updated badge data
 */
const updateBadge = async (id, data) =>
  api.put(`${API_URL}/updatedBadge/${id}`, data);

/**
 * DELETE /api/v1/badges/deletedBadge/{id}
 * Deletes a badge.
 * @param {string} id - The ID of the badge to delete
 */
const deleteBadge = async (id) => api.delete(`${API_URL}/deletedBadge/${id}`);

const BadgesService = {
  getAllBadges,
  filterBadges,
  addBadge,
  addAnnounceBadge,
  updateBadge,
  deleteBadge,
};

export default BadgesService;
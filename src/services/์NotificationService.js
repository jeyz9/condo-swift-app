import api from "./api"; // axios instance with interceptor token

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
  import.meta.env.VITE_NOTI_API,
  "/api/v1/notifications"
);

const showAllNotificationSelectedByUserId = async (userId) => {
  return api.get(`${API_URL}/showAllNotificationSelectedByUserId/${userId}`);
};

const showNotificationDetailsSelected = async (notifyId, userId) => {
  return api.get(
    `${API_URL}/showNotificationDetailsSelected/${notifyId}?userId=${userId}`
  );
};

const deleteNotification = async (notifyId) => {
  return api.get(`${API_URL}/deleteNotification/${notifyId}?notifyId=${notifyId}`);
};

const sendNotification = async ({ title, message, userId }) => {
  return api.post(`${API_URL}/sendNotification`, {
    title,
    message,
    userId,
  });
};

const NotificationService = {
  sendNotification,
  showAllNotificationSelectedByUserId,
  showNotificationDetailsSelected,
  deleteNotification,
};

export default NotificationService;

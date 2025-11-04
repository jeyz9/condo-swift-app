import api from "./api"; // <— axios instance มี interceptor token, header ฯลฯ
const API_URL = import.meta.env.VITE_NOTI_API


// service
const showAllNotificationSelectedByUserId = async (userId) => {
    return api.get(`${API_URL}/showAllNotificationSelectedByUserId/${userId}`)
}

const showNotificationDetailsSelected = async (notifyId, userId) => {
    return api.get(`${API_URL}/showNotificationDetailsSelected/${notifyId}?userId=${userId}`)
}

const NotificationService = {
    showAllNotificationSelectedByUserId,
    showNotificationDetailsSelected
}

export default NotificationService
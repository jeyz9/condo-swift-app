import api from "./api"; // <— axios instance มี interceptor token, header ฯลฯ
const API_URL = import.meta.env.VITE_NOTI_API


// service
const showAllNotificationSelectedByUserId = async (userId) => {
    return api.get(`${API_URL}/showAllNotificationSelectedByUserId/${userId}`)
}

const showNotificationDetailsSelected = async (notifyId, userId) => {
    return api.get(`${API_URL}/showNotificationDetailsSelected/${notifyId}?userId=${userId}`)
}

const deleteNotification = async (notifyId) => {
    return api.get(`${API_URL}/deleteNotification/${notifyId}?notifyId=${notifyId}`)
}


const NotificationService = {
    showAllNotificationSelectedByUserId,
    showNotificationDetailsSelected,
    deleteNotification,
}

export default NotificationService
import api from "./api"; // <— axios instance มี interceptor token, header ฯลฯ
const API_URL = import.meta.env.VITE_NOTI_API
import axios from 'axios';

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

const sendNotification = async (data) => {
    return api.post(`${API_URL}/sendNotification`, data)
}




const NotificationService = {
    showAllNotificationSelectedByUserId,
    showNotificationDetailsSelected,
    deleteNotification,
    sendNotification
}

export default NotificationService


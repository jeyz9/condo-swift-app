import api from "./api";
const API_URL = import.meta.env.VITE_NOTI_API
import axios from 'axios';

const showAllNotificationSelectedByUserId = async () => {
    return api.get(`${API_URL}/showAllNotificationSelectedByUserId`)
}

const showNotificationDetailsSelected = async (notifyId) => {
    return api.get(`${API_URL}/showNotificationDetailsSelected/${notifyId}`)
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


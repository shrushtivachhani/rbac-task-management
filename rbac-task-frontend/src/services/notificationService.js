import api from '../api/axios';

export const fetchNotifications = () => api.get('/notifications').then(r => r.data);
export const markRead = ids => api.put('/notifications/mark-read', { ids }).then(r => r.data);

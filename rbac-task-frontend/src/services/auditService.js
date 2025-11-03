import api from '../api/axios';

export const fetchAudit = (page = 1, limit = 50) => api.get(`/audit?page=${page}&limit=${limit}`).then(r => r.data);

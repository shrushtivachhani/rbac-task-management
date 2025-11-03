import api from '../api/axios';

export const fetchRoles = () => api.get('/roles').then(r => r.data);
export const createRole = payload => api.post('/roles', payload).then(r => r.data);
export const updateRole = (id, payload) => api.put(`/roles/${id}`, payload).then(r => r.data);
export const deleteRole = id => api.delete(`/roles/${id}`).then(r => r.data);

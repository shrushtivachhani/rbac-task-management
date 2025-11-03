import api from '../api/axios';

export const fetchUsers = () => api.get('/users').then(r => r.data);
export const fetchUser = id => api.get(`/users/${id}`).then(r => r.data);
export const createUser = payload => api.post('/users', payload).then(r => r.data);
export const updateUser = (id, payload) => api.put(`/users/${id}`, payload).then(r => r.data);
export const deleteUser = id => api.delete(`/users/${id}`).then(r => r.data);

import api from '../api/axios';

export const fetchTeams = () => api.get('/teams').then(r => r.data);
export const createTeam = payload => api.post('/teams', payload).then(r => r.data);
export const updateTeam = (id, payload) => api.put(`/teams/${id}`, payload).then(r => r.data);
export const deleteTeam = id => api.delete(`/teams/${id}`).then(r => r.data);

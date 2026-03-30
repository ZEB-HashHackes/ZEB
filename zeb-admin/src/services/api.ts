import axios from 'axios';

const api = axios.create({
  baseURL: 'https://zeb-1.onrender.com/api',
});

export const adminApi = {
  getRevenueStats: () => api.get('/admin/revenue').then(res => res.data.data),
  getFlaggedArtworks: () => api.get('/admin/flags').then(res => res.data.data),
  resolveFlag: (id: string, status: 'active' | 'rejected') => 
    api.patch(`/admin/flags/${id}`, { status }).then(res => res.data.data),
  getTransactionsByType: (type: string) => api.get(`/admin/revenue/${type}`).then(res => res.data.data),
};

export default api;

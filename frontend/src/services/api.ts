import axios from 'axios';

const API_BASE_URL = (typeof process !== 'undefined' && process.env.VITE_API_URL) 
  ? process.env.VITE_API_URL 
  : '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

export const leadsApi = {
  getAll: () => apiClient.get('/leads'),
  getById: (id: string) => apiClient.get(`/leads/${id}`),
  create: (data: any) => apiClient.post('/leads', data),
  update: (id: string, data: any) => apiClient.put(`/leads/${id}`, data),
  delete: (id: string) => apiClient.delete(`/leads/${id}`),
};

export const campaignsApi = {
  getAll: () => apiClient.get('/campaigns'),
  getById: (id: string) => apiClient.get(`/campaigns/${id}`),
  create: (data: any) => apiClient.post('/campaigns', data),
  update: (id: string, data: any) => apiClient.put(`/campaigns/${id}`, data),
  delete: (id: string) => apiClient.delete(`/campaigns/${id}`),
  start: (id: string) => apiClient.post(`/campaigns/${id}/start`),
  pause: (id: string) => apiClient.post(`/campaigns/${id}/pause`),
};

export const analyticsApi = {
  overview: () => apiClient.get('/analytics/overview'),
  campaignStats: (campaignId: string) => apiClient.get(`/analytics/campaigns/${campaignId}`),
  leadStats: (leadId: string) => apiClient.get(`/analytics/leads/${leadId}`),
};

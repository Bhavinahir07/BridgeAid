import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const unwrap = async (requestPromise) => {
  try {
    const response = await requestPromise;
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.error || error?.response?.data?.detail || error.message || 'Request failed';
    throw new Error(message);
  }
};

export const getNgoProfile = () => unwrap(api.get('/ngo-profile/'));
export const updateNgoProfile = (payload) => unwrap(api.post('/ngo-profile/', payload));
export const getNgoCampaigns = () => unwrap(api.get('/my-campaigns/'));
export const getCampaignParticipants = (campaignId) => unwrap(api.get(`/campaign-participants/${campaignId}/`));
export const updateParticipation = (payload) => unwrap(api.post('/update-participation/', payload));
export const getCampaignDetail = (campaignId) => unwrap(api.get(`/campaign/${campaignId}/`));
export const createCampaign = (payload) => unwrap(api.post('/create-campaign/', payload));

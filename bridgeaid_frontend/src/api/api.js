const BASE_URL = 'http://127.0.0.1:8000/api';

const getToken = () => localStorage.getItem('access_token');

const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const request = async (endpoint, options = {}, fallbackMessage = 'Request failed') => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let json = {};

  if (text) {
    try {
      json = JSON.parse(text);
    } catch {
      throw new Error(fallbackMessage);
    }
  }

  if (!response.ok) {
    throw new Error(json.error || json.detail || fallbackMessage);
  }

  return json;
};

export const getProfile = () => request('/profile/', { method: 'GET' }, 'Failed to fetch profile');
export const updateProfile = (payload) =>
  request('/profile/', { method: 'PUT', body: JSON.stringify(payload) }, 'Failed to update profile');
export const getCampaigns = () => request('/campaigns/', { method: 'GET' }, 'Failed to fetch campaigns');
export const getRecommendedCampaigns = () =>
  request('/recommended-campaigns/', { method: 'GET' }, 'Failed to fetch recommended campaigns');
export const joinCampaign = (payload) =>
  request('/join-campaign/', { method: 'POST', body: JSON.stringify(payload) }, 'Failed to join campaign');
export const getMyCampaigns = () => request('/my-campaigns/', { method: 'GET' }, 'Failed to fetch my campaigns');

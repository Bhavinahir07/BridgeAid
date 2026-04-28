const BASE_URL = 'http://127.0.0.1:8000/api';

const parseJSON = async (response, fallbackMessage) => {
  const text = await response.text();
  if (!text) {
    throw new Error(fallbackMessage);
  }

  try {
    const json = JSON.parse(text);
    if (!response.ok) {
      throw new Error(json.error || json.detail || fallbackMessage);
    }
    return json;
  } catch (error) {
    throw new Error(response.ok ? fallbackMessage : error.message || fallbackMessage);
  }
};

export const getAuthToken = () => localStorage.getItem('access_token');

export const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
});

const requestJson = async (url, options, fallbackMessage) => {
  const response = await fetch(url, options);
  return parseJSON(response, fallbackMessage);
};

export const authAPI = {
  login: async (credentials) =>
    requestJson(`${BASE_URL}/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    }, 'Login failed'),

  signup: async (userData) =>
    requestJson(`${BASE_URL}/signup/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    }, 'Signup failed'),

  loginUser: async (credentials) => {
    const data = await authAPI.login(credentials);
    const token = data.access_token || data.access;
    if (!token) {
      throw new Error('Missing access token');
    }

    tokenManager.setToken(token);
    const profile = await profileAPI.getProfile();
    tokenManager.setRole(profile.role);
    return profile;
  },

  signupUser: async (userData) => {
    const data = await authAPI.signup(userData);
    const token = data.access_token || data.access;
    if (!token) {
      throw new Error('Missing access token');
    }

    tokenManager.setToken(token);
    const profile = await profileAPI.getProfile();
    tokenManager.setRole(profile.role);
    return profile;
  },
};

export const profileAPI = {
  getProfile: async () =>
    requestJson(`${BASE_URL}/profile/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    }, 'Failed to fetch profile'),

  updateProfile: async (profileData) =>
    requestJson(`${BASE_URL}/profile/`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    }, 'Failed to update profile'),
};

export const campaignAPI = {
  getCampaigns: async () =>
    requestJson(`${BASE_URL}/campaigns/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    }, 'Failed to fetch campaigns'),

  getMyCampaigns: async () =>
    requestJson(`${BASE_URL}/my-campaigns/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    }, 'Failed to fetch my campaigns'),

  createCampaign: async (campaignData) =>
    requestJson(`${BASE_URL}/create-campaign/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(campaignData),
    }, 'Failed to create campaign'),

  joinCampaign: async (payload) =>
    requestJson(`${BASE_URL}/join-campaign/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }, 'Failed to join campaign'),

  getParticipants: async () =>
    requestJson(`${BASE_URL}/campaign-participants/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    }, 'Failed to fetch participants'),

  updateParticipation: async (payload) =>
    requestJson(`${BASE_URL}/update-participation/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    }, 'Failed to update participation'),

  getRecommendedCampaigns: async () =>
    requestJson(`${BASE_URL}/recommended-campaigns/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    }, 'Failed to fetch recommended campaigns'),
};

export const tokenManager = {
  setToken: (token) => {
    localStorage.setItem('access_token', token);
  },

  getToken: () => localStorage.getItem('access_token'),

  removeToken: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_role');
  },

  setRole: (role) => {
    localStorage.setItem('user_role', role);
  },

  getRole: () => localStorage.getItem('user_role'),

  isAuthenticated: () => !!getAuthToken(),
};

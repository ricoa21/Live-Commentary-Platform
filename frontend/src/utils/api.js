import axios from 'axios';

const BASE_URL = 'http://localhost:4000/api'; // Your backend server URL

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

export const getFixtures = async (params = {}) => {
  try {
    const response = await api.get('/fixtures', { params });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    throw error;
  }
};

export const getFixtureById = async (fixtureId, params = {}) => {
  try {
    const response = await api.get(`/fixtures/${fixtureId}`, { params });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching fixture ${fixtureId}:`, error);
    throw error;
  }
};

export default api;

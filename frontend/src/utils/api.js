import axios from 'axios';

const BASE_URL = 'https://api.sportmonks.com/v3/football';
const API_KEY = 'ygK23d0Wym1qwEEu7Zch3fEO01VzhuNltJoR1sYEsbLNxCshvjEmTY3E3beE';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: API_KEY,
    Accept: 'application/json',
  },
});

export const getFixtures = async (params = {}) => {
  try {
    const response = await api.get('/fixtures', {
      params: {
        include: 'localTeam,visitorTeam',
        ...params,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    throw error;
  }
};

export const getFixtureById = async (fixtureId, params = {}) => {
  try {
    const response = await api.get(`/fixtures/${fixtureId}`, {
      params: {
        include: 'localTeam,visitorTeam,events,statistics',
        ...params,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching fixture ${fixtureId}:`, error);
    throw error;
  }
};

export default api;
